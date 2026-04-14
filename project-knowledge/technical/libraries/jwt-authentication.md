# JWT Authentication - Django

## Versão: djangorestframework-simplejwt ^5.2.0

## Por que usamos:
- Refresh tokens automáticos
- Config customizável flexível
- Performance melhor que DRF nativo
- Segurança com rotação de tokens

## Setup Básico (PADRÃO DO PROJETO):

### 1. Instalação:
```bash
pip install djangorestframework-simplejwt
```

### 2. Settings.py (SEMPRE usar esta config):
```python
from datetime import timedelta

# Adicionar ao INSTALLED_APPS
INSTALLED_APPS += [
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',  # Para logout
]

# JWT Config
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,    # Muda refresh a cada uso
    'BLACKLIST_AFTER_ROTATION': True, # Invalida refresh antigo
    
    'ALGORITHM': 'HS256',
    
    # Tokens customizados
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    # Sem cookies por enquanto
    'AUTH_COOKIE': None,
}
```

### 3. Views (SEGUIR EXATAMENTE ESTE PADRÃO):
```python
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

class LoginView(TokenObtainPairView):
    """Login padrão - herda de TokenObtainPairView"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            
            # Adicionar dados do usuário à resposta
            if response.status_code == 200:
                user = request.user
                response.data.update({
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'role': user.role if hasattr(user, 'role') else 'member',
                    }
                })
            
            return response
            
        except Exception as e:
            return Response({
                'error': 'Credenciais inválidas',
                'detail': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    """Logout - blacklist do refresh token"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            
            if not refresh_token:
                return Response({
                    'error': 'Refresh token required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Adicionar à blacklist
            from rest_framework_simplejwt.token_blacklist.models import RefreshToken
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_205_RESET_CONTENT)
            
        except Exception as e:
            return Response({
                'error': 'Invalid token',
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class RefreshTokenView(APIView):
    """Renovar access token com refresh"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            refresh = request.data.get("refresh")
            
            if not refresh:
                return Response({
                    'error': 'Refresh token required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            from rest_framework_simplejwt.tokens import RefreshToken
            token = RefreshToken(refresh)
            
            return Response({
                'access': str(token.access_token),
                'refresh': str(token)  # Novo refresh se ROTATE_REFRESH_TOKENS=True
            })
            
        except Exception as e:
            return Response({
                'error': 'Invalid token',
                'detail': str(e)
            }, status=status.HTTP_401_UNAUTHORIZED)
```

### 4. URLs (SEMPRE usar este padrão):
```python
from django.urls import path
from .auth_views import LoginView, LogoutView, RefreshTokenView

app_name = 'auth'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', RefreshTokenView.as_view(), name='refresh'),
]
```

### 5. Custom User (se necessário):
```python
class User(AbstractUser):
    """User com role para JWT"""
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def get_tokens(self):
        """Helper para gerar tokens manualmente se necessário"""
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
```

## Frontend - Padrão de Consumo:

### HTTP Client Setup:
```typescript
// services/auth.ts
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const authAPI = {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_BASE}/auth/login/`, {
      email,
      password
    });
    
    // Tokens para localStorage
    localStorage.setItem('access', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },
  
  async logout() {
    const refresh = localStorage.getItem('refresh');
    await axios.post(`${API_BASE}/auth/logout/`, { refresh });
    
    // Limpar storage
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  },
  
  async refreshToken() {
    const refresh = localStorage.getItem('refresh');
    const response = await axios.post(`${API_BASE}/auth/refresh/`, { refresh });
    
    localStorage.setItem('access', response.data.access);
    if (response.data.refresh) {
      localStorage.setItem('refresh', response.data.refresh);
    }
    
    return response.data;
  }
};
```

### Axios Interceptor (AUTOMÁTICO):
```typescript
// services/axiosInterceptors.ts
import axios from 'axios';
import { authAPI } from './auth';

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    
    // Se 401 e não é retry
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      
      try {
        await authAPI.refreshToken();
        return axios(original);
      } catch (refreshError) {
        // Refresh falhou → logout
        authAPI.logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Tests Obrigatórios:

```python
class JWTAuthTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@test.com',
            password='test123'
        )
    
    def test_login_success(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'test@test.com',
            'password': 'test123'
        })
        
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_login_invalid(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'test@test.com',
            'password': 'wrong'
        })
        
        self.assertEqual(response.status_code, 401)
    
    def test_logout_success(self):
        # Primeiro faz login
        login_response = self.client.post('/api/auth/login/', {
            'email': 'test@test.com',
            'password': 'test123'
        })
        
        refresh = login_response.data['refresh']
        
        # Depois logout
        response = self.client.post('/api/auth/logout/', {
            'refresh': refresh
        })
        
        self.assertEqual(response.status_code, 205)
```

## Não Fazer ❌:

- ❌ Não armazenar refresh em localStorage sem proteção XSS
- ❌ Não usar access tokens com lifetime > 24h
- ❌ Não esquecer de implementar logout com blacklist
- ❌ Não ignorar refresh token rotation
- ❌ Não enviar dados sensíveis no token payload

## Fazer Sempre ✅:

- ✅ Implementar logout real (blacklist)
- ✅ Usar refresh token rotation
- ✅ Implementar auto-refresh no frontend
- ✅ Tratar 401/403 correctamente
- ✅ Testar todos os fluxos

## Security Headers:

```python
# Middleware de segurança
MIDDLEWARE += [
    'django.middleware.security.SecurityMiddleware',
]

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_SECONDS = 31536000  # 1 ano
```

---

**Link Oficial**: https://django-rest-framework-simplejwt.readthedocs.io/
**Setup Command**: `pip install djangorestframework-simplejwt`
**Migrations**: Necessárias para blacklist: `python manage.py migrate`