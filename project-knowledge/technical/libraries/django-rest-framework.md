# Django REST Framework

## Versão: 3.14.0+

## Por que usamos:
- API REST padrão e robusta
- Serializers automáticos
- Integração nativa com Django
- Ecossistema maduro

## Padrões do Projeto

### 1. Estrutura de App
```
app/
├── models.py      # Models com Meta classes
├── serializers.py # Serializers específicos
├── views.py       # ViewSets padrão
├── urls.py        # Routers nested
└── tests.py       # Tests completos
```

### 2. ViewSets (SEMPRE usar este padrão):
```python
from rest_framework import viewsets, status
from rest_framework.response import Response

class MemberViewSet(viewsets.ModelViewSet):
    """ViewSet padrão para membros"""
    serializer_class = MemberSerializer
    queryset = Member.objects.all()
    
    def get_permissions(self):
        """Permissões por action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Queryset otimizado com prefetch"""
        return self.queryset.prefetch_related('stacks').select_related('user')
```

### 3. Serializers (SEMPRE incluir estes campos):
```python
from rest_framework import serializers
from .models import Member

class MemberSerializer(serializers.ModelSerializer):
    """Serializer padrão com campos extras"""
    
    # Read-only fields - NUNCA deixar editável se não deve
    user_email = serializers.EmailField(source='user.email', read_only=True)
    created_date = serializers.DateTimeField(read_only=True)
    
    # Nested relationships
    stacks = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        read_only=True
    )
    
    class Meta:
        model = Member
        fields = [
            'id',
            'user',
            'user_email',
            'stacks',
            'weekly_hours',
            'available_hours',
            'rating',
            'priority_score',
            'created_date',
        ]
        read_only_fields = ['id', 'created_date', 'user_email']
```

### 4. Models com otimização:
```python
class Member(models.Model):
    """Model padrão com otimizações"""
    
    class Meta:
        db_table = 'members'
        verbose_name = 'Member'
        verbose_name_plural = 'Members'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['priority_score']),
        ]
    
    def __str__(self):
        return f"{self.user.email} - {self.get_stacks_display()}"
```

### 5. URLs com Routers:
```python
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet

router = DefaultRouter()
router.register(r'members', MemberViewSet, basename='member')

urlpatterns = router.urls
```

## Permissões Padrão

### Actions de ViewSet:
| Action | Permissão Padrão | Quando mudar? |
|--------|------------------|---------------|
| list | IsAuthenticated | Se público, AllowAny |
| create | IsAdminUser | Se self-register, IsAuthenticated |
| retrieve | IsAuthenticated | Admin full, member own |
| update | IsAdminUser | Ou IsOwner |
| partial_update | IsAdminUser | Ou IsOwner |
| destroy | IsAdminUser | Nunca permitir member |

## Tests (OBRIGATÓRIO):

```python
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

class MemberViewSetTest(TestCase):
    """Teste padrão para ViewSets"""
    
    def setUp(self):
        self.client = APIClient()
        self.admin = get_user_model().objects.create_superuser(
            email='admin@test.com',
            password='testpass123'
        )
        self.member_user = get_user_model().objects.create_user(
            email='member@test.com',
            password='testpass123'
        )
    
    def test_list_members_admin(self):
        """Admin pode listar todos"""
        self.client.force_authenticate(self.admin)
        response = self.client.get('/api/members/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
    
    def test_list_members_member(self):
        """Member pode listar todos (transparência)"""
        self.client.force_authenticate(self.member_user)
        response = self.client.get('/api/members/')
        self.assertEqual(response.status_code, 200)
```

## Não Fazer ❌:

- Não criar views manuais se ViewSet funciona
- Não esquecer prefetch/select_related
- Não permitir create/update sem permissão adequada
- Não gerar serializers anônimos
- Não esquecer testes

## Fazer Sempre ✅:

- Usar ViewSets para CRUD
- Incluir Meta class nos models
- Adicionar indexes para performance
- Testar todas as permissões
- Documentar endpoints com docstrings

## Config Settings:

```python
# settings/padron.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': [
        'rest_framework.pagination.PageNumberPagination',
    ],
    'PAGE_SIZE': 20,
}
```

## Performance:

```python
# Para listas grandes
queryset = Member.objects.all().select_related('user').prefetch_related('stacks')

# Para filtros
queryset = queryset.filter(active=True).order_by('-priority_score')

# Para paginação personalizada
class LargeResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000
```

---

**Link Oficial**: https://www.django-rest-framework.org/
**Docs Locais**: docs/2-specification/Spec.md
**Testar com**: `python manage.py test app.apis.v1.tests`