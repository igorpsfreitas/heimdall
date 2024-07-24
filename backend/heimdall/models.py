from django.db import models

class User(models.Model):
    name = models.CharField(max_length=255)
    pwd = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Project(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'in_progress'), # em andamento
        ('finished', 'finished'), # finalizado
    ]

    name = models.CharField(max_length=255)
    started = models.DateField()
    finished = models.DateField(null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Em andamento')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_projects')

    def __str__(self):
        return self.name

class Holder(models.Model):
    name = models.CharField(max_length=255)
    cpf = models.CharField(max_length=11, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_holders')
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_holders')

    def __str__(self):
        return self.name

class Patrimony(models.Model):
    STATUS_CHOICES = [
        ('avalilable', 'avaliavle'), # disponível
        ('unavailable', 'unavailable'), # indisponível
        ('dead', 'dead'), # inoperante
    ]

    name = models.CharField(max_length=255)
    listing_code = models.CharField(max_length=100, unique=True)
    serial_number = models.CharField(max_length=100, unique=True, null=True)
    description = models.TextField(null=True)
    observation = models.TextField(null=True)
    holder_id = models.ForeignKey(Holder, on_delete=models.CASCADE, null=True)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Disponível')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_patrimonies')
    create_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_patrimonies')

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