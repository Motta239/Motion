import { VariantProps, cva } from 'class-variance-authority';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { FlatList as RNFlatList } from 'react-native';
import { cn } from '~/lib/cn';

cssInterop(RNFlatList, { className: 'style' });

const flatListVariants = cva('flex-1', {
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
    columns: {
      one: '',
      two: 'flex-row flex-wrap',
      three: 'flex-row flex-wrap',
      four: 'flex-row flex-wrap',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'none',
    spacing: 'none',
    columns: 'one',
  },
});

const FlatListClassContext = React.createContext<string | undefined>(undefined);

function FlatList<T>({
  className,
  variant,
  padding,
  spacing,
  columns,
  numColumns,
  contentContainerStyle,
  ...props
}: React.ComponentPropsWithoutRef<typeof RNFlatList<T>> & VariantProps<typeof flatListVariants>) {
  const flatListClassName = React.useContext(FlatListClassContext);

  const getNumColumns = () => {
    if (numColumns) return numColumns;
    switch (columns) {
      case 'two':
        return 2;
      case 'three':
        return 3;
      case 'four':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <RNFlatList
      className={cn(
        flatListVariants({ variant, padding, spacing, columns }),
        flatListClassName,
        className
      )}
      numColumns={getNumColumns()}
      contentContainerStyle={[
        spacing && { gap: spacing === 'sm' ? 8 : spacing === 'md' ? 16 : 24 },
        contentContainerStyle,
      ]}
      {...props}
    />
  );
}

export { FlatList, FlatListClassContext, flatListVariants };
