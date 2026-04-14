# Jest + Testing Library
## Versão: Jest 29+, Testing Library React 14+, ts-jest 29+
## Por que usamos:
- Testes rápidos e confiáveis para frontend React (unit/integration).
- Testing Library promove testes orientados ao comportamento do usuário.
- Integração com MSW para mocks de rede realistas.
- Para backend Django, usamos pytest/pytest-django que complementam Jest para frontend.

---

## Setup Básico
### Frontend (React + TypeScript)
Instalar dependências:

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom msw
```

Jest config (jest.config.js):

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

setupTests.ts:

```ts
import '@testing-library/jest-dom/extend-expect';
```

MSW setup (src/mocks/server.ts):

```ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

src/setupTests.ts (com MSW):

```ts
import '@testing-library/jest-dom/extend-expect';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## API/Components (principais utilitários)
- render, screen, fireEvent, userEvent (Testing Library)
- jest.fn() e mocks manuais
- msw para interceptar chamadas fetch/axios
- toHaveTextContent, toBeInTheDocument, toHaveAttribute do jest-dom

Exemplo de teste de componente:

```tsx
// src/__tests__/Login.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../store';
import Login from '../components/Login';

test('successful login calls API and stores token', async () => {
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );
  await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
});
```

---

## Integração Stack SH
- Frontend: Jest + RTL para components, MSW para endpoints Django.
- Backend: pytest/pytest-django para testes unitários e integração do Django.
- CI: rodar jest --coverage e pytest em paralelo; falhar build em coverage abaixo do threshold.
- Fixtures: alinhar fixtures de dados entre MSW handlers e Django fixtures para consistência nos testes de integração ponta a ponta.

---

## Não Fazer ❌
- Testar implementação (interagir com internals) em vez do comportamento do usuário.
- Bloquear testes com timeouts longos; usar waits inteligentes (findBy, waitFor).
- Usar network real em testes unitários (sempre mockar via MSW em frontend).

---

## Fazer Sempre ✅
- Nomear testes de forma descritiva.
- Usar MSW para centralizar handlers e manter consistência.
- Separar testes unitários e testes de integração/end-to-end.
- Medir coverage e escrever testes para caminhos críticos (auth, payments, core logic).

---

## Tests Obrigatórios (templates)
### 1) Frontend: Component test com MSW

```ts
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('http://localhost:8000/api/auth/login/', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ token: 'abc' }));
  }),
];
```

```ts
// src/__tests__/Login.integration.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login';
import { Provider } from 'react-redux';
import { store } from '../store';

test('login flow', async () => {
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );
  await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'pw');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
});
```

### 2) Backend: pytest-django basic test

```py
# tests/test_models.py
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_create_user():
    user = User.objects.create_user(username='u1', email='u1@x.com', password='pw')
    assert user.pk is not None
```

### 3) Integration: end-to-end (optional) usando playwright / cypress (referenciar)
- Exemplo de job: rodar backend test server e usar playwright para cenários críticos.

---

## Links
- Jest: https://jestjs.io/
- Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- msw: https://mswjs.io/
- pytest-django: https://pytest-django.readthedocs.io/

---

Notas finais: Documentação adaptada para Stack SH; integrar handlers do MSW com fixtures Django para testes de integração mais confiáveis.
