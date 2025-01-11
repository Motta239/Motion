import { VariantProps, cva } from 'class-variance-authority';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { Pressable as RNPressable } from 'react-native';
import { cn } from '~/lib/cn';

cssInterop(RNPressable, { className: 'style' });

const pressableVariants = cva('', {
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

const PressableClassContext = React.createContext<string | undefined>(undefined);

function Pressable({
  className,
  variant,
  size,
  rounded,
  disabled,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNPressable> & VariantProps<typeof pressableVariants>) {
  const pressableClassName = React.useContext(PressableClassContext);
  return (
    <RNPressable
      className={cn(
        pressableVariants({ variant, size, rounded, disabled }),
        pressableClassName,
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}

export { Pressable, PressableClassContext, pressableVariants };
