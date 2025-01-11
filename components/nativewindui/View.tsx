import { VariantProps, cva } from 'class-variance-authority';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { View as RNView } from 'react-native';
import { cn } from '~/lib/cn';

cssInterop(RNView, { className: 'style' });

const viewVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-background',
      card: 'bg-card rounded-lg',
      muted: 'bg-muted',
      transparent: 'bg-transparent',
    },
    padding: {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
    rounded: {
      none: '',
      sm: 'rounded',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'none',
    rounded: 'none',
  },
});

const ViewClassContext = React.createContext<string | undefined>(undefined);

function View({
  className,
  variant,
  padding,
  rounded,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNView> & VariantProps<typeof viewVariants>) {
  const viewClassName = React.useContext(ViewClassContext);
  return (
    <RNView
      className={cn(viewVariants({ variant, padding, rounded }), viewClassName, className)}
      {...props}
    />
  );
}

export { View, ViewClassContext, viewVariants };
