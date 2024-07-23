from django.shortcuts import render
from rest_framework import viewsets
#from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import User, Patrimony, Holder, Project, Loan
from .serializers import UserSerializer, PatrimonySerializer, HolderSerializer, ProjectSerializer, LoanSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    #permission_classes = [IsAuthenticatedOrReadOnly]

class HolderViewSet(viewsets.ModelViewSet):
    queryset = Holder.objects.all()
    serializer_class = HolderSerializer
    #permission_classes = [IsAuthenticatedOrReadOnly]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    #permission_classes = [IsAuthenticatedOrReadOnly]

class PatrimonyViewSet(viewsets.ModelViewSet):
    queryset = Patrimony.objects.all()
    serializer_class = PatrimonySerializer
    #permission_classes = [IsAuthenticatedOrReadOnly]

class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    #permission_classes = [IsAuthenticatedOrReadOnly]

