import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface BaseButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outlined';
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  const getProps = () => {
    switch (variant) {
      case 'secondary':
        return { color: 'secondary' as const, variant: 'contained' as const };
      case 'danger':
        return { color: 'error' as const, variant: 'contained' as const };
      case 'outlined':
        return { variant: 'outlined' as const };
      default:
        return { variant: 'contained' as const };
    }
  };

  return (
    <Button {...getProps()} {...props}>
      {children}
    </Button>
  );
};

export default BaseButton;
