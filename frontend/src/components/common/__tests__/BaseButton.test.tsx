import React from 'react';
import { render, screen } from '@testing-library/react';
import { BaseButton } from '../BaseButton';

jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');

  return {
    ...actual,
    Button: ({ children, color, variant, ...props }: any) => (
      <button data-color={color || ''} data-variant={variant || ''} {...props}>
        {children}
      </button>
    ),
  };
});

describe('BaseButton', () => {
  it('maps the project variants to MUI button props', () => {
    render(
      <>
        <BaseButton>Primário</BaseButton>
        <BaseButton variant="secondary">Secundário</BaseButton>
        <BaseButton variant="danger">Perigo</BaseButton>
        <BaseButton variant="outlined">Contorno</BaseButton>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Primário' })).toHaveAttribute('data-variant', 'contained');
    expect(screen.getByRole('button', { name: 'Secundário' })).toHaveAttribute('data-color', 'secondary');
    expect(screen.getByRole('button', { name: 'Perigo' })).toHaveAttribute('data-color', 'error');
    expect(screen.getByRole('button', { name: 'Contorno' })).toHaveAttribute('data-variant', 'outlined');
  });
});