import { VariantProps, cva } from 'class-variance-authority';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';
import { cn } from '~/lib/cn';

cssInterop(RNTouchableOpacity, { className: 'style' });

const touchableOpacityVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-background active:opacity-70',
      primary: 'bg-primary active:opacity-70',
      secondary: 'bg-secondary active:opacity-70',
      ghost: 'bg-transparent active:bg-muted',
      link: 'bg-transparent active:underline',
    },
    size: {
      default: 'p-2',
      sm: 'p-1',
      lg: 'p-3',
      icon: 'p-2',
    },
    rounded: {
      none: '',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    rounded: 'none',
  },
  compoundVariants: [
    {
      variant: 'primary',
      disabled: true,
      className: 'bg-primary/50',
    },
  ],
});

const TouchableOpacityClassContext = React.createContext<string | undefined>(undefined);

function TouchableOpacity({
  className,
  variant,
  size,
  rounded,
  disabled,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNTouchableOpacity> &
  VariantProps<typeof touchableOpacityVariants>) {
  const touchableOpacityClassName = React.useContext(TouchableOpacityClassContext);
  return (
    <RNTouchableOpacity
      className={cn(
        touchableOpacityVariants({ variant, size, rounded, disabled }),
        touchableOpacityClassName,
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}

export { TouchableOpacity, TouchableOpacityClassContext, touchableOpacityVariants };
