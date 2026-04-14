# ESLint + Prettier
## Versão: ESLint 8+, Prettier 3+, Plugins atualizados
## Por que usamos:
- Garantir consistência de código e qualidade (React + TypeScript).
- Prettier padroniza formatação; ESLint aplica regras de qualidade e melhores práticas.
- Para backend Django, usar linters Python (flake8/ruff), formatador (black) e isort para imports.

---

## Setup Básico
### Frontend (React + TypeScript)
Instalar dependências principais:

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-jsx-a11y eslint-plugin-import
```

Exemplo .eslintrc.js:

```js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
  env: { browser: true, node: true, es6: true, jest: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier'
  ],
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'jsx-a11y', 'import'],
  settings: { react: { version: 'detect' } },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
```

Exemplo .prettierrc:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "endOfLine": "lf"
}
```

package.json scripts recomendados:

```json
{
  "scripts": {
    "lint": "eslint 'src/**/*.{js,ts,tsx}' --max-warnings=0",
    "format": "prettier --write 'src/**/*.{js,ts,tsx,json,css,md}'"
  }
}
```

### Backend (Django/Python)
Preferir ruff (rápido) ou flake8 + black + isort.

Instalar:

```bash
pip install ruff black isort
```

pyproject.toml (trecho):

```toml
[tool.black]
line-length = 88

[tool.isort]
profile = "black"

[tool.ruff]
line-length = 88
select = ["E", "F", "W", "C", "B", "I"]
```

Scripts (Makefile / package.json para CI):

```makefile
lint-py:
	ruff check .
	black --check .
	isort --check-only .

lint-js:
	npm run lint

lint: lint-py lint-js
```

---

## API/Components (principais utilitários e integrações)
- ESLint rules customizadas para a Stack SH (desabilitar regras conflitantes com Prettier via eslint-config-prettier).
- Plugins úteis: eslint-plugin-import (organização de imports), eslint-plugin-jest (test linting), eslint-plugin-testing-library.
- Integrar com VSCode: usar ESLint extension e Prettier extension; configurar formatOnSave somente se estiver confortável.
- Pre-commit hooks: usar pre-commit (Python) ou Husky (JS) para rodar lint/format antes do commit.

Exemplo Husky + lint-staged:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

package.json:

```json
"lint-staged": {
  "src/**/*.{js,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "**/*.{py}": ["ruff format -- ./"]
}
```

Exemplo .pre-commit-config.yaml (recomendado para o backend Python):

```yaml
repos:
  - repo: https://github.com/charliermarsh/ruff-pre-commit
    rev: v0.0.241
    hooks:
      - id: ruff
        args: ["check", "--fix"]
  - repo: https://github.com/psf/black
    rev: 23.9.1
    hooks:
      - id: black
  - repo: https://github.com/PyCQA/isort
    rev: 5.12.0
    hooks:
      - id: isort
```


---

## Integração Stack SH (Django + React)
- CI: incluir etapas de linting separadas para backend e frontend (falhar build se linting falhar).
- Code review: aplicar regras comuns nos PRs; configurar GitHub Super-Linter como opção leve.
- Padronizar configurações em repositório monorepo (central .eslintrc, pyproject.toml), permitindo overrides por pacote.
- Pré-commit: combinar Husky (frontend) e pre-commit (backend) para uma experiência unificada.

---

## Não Fazer ❌
- Desligar regras críticas apenas para passar CI (corrigir raiz do problema).
- Mixar estilos sem regras claras (Prettier + regras ESLint conflitantes sem config adequada).
- Rodar formatadores em commits sem revisão (use CI para validar).

---

## Fazer Sempre ✅
- Manter regras mínimas consistentes e documentadas.
- Rodar lint/format em CI e local (pre-commit) para evitar divergências.
- Revisar e ajustar regras periodicamente com o time — evitar regras obsoletas.
- Usar caches em CI para acelerar ruff/eslint.

---

## Tests Obrigatórios (templates)
- CI job que roda `make lint` ou scripts equivalentes; falhar quando houver problemas.
- Pre-commit hooks que executam `eslint --fix` e `ruff format` para correções automáticas.

Exemplo workflow GitHub Actions step:

```yaml
- name: Run linters
  run: |
    make lint
```

---

## Links
- ESLint: https://eslint.org/
- Prettier: https://prettier.io/
- Ruff: https://github.com/charliermarsh/ruff
- Black: https://black.readthedocs.io/
- Husky: https://typicode.github.io/husky/
- lint-staged: https://github.com/okonet/lint-staged

---

Notas finais:
- Configurações foram adaptadas para a Stack SH. Preferir ferramentas rápidas (ruff) no backend e manter Prettier + ESLint alinhados no frontend. Implementar hooks e CI para garantir consistência.
