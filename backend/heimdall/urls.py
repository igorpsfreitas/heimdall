from django.urls import path
from rest_framework.routers import DefaultRouter
from .viewsets import UserViewSet, HolderViewSet, ProjectViewSet, PatrimonyViewSet, LoanViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import CustomTokenObtainPairView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'holders', HolderViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'patrimonies', PatrimonyViewSet)
router.register(r'loans', LoanViewSet)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/custom/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
] + router.urls