# backend/heimdall/models.py

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password, check_password

class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def save(self, *args, **kwargs):
        if not self.pk:  # Check if the user instance is new
            self.password = make_password(self.password)
        super(User, self).save(*args, **kwargs)

    def __str__(self):
        return self.username

class Project(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'in_progress'), # em andamento
        ('finished', 'finished'), # finalizado
    ]

    name = models.CharField(max_length=255)
    started = models.DateField()
    finished = models.DateField(null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_projects')

    def __str__(self):
        return self.name

class Holder(models.Model):
    name = models.CharField(max_length=255)
    cpf = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_holders')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_holders')

    def __str__(self):
        return self.name

class Patrimony(models.Model):
    STATUS_CHOICES = [
        ('available', 'available'), # disponível
        ('unavailable', 'unavailable'), # indisponível
        ('dead', 'dead'), # inoperante
    ]

    name = models.CharField(max_length=255)
    listing_code = models.CharField(max_length=100, unique=True)
    serial_number = models.CharField(max_length=100, null=True)
    description = models.TextField(null=True)
    observation = models.TextField(null=True)
    holder_id = models.ForeignKey(Holder, on_delete=models.CASCADE, null=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_patrimonies')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_patrimonies')

    def __str__(self):
        return self.name

class Loan(models.Model):
    STATUS_CHOICES = [
        ('loaned', 'loaned'), # emprestado
        ('returned', 'returned'), # devolvido
        ('wasted', 'wasted'), # extraviado
    ]

    holder_id = models.ForeignKey(Holder, on_delete=models.CASCADE, null=True)
    patrimony_id = models.ForeignKey(Patrimony, on_delete=models.CASCADE, null=True)
    loan_date = models.DateField()
    return_date = models.DateField(null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)

    def __str__(self):
        return f'{self.holder_id} - {self.patrimony_id}'
