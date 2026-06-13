# Imagen oficial de Node.js
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de definición de paquetes primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Exponer el puerto utilizado por Express
EXPOSE 3000
EXPOSE 5555
# Iniciar el servidor en modo desarrollo
CMD ["npm", "run", "dev"]