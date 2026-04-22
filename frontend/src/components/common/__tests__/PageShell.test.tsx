import React from 'react';
import { render, screen } from '@testing-library/react';
import PageShell from '../PageShell';

describe('PageShell', () => {
  it('renders the page title, description and content', () => {
    render(
      <PageShell title="Título da página" description="Resumo da tela">
        <span>Conteúdo principal</span>
      </PageShell>,
    );

    expect(screen.getByText('Título da página')).toBeInTheDocument();
    expect(screen.getByText('Resumo da tela')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo principal')).toBeInTheDocument();
  });
});