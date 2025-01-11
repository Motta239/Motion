import { Tabs, usePathname } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, View } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { TabBarIcon } from '~/components/TabBarIcon';
import { GlobalBackground } from '~/components/GlobalBackground';

export default function TabLayout() {
  const { isDarkColorScheme } = useColorScheme();
  const pathname = usePathname();
  return (
    <View className="flex-1">
      <GlobalBackground>
        <Tabs
          screenOptions={({ route }) => {
            return {
              headerShown: false,

              tabBarLabelStyle: {
                marginTop: 5,
              },
              // tabBarBackground: () => (
              //   <BlurView
              //     tint={isDarkColorScheme ? 'dark' : 'light'}
              //     intensity={70}
              //     style={{
              //       position: 'absolute',
              //       top: 0,
              //       left: 0,
              //       right: 0,
              //       bottom: 0,
              //     }}
              //   />
              // ),
            };
            1;
          }}>
          <Tabs.Screen
            name="home"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name="home" color={focused ? '#fff' : color} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name="search" color={focused ? '#fff' : color} />
              ),
            }}
          />
          <Tabs.Screen
            name="for-you"
            options={{
              title: 'For You',

              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name="heart" color={focused ? '#fff' : color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, focused }) => (
                <TabBarIcon name="user" color={focused ? '#fff' : color} />
              ),
            }}
          />
          <Tabs.Screen
            name="[...segments]"
            options={{
              href: null,
              headerShown: false,
            }}
          />
        </Tabs>
      </GlobalBackground>
    </View>
  );
}
