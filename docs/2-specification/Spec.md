# Especificação Técnica - Plataforma de Gestão da Software House

**Data**: 14/04/2026
**Base**: PRD.md v1.0
**Status**: Pronto para Implementação

## Arquitetura Geral

### Bibliotecas Documentadas
**IMPORTANTE**: Usar exatamente os padrões definidos em:
- [Django REST Framework](../project-knowledge/technical/libraries/django-rest-framework.md)
- [JWT Authentication](../project-knowledge/technical/libraries/jwt-authentication.md)
- [Material UI React](../project-knowledge/technical/libraries/react-material-ui.md)

### Backend (API)
- **Framework**: Django REST Framework
- **Database**: PostgreSQL
- **Auth**: JWT Tokens com refresh
- **File Storage**: AWS S3/MinIO
- **Queue**: Celery + Redis

### Frontend
- **Dashboard**: React + TypeScript
- **Landing Page**: Next.js
- **State Management**: Redux Toolkit
- **UI Components**: Material UI (follow docs)
- **Charts**: Chart.js ou Recharts

## Estrutura de Arquivos

```
agencia-gestao/
├── backend/
│   ├── app/
│   │   ├── accounts/          # Gestão de usuários
│   │   ├── members/           # Gestão de membros
│   │   ├── projects/          # Gestão de projetos
│   │   ├── hours/             # Controle de horas
│   │   ├── contracts/         # Contratos
│   │   ├── priority/          # Fila de prioridade
│   │   ├── reports/           # Relatórios
│   │   └── core/              # Config e utils
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusáveis
│   │   ├── pages/             # Páginas principais
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # API calls
│   │   ├── store/             # Redux store
│   │   └── utils/             # Helpers
│   └── package.json
└── landing/                   # Next.js
    ├── pages/
    ├── components/
    └── package.json
```

## Models Principais (Backend)

### User Model
```python
class User(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=USER_ROLES)
    github_url = models.URLField(blank=True)
    discord_id = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### Member Profile
```python
class Member(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    stacks = models.ManyToManyField(Stack)
    weekly_hours = models.PositiveIntegerField(default=40)
    rating = models.FloatField(default=3.0)
    priority_score = models.FloatField(default=0.0)
    last_project_date = models.DateTimeField(null=True, blank=True)
    available_hours = models.PositiveIntegerField(default=40)
```

### Project
```python
class Project(models.Model):
    STATUS_CHOICES = [
        ('lead', 'Lead'),
        ('briefing', 'Briefing'),
        ('contract', 'Contract'),
        ('development', 'Development'),
        ('delivered', 'Delivered'),
        ('support', 'Support'),
    ]
    
    name = models.CharField(max_length=200)
    client_name = models.CharField(max_length=200)
    description = models.TextField()
    required_stacks = models.ManyToManyField(Stack)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    estimated_hours = models.PositiveIntegerField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    house_fee = models.DecimalField(max_digits=10, decimal_places=2)
    assigned_members = models.ManyToManyField(Member, blank=True)
    github_repo = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateField()
```

### Hour Registry
```python
class HourRegistry(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    hours = models.PositiveIntegerField()
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### Contract
```python
class Contract(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE)
    pdf_file = models.FileField(upload_to='contracts/')
    client_signature = models.BooleanField(default=False)
    house_signature = models.BooleanField(default=False)
    signed_date = models.DateTimeField(null=True, blank=True)
    payment_terms = models.JSONField(default=dict)
```

## Frontend Components

**IMPORTANTE**: Usar padrões de [Material UI docs](../project-knowledge/technical/libraries/react-material-ui.md)

### Componentes Base a Usar:
- `BaseButton` - Botões padronizados
- `BaseInput` - Campos de formulário
- `LoadingSpinner` - Estados de loading
- `Layout` - Layout padrão das páginas

### Dashboard Principal
```typescript
interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  // Implementar usando componentes base:
  // <Layout title="Dashboard">
  //   <DataTable /> para listas
  //   <LoadingSpinner /> para loading
  // </Layout>
};
```

### Priority Queue
```typescript
interface MemberPriority {
  member: Member;
  score: number;
  lastProject: Date;
  matchingStacks: string[];
  availableHours: number;
}

const PriorityQueue: React.FC = () => {
  // Lista de membros com score de prioridade
  // Admin pode reordenar manualmente
};
```

### Time Tracker
```typescript
interface TimeEntry {
  project: Project;
  hours: number;
  date: Date;
  description: string;
}

const TimeTracker: React.FC = () => {
  // Formulário para registrar horas
  // Validar se tem horas disponíveis
};
```

## API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Members (Admin only)
- `GET /api/members` - Listar todos
- `POST /api/members` - Criar novo
- `PUT /api/members/{id}` - Atualizar
- `DELETE /api/members/{id}` - Remover

### Projects
- `GET /api/projects` - Listar (filtrar por role)
- `POST /api/projects` - Criar (admin)
- `GET /api/projects/{id}` - Detalhes
- `PUT /api/projects/{id}` - Atualizar
- `POST /api/projects/{id}/assign` - Alocar membros

### Hours
- `GET /api/hours/my-hours` - Minhas horas
- `POST /api/hours` - Registrar horas
- `GET /api/hours/project/{id}` - Horas por projeto

### Priority Queue
- `GET /api/priority/queue` - Fila atual (admin)
- `POST /api/priority/recalculate` - Recalcular scores
- `PUT /api/priority/reorder` - Reordenar manualmente

### Reports
- `GET /api/reports/performance` - Relatório de desempenho
- `GET /api/reports/financial` - Relatório financeiro
- `GET /api/reports/hours` - Relatório de horas

## Permissões e Níveis de Acesso

### Cofundadores/Admins
- CRUD completo em todos os recursos
- Visualizar todos os projetos e membros
- Gerenciar fila de prioridade
- Acessar relatórios completos
- Gerenciar contratos

### Membros
- Visualizar apenas seus projetos
- Registrar horas em projetos atribuídos
- Ver sua posição na fila
- Visualizar informações públicas da agência

## Regras de Negócio

### Cálculo de Prioridade
```python
def calculate_priority_score(member):
    dias_sem_projeto = (hoje - member.last_project_date).days
    score_base = dias_sem_projeto * 10
    
    # Se tem stack necessária, bonus
    if tem_stack_necessaria:
        score_base += 50
        
    # Se sobrecarregado, penalidade
    if member.available_hours < 10:
        score_base -= 30
        
    return score_base
```

### Validação de Horas
```python
def can_register_hours(member, hours, date):
    # Verificar se tem horas disponíveis
    if member.available_hours < hours:
        return False
        
    # Verificar se não ultrapassa semanal
    horas_semana = get_hours_this_week(member, date)
    if horas_semana + hours > member.weekly_hours:
        return False
        
    return True
```

### Divisão Financeira
```python
def calculate_finances(project):
    total = project.budget
    house_fee = total * 0.10
    remaining = total - house_fee
    
    # Dividir между membros
    for member in project.assigned_members:
        member_share = remaining / project.assigned_members.count()
        # Transferência direta implementada fora do sistema
        
    return {
        'total': total,
        'house_fee': house_fee,
        'member_share': member_share
    }
```

## Testes

**Usar padrões documentados em:**
- [Jest + Testing Library](../project-knowledge/technical/libraries/jest.md) *(quando disponível)*
- [Django REST Framework](../project-knowledge/technical/libraries/django-rest-framework.md)

### Backend
- Unit tests para todos os models
- API tests para todos os endpoints
- Testes de regra de negócio
- Testes de permissão

### Frontend
- Component tests (Jest + React Testing Library)
- Integration tests para fluxos principais
- E2E tests para workflows críticos

## Deploy

**Usar padrões documentados em:**
- [Docker](../project-knowledge/technical/libraries/docker.md) *(quando disponível)*
- [Vercel](../project-knowledge/technical/libraries/vercel.md) *(quando disponível)*
- [GitHub Actions](../project-knowledge/technical/libraries/github-actions.md) *(quando disponível)*

### Backend
- Docker container
- CI/CD pipeline
- Environment variables:
  - DATABASE_URL
  - SECRET_KEY
  - AWS credentials
  - Redis URL

### Frontend
- Vercel para Next.js
- Netlify ou similar para React
- Environment variables:
  - REACT_APP_API_URL
  - REACT_APP_ENV

## Segurança

- Configurar exatamente conforme [JWT Authentication docs](../project-knowledge/technical/libraries/jwt-authentication.md#security-headers)
- Rate limit (docs GitHub Actions quando disponível)
- CORS configurado
- SQL injection prevention
- XSS protection
- HTTPS obrigatório
- Senhas com hash

## Performance

**Otimizações por biblioteca:**
- PostgreSQL: [Ver indexes e queries](../project-knowledge/technical/libraries/postgresql.md#performance)
- React: [Ver lazy loading e memo](../project-knowledge/technical/libraries/react-material-ui.md#performance-tips)
- Django: [Ver select_related/prefetch_related](../project-knowledge/technical/libraries/django-rest-framework.md#performance)

- Database indexes
- Cache para relatórios
- Pagination em listas
- Lazy loading de componentes
- Otimização de imagens

## MVP Features (Fase 1)

**Usar bibliotecas documentadas em:**
- [JWT Authentication](../project-knowledge/technical/libraries/jwt-authentication.md)
- [Django REST Framework](../project-knowledge/technical/libraries/django-rest-framework.md)
- [Material UI React](../project-knowledge/technical/libraries/react-material-ui.md)

1. **Autenticação** - Login/logout com JWT (seguir pattern do doc)
2. **Gestão de Membros** - CRUD com ViewSets DRF
3. **Gestão de Projetos** - CRUD com ViewSets DRF
4. **Controle de Horas** - Forms com Material UI
5. **Fila de Prioridade** - Cálculo automático
6. **Dashboard Básico** - Components Material UI

## Features Futuras (Fase 2+)

1. **Relatórios Avançados** - Analytics completo
2. **Portal do Cliente** - Interface externa
3. **Integração com Slack** - Notificações
4. **Sistema de Feedback 360°** - Avaliações
5. **Gamificação** - Conquistas e rankings
6. **Gestão de Documentos** - Upload e organização