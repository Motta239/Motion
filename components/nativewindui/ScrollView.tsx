import { VariantProps, cva } from 'class-variance-authority';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { ScrollView as RNScrollView } from 'react-native';
import { cn } from '~/lib/cn';

cssInterop(RNScrollView, { className: 'style' });

const scrollViewVariants = cva('flex-1', {
  variants: {
    variant: {
      default: 'bg-background',
      transparent: 'bg-transparent',
    },
    padding: {
      none: '',
      sm: 'px-2',
      md: 'px-4',
      lg: 'px-6',
    },
    spacing: {
      none: '',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'none',
    spacing: 'none',
  },
});

const ScrollViewClassContext = React.createContext<string | undefined>(undefined);

function ScrollView({
  className,
  variant,
  padding,
  spacing,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNScrollView> & VariantProps<typeof scrollViewVariants>) {
  const scrollViewClassName = React.useContext(ScrollViewClassContext);
  return (
    <RNScrollView
      className={cn(
        scrollViewVariants({ variant, padding, spacing }),
        scrollViewClassName,
        className
      )}
      {...props}
    />
  );
}

export { ScrollView, ScrollViewClassContext, scrollViewVariants };
