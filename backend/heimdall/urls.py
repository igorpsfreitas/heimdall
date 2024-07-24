from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, HolderViewSet, ProjectViewSet, PatrimonyViewSet, LoanViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'holders', HolderViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'patrimonies', PatrimonyViewSet)
router.register(r'loans', LoanViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]