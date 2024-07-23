# Dockerfile

# Usar uma imagem base oficial do Python
FROM python:3.12.3

# Configurações de ambiente
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Definir o diretório de trabalho no contêiner
WORKDIR /backend

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    python3-dev \
    musl-dev

# Instalar dependências do Python
COPY requirements.txt /backend/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copiar o código do projeto para o diretório de trabalho
COPY . /backend/

# Comando para rodar o servidor Gunicorn e rodar migrations e seed
#RUN python manage.py migrate 