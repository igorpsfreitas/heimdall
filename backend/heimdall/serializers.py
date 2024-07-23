from rest_framework import serializers
from .models import User, Patrimony, Holder, Project, Loan

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class PatrimonySerializer(serializers.ModelSerializer):
    class Meta:
        model = Patrimony
        fields = '__all__'

class HolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Holder
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = '__all__'