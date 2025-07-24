# Use a imagem oficial do Python 3.12 como base
FROM python:3.12-slim

# Defina o diretório de trabalho
WORKDIR /edududs/app

# Copie os arquivos do Django para o contêiner
COPY ./requirements.txt /edududs/app/requirements.txt

# Instale as dependências do Django
RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

# Copie os arquivos do Django para o contêiner
COPY . /edududs/app/

# Exponha a porta 8000 para o tráfego HTTP
EXPOSE 8000

# Comando para iniciar o servidor Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
