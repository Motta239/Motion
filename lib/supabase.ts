import { createClient, User, Session, AuthApiError, AuthError } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import MMKVStorage from './storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { showToast as toast } from '~/components/ui/toast';
import { router } from 'expo-router';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;



export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: MMKVStorage, // Use MMKV storage adapter
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener('change', (state) => {
  //console.log(state);
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: AuthError | null;
}

// Database types based on your schema
export interface Artist {
  id: number;
  name: string;
  genre_id: number;
  country_id: number;
  formed_year: number;
  image_url: string;
  biography: string;
}

export interface Album {
  id: number;
  title: string;
  release_date: string;
  artist_id: number;
  label_id: number;
  total_tracks: number;
  cover_image_url: string;
}

export interface Track {
  id: number;
  title: string;
  duration: string;
  album_id: number;
  track_number: number;
  explicit: boolean;
  lyrics: string;
  url: string;
}

export interface Playlist {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  cover_image_url: string;
}
export interface Genre {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
}
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

export function useQueryConfig<T>(): Partial<UseQueryOptions<T, ApiError>> {
  const netInfo = useNetInfo();

  return {
    retry: (failureCount, error) => {
      if (error.code === 'NOT_FOUND') return false;
      if (error.code === 'NETWORK_ERROR') return failureCount < 3;
      return failureCount < 1;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: (data) => netInfo.isConnected?.valueOf() ? 30000 : 5000,
    // Remove onError from here and handle errors in individual query hooks
    staleTime: 1000 * 60 * 5,
    
  };
}

// Sign in function
export function useSignInWithEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { user, session, error: null };
    },
    onSuccess: ({ user, session }: { user: User | null; session: Session | null }) => {
      if (user && session) {
        queryClient.setQueryData(['auth', 'session'], session);
          router.replace('/(tabs)');
          toast.success('Logged in successfully');
        }
      },
      onError: (error: AuthError) => {
        toast.error(error.message);
      }
    }
  );
}

export function useSignUpWithEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: email.split('@')[0],
          }
        }
      });

      const {
        data: { user, session },
        error,
      } = response;

      if (error) {
        console.log('Supabase signup error:', {
          message: error.message,
          status: error.status,
          name: error.name,
          details: error
        });
        throw error;
      }

      // Shorter wait time for the trigger
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { user, session };
    },
    onSuccess: ({ user, session }) => {
      if (user && session) {
        queryClient.setQueryData(['auth', 'session'], session);
        toast.success('Account created successfully');
        router.replace('/(tabs)');
      }
    },
    onError: (error: AuthError) => {
      toast.error(error.message || 'Registration failed');
    }
  });
}


export async function signInWithProvider(provider: 'google' | 'facebook') {
  try {
    // Get the redirect URL for Expo development client
    const redirectUrl = 'exp+spotify://expo-development-client/?url=http%3A%2F%2F192.168.1.190%3A8081';

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        queryParams: provider === 'google' 
          ? {
              access_type: 'offline',
              prompt: 'consent',
            }
          : undefined,
        scopes: provider === 'google' 
          ? 'profile email' 
          : 'public_profile email',
      },
    });

    if (error) throw error;

    if (!data.url) throw new Error('No OAuth URL returned');

    // Open the OAuth URL in a browser
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUrl,
      {
        showInRecents: true,
        preferEphemeralSession: true,
      }
    );

    if (result.type === 'success' && result.url) {
      // Extract tokens from the URL
      const params = new URLSearchParams(result.url.split('#')[1]);
      const access_token = params.get('access_token');
      
      if (access_token) {
        // Get the session directly instead of setting it manually
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        return { data: session, error: null };
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('OAuth error:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
    };
  }
}
// Logout function
export async function logout(): Promise<{ error?: AuthError | null }> {

  const { error } = await supabase.auth.signOut();
  return { error };
}

interface PasswordResetResponse {
  error: AuthError | null;
  success: boolean;
  message: string;
}

export const sendPasswordResetEmail = async (email: string): Promise<PasswordResetResponse> => {
  try {
    // First, check if the user exists
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !existingUser) {
      return {
        error: new AuthError('No account found with this email address'),
        success: false,
        message: 'No account found with this email address'
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'exp+spotify://expo-development-client/?url=http%3A%2F%2F192.168.1.190%3A8081/reset-password',
    });

    if (error) {
      toast.error(error.message);
      return {
        error,
        success: false,
        message: error.message
      };
    }

    return {
      error: null,
      success: true,
      message: 'Check your email for the password reset link'
    };
  } catch (err) {
    console.error('Unexpected error in sendPasswordResetEmail:', err);
    const error = err instanceof AuthError ? err : new AuthError('An unexpected error occurred');
    return {
      error,
      success: false,
      message: error.message
    };
  }
};



// src/utils/error-handler.ts
export function handleQueryError(error: any): ApiError {
  if (error?.code === 'PGRST301') {
    return {
      message: 'Database row not found',
      code: 'NOT_FOUND',
      status: 404,
    };
  }

  if (error?.code?.startsWith('PGRST')) {
    return {
      message: 'Database error occurred',
      code: 'DATABASE_ERROR',
      status: 500,
      details: error,
    };
  }

  if (error?.message?.includes('network')) {
    return {
      message: 'Network connection error',
      code: 'NETWORK_ERROR',
      status: 0,
      details: error,
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500,
    details: error,
  };
}
export function useArtists(userId?: User | null) {
  const queryConfig = useQueryConfig<Artist[]>();

  return useQuery({
    ...queryConfig,
    queryKey: ['artists', userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('artists')
          .select(`
            *,
            genres:genre_id(name),
            countries:country_id(name, code),
            albums:albums(count)
          `)
          .order('name');

        if (error) throw error;
        if (!data) throw new Error('No data returned');

        return data;
      } catch (error) {
        throw handleQueryError(error);
      }
    },
    enabled: !!userId,
  });
}

export function useArtistDetails(artistId: number) {
  return useQuery({
    ...useQueryConfig(),
    queryKey: ['artists', artistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select(`
          *,
          genres:genre_id(name),
          countries:country_id(name),
          albums:albums(*)
        `)
        .eq('id', artistId)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useAlbums() {
  return useQuery({
    
    queryKey: ['albums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          artists:artist_id(*),
          labels:label_id(*)
        `)
        .order('release_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useAlbumDetails(albumId: number) {
  return useQuery({
    ...useQueryConfig(),
    queryKey: ['albums', albumId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('albums')
        .select(`
          *,
          artists:artist_id(*),
          labels:label_id(*),
          tracks:tracks(*)
        `)
        .eq('id', albumId)
        .single();

      if (error) throw error;
      return data;
    },
  });
}
export function useTracks() {
  return useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          albums:album_id(
            *,
            artists:artist_id(*)
          )
        `)
        .order('title');

      if (error) throw error;
      return data;
    },
  });
}

export function useTrackDetails(trackId: number) {
  return useQuery({
    queryKey: ['tracks', trackId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          albums:album_id(
            *,
            artists:artist_id(*)
          )
        `)
        .eq('id', trackId)
        .single();

      if (error) throw error;
      return data;
    },
  });
}
// src/hooks/queries/usePlaylists.ts


export function usePlaylists(userId?: number) {
  return useQuery({
    queryKey: ['playlists', userId],
    queryFn: async () => {
      let query = supabase
        .from('playlists')
        .select(`
          *,
          user_playlists!inner(user_id),
          playlist_tracks(
            tracks(
              *,
              albums:album_id(
                *,
                artists:artist_id(*)
              )
            )
          )
        `);

      if (userId) {
        query = query.eq('user_playlists.user_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as Playlist[]
    },
  });
}

export function usePlaylistDetails(playlistId: number) {
  return useQuery({
    queryKey: ['playlists', playlistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          user_playlists(
            users:user_id(*)
          ),
          playlist_tracks(
            tracks(
              *,
              albums:album_id(
                *,
                artists:artist_id(*)
              )
            )
          )
        `)
        .eq('id', playlistId)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

// Mutation to add track to playlist
export function useAddTrackToPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, trackId }: { playlistId: number; trackId: number }) => {
      const { error } = await supabase
        .from('playlist_tracks')
        .insert({ playlist_id: playlistId, track_id: trackId });

      if (error) throw error;
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['playlists', playlistId] });
    },
  });
}

// Mutation to remove track from playlist
export function useRemoveTrackFromPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, trackId }: { playlistId: number; trackId: number }) => {
      const { error } = await supabase
        .from('playlist_tracks')
        .delete()
        .eq('playlist_id', playlistId)
        .eq('track_id', trackId);

      if (error) throw error;
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['playlists', playlistId] });
    },
  });
}
export function useGenres(userId:User | null ) {
  return useQuery({
    queryKey: ['genres', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('genres')
        .select(`
          *,
          artists:artists(count)
        `)
        .order('name');

      if (error) throw error;
      return data as (Genre & { artists: number })[];
    },
    enabled: !!userId, // Only run if userId is provided
  });
}
// src/hooks/queries/useCountries.ts



export function useCountries(userId:User | null ) {
  return useQuery({
    queryKey: ['countries', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select(`
          *,
          artists:artists(count)
        `)
        .order('name');

      if (error) throw error 
      ;   
      return data as (Country & { artists: number })[]
    },
    enabled: !!userId,
  });
}