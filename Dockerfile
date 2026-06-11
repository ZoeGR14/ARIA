FROM node:22-alpine

WORKDIR /app

# Copiar archivos de definición de paquetes primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto 3000 configurado para Vite
EXPOSE 3000

# Ejecutar el servidor de desarrollo de Vite
CMD ["npm", "run", "dev"]
