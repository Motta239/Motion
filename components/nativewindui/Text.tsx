import { VariantProps, cva } from 'class-variance-authority';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { UITextView } from 'react-native-uitextview';

import { cn } from '~/lib/cn';
import { useColorScheme } from '~/lib/useColorScheme';

cssInterop(UITextView, { className: 'style' });

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      largeTitle: 'text-base',
      title1: 'text-sm',
      title2: 'text-[14px] leading-5',
      title3: 'text-xs',
      heading: 'text-[12px] leading-4 font-semibold',
      body: 'text-[11px] leading-4',
      callout: 'text-[10px] leading-3',
      subhead: 'text-[9px] leading-3',
      footnote: 'text-[8px] leading-3',
      caption1: 'text-[7px] leading-2',
      caption2: 'text-[6px] leading-2',
    },
    color: {
      primary: '',
      secondary: 'text-secondary-foreground/90',
      tertiary: 'text-muted-foreground/90',
      quarternary: 'text-muted-foreground/50',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'primary',
  },
});

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  variant,
  color,
  ...props
}: React.ComponentPropsWithoutRef<typeof UITextView> & VariantProps<typeof textVariants>) {
  const textClassName = React.useContext(TextClassContext);
  const { colorScheme } = useColorScheme();
  return (
    <UITextView
      maxFontSizeMultiplier={1.0000000004}
      className={cn(textVariants({ variant, color }), textClassName, className)}
      style={{
        color: colorScheme === 'dark' ? 'white' : 'black',
      }}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
