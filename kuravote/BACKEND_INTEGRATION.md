# Django Backend Integration Guide

## Backend Repository
**Django Backend:** https://github.com/morgan-owanyi/E-voting-backend

## Setup Instructions

### 1. Configure Backend URL

Create a `.env` file in the `kuravote` folder:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

Django runs on port 8000 by default.

### 2. Start Your Django Backend

In your backend repository:

```bash
# Activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### 3. Django Backend Structure

Your backend has these apps:
- **accounts** - User authentication, roles (admin, presiding, candidate, voter), OTP
- **election** - Election positions, voting, candidates
- **backend** - Main Django project settings

#### User Model (accounts/models.py)
```python
class User(AbstractUser):
    role = CharField(choices=['admin', 'presiding', 'candidate', 'voter'])
    is_verified = BooleanField(default=False)

class OTP:
    user = ForeignKey(User)
    code = CharField(max_length=6)
    created_at = DateTimeField()
```

### 4. Required Django Views/URLs

You need to create these API endpoints in your Django backend:

#### accounts/urls.py
```python
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('request-otp/', views.request_otp, name='request-otp'),
    path('verify-otp/', views.verify_otp, name='verify-otp'),
]
```

#### election/urls.py
```python
from django.urls import path
from . import views

urlpatterns = [
    path('positions/', views.positions_list, name='positions-list'),
    path('positions/create/', views.position_create, name='position-create'),
    path('candidates/', views.candidates_list, name='candidates-list'),
    path('candidates/apply/', views.candidate_apply, name='candidate-apply'),
    path('candidates/<int:pk>/approve/', views.candidate_approve, name='candidate-approve'),
    path('candidates/<int:pk>/reject/', views.candidate_reject, name='candidate-reject'),
    path('vote/', views.cast_vote, name='cast-vote'),
    path('results/', views.get_results, name='get-results'),
]
```

#### backend/urls.py
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/election/', include('election.urls')),
]
```

### 5. CORS Configuration

Install django-cors-headers:
```bash
pip install django-cors-headers
```

Update `backend/settings.py`:
```python
INSTALLED_APPS = [
    # ... existing apps
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add at the top
    # ... other middleware
]

# Allow your React frontend
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3003',
    'http://localhost:3000',
]

CORS_ALLOW_CREDENTIALS = True

# For development only (remove in production)
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3003',
    'http://localhost:3000',
]
```

### 6. Django REST Framework Setup

Install DRF (already in your requirements):
```bash
pip install djangorestframework
```

Update `backend/settings.py`:
```python
INSTALLED_APPS = [
    # ... existing apps
    'rest_framework',
    'rest_framework.authtoken',  # For token authentication
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}
```

### 7. Example Django Views

Create serializers in `election/serializers.py`:
```python
from rest_framework import serializers
from .models import Position, Candidate

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = '__all__'

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = '__all__'
```

Update `election/views.py`:
```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Position
from .serializers import PositionSerializer

@api_view(['GET'])
def positions_list(request):
    positions = Position.objects.all()
    serializer = PositionSerializer(positions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def position_create(request):
    serializer = PositionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

### 2. Backend API Endpoints Expected

Your backend should have these endpoints:

#### Positions
- `GET /api/positions` - Get all positions
- `POST /api/positions` - Create position
- `PUT /api/positions/:id` - Update position
- `DELETE /api/positions/:id` - Delete position

#### Voters
- `GET /api/voters` - Get all voters
- `POST /api/voters` - Add single voter
- `POST /api/voters/bulk` - Import multiple voters

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates/apply` - Apply for position
- `PUT /api/candidates/:id/approve` - Approve candidate
- `PUT /api/candidates/:id/reject` - Reject candidate

#### Voting
- `POST /api/voting/request-otp` - Request OTP
- `POST /api/voting/verify-otp` - Verify OTP
- `POST /api/voting/cast` - Cast vote
- `GET /api/voting/results` - Get results

### 3. CORS Configuration

Your backend needs to allow requests from your frontend:

```javascript
// Example for Express.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3003', // Your frontend URL
  credentials: true
}));
```

### 4. Using the API in Components

```typescript
import { positionAPI } from '../utils/api';

// Fetch positions
const fetchPositions = async () => {
  try {
    const data = await positionAPI.getAll();
    setPositions(data);
  } catch (error) {
    console.error('Failed to fetch positions:', error);
  }
};

// Create position
const createPosition = async (positionData) => {
  try {
    const newPosition = await positionAPI.create(positionData);
    setPositions([...positions, newPosition]);
  } catch (error) {
    console.error('Failed to create position:', error);
  }
};
```

### 5. Testing Without Backend

The app will continue to work with demo data if the backend is not available. The API calls will fail gracefully and you can develop the frontend independently.
