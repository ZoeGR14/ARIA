<p align="center">
  <img width="236" height="231" alt="image" src="https://github.com/user-attachments/assets/79df9f87-0059-438c-bb99-f520e62c6bf2" />
</p>

# 🌿 ARIA (Ambiental Reporting & Interactive App)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

ARIA es una plataforma web innovadora diseñada para el reporte y monitoreo de incidencias ambientales en tiempo real, integrando Sistemas de Información Geográfica (SIG) y dinámicas de gamificación para transformar a la sociedad civil en una red de sensores humanos georreferenciados.

---

## 🛑 El Problema

Diariamente es común observar problemas ambientales en las colonias urbanas, tales como basura acumulada, fugas de agua, tala de árboles o áreas verdes abandonadas. Aunque estos problemas afectan constantemente a la comunidad, muchas veces no son atendidos de manera oportuna debido a la falta de una herramienta accesible y práctica para reportarlos ante las autoridades.

En la mayoría de los casos, la apatía ciudadana triunfa debido a:
* La dificultad burocrática del proceso.
* La falta de seguimiento institucional.
* La imposibilidad de adjuntar evidencia visual y proporcionar la ubicación exacta del incidente.

La ausencia de herramientas tecnológicas y de incentivos provoca que numerosos reportes queden inconclusos, ocasionando el deterioro del entorno, aumento de la contaminación visual y ambiental, y una afectación directa en la calidad de vida de los habitantes, especialmente en zonas densamente pobladas como la Ciudad de México.

---

## 💡 Propuesta de Solución

Para resolver esta problemática, ARIA proporciona una plataforma web interactiva que simplifica el proceso de denuncia y motiva la participación activa de la comunidad. 

A través de la plataforma, los usuarios pueden:
* **Hacer reportes rápidos:** Subir evidencia fotográfica, agregar una breve descripción y registrar la ubicación exacta mediante geolocalización automática.
* **Clasificar la urgencia:** Etiquetar la categoría del problema ambiental y su nivel de severidad.
* **Explorar un mapa público:** Visualizar de forma interactiva todos los reportes de la zona para identificar los "puntos rojos" de la ciudad.
* **Ganar puntos (Gamificación):** Combatir la apatía mediante un sistema de recompensas, insignias y un ranking público (Leaderboard) que reconoce a los ciudadanos más activos.
* **Ayudar a tomar decisiones:** Proveer a las autoridades y líderes vecinales de un panel (Dashboard) con gráficas, tendencias y alertas en tiempo real para actuar de forma más inteligente.

---

## 🏗️ Arquitectura y Tecnologías

El sistema utiliza una arquitectura escalable orientada a servicios para garantizar el procesamiento eficiente de datos espaciales y la accesibilidad multiplataforma.

### Frontend (Capa de Presentación)
* **Framework:** React.js (Single Page Application).
* **Mapas:** React Leaflet / Google Maps API.
* **Gráficas:** Recharts / Chart.js.

### Backend (Lógica de Negocio)
* **Framework:** Node.js / Spring Boot.
* **Seguridad:** JSON Web Tokens (JWT) y encriptación de contraseñas.
* **Servicios Externos:** Firebase Cloud Messaging (FCM) para notificaciones Push.

### Base de Datos (Persistencia y Geodatos)
* **Motor:** PostgreSQL.
* **Extensión Espacial:** PostGIS (Manejo de coordenadas, radios y geometría).

## 🚀 Instalación y Despliegue Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/ZoeGR14/ARIA.git
cd ARIA
```

### 2. Levantar web

```bash
npm install
npm run dev
```

## Flujo de trabajo con Pull Requests

### Objetivo

Mantener la rama `main` estable y evitar que código sin revisar o sin probar llegue al repositorio principal.

---

### Reglas generales

#### ❌ No hacer push directo a `main`

Todos los cambios deben pasar por un Pull Request (PR).

---

#### ✅ Trabajar siempre en una rama propia

Crear una rama a partir de `main` para cada tarea:

```bash
git checkout main
git pull origin main

git checkout -b feature/nombre-funcionalidad
```

Ejemplos:

```text
feature/login
feature/mapa-rutas
feature/notificaciones
fix/error-autenticacion
```

---

#### ✅ Hacer commits pequeños y descriptivos

Ejemplos:

```text
feat: agregar pantalla de inicio de sesión
fix: corregir error al cargar rutas
refactor: simplificar lógica de navegación
```

Evitar mensajes como:

```text
cambios
arreglo
update
aaaa
```

---

### Proceso de desarrollo

#### 1. Desarrollar en la rama de trabajo

Realizar los cambios necesarios y hacer commits regularmente.

```bash
git add .
git commit -m "feat: agregar autenticación con correo"
```

---

#### 2. Actualizar la rama con cambios recientes

Antes de abrir un Pull Request:

```bash
git checkout main
git pull origin main

git checkout feature/nombre-funcionalidad
git merge main
```

Resolver conflictos si existen.

---

#### 3. Subir la rama al repositorio

```bash
git push origin feature/nombre-funcionalidad
```

---

#### 4. Crear Pull Request

Abrir un Pull Request hacia:

```text
feature/... → main
```

La descripción debe incluir:

* Qué se cambió.
* Por qué se hizo.
* Cómo probarlo.
* Capturas de pantalla si aplica.

Ejemplo:

```text
## Cambios realizados

- Agregada pantalla de inicio de sesión.
- Validación de correo y contraseña.
- Manejo de errores de autenticación.

## Cómo probar

1. Abrir la aplicación.
2. Ingresar credenciales válidas.
3. Verificar acceso correcto.
```

---

#### 5. Revisión de código

El Pull Request debe ser revisado por al menos otro integrante del equipo.

Durante la revisión se pueden solicitar cambios.

No debe hacerse merge hasta que:

* Existan las aprobaciones necesarias.
* Las pruebas automáticas hayan pasado.
* Todos los comentarios estén resueltos.

---

#### 6. Merge

Una vez aprobado:

* Utilizar **Squash and Merge**.
* Mantener un historial limpio y fácil de leer.

Ejemplo del historial esperado:

```text
Agregar autenticación (#12)
Corregir error de rutas (#13)
Implementar notificaciones (#14)
```

---

*ARIA - Tu voz en el mapa, tu huella en el futuro.*

---

## 🚀 Guía de Configuración y Ejecución con Docker

Sigue estos pasos para levantar el entorno de desarrollo local con React y la base de datos con PostGIS.

### 📋 Requisitos Previos
*   Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/) (que incluye Docker Compose).

### ⚙️ Paso 1: Configurar Variables de Entorno
Crea o edita el archivo [.env](file:///d:/PC/Documents/Universidad/04%20Ingenieria/ARIA/.env) en la raíz del proyecto para definir las credenciales de la base de datos:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=aria_db
POSTGRES_PORT=5432
POSTGRES_HOST=db
```

### 🗄️ Paso 2: Inicializar el Esquema y Datos de Prueba
Los scripts de inicialización están en la carpeta [database](file:///d:/PC/Documents/Universidad/04%20Ingenieria/ARIA/database):
1.  **[01-schema.sql](file:///d:/PC/Documents/Universidad/04%20Ingenieria/ARIA/database/01-schema.sql):** Contiene la creación de extensiones (`postgis`), tablas, enums e índices.
2.  **[02-data.sql](file:///d:/PC/Documents/Universidad/04%20Ingenieria/ARIA/database/02-data.sql):** Inserta datos iniciales de prueba (usuarios, categorías, estados y reportes con geolocalización).

### 🛠️ Paso 3: Levantar la Aplicación
Abre una terminal en la raíz del proyecto y ejecuta:
```powershell
docker compose up --build
```
Esto creará las imágenes, instalará las dependencias de Node y levantará los servicios:
*   **Frontend (React/Vite):** Disponible en [http://localhost:3000](http://localhost:3000) (con **Hot Reload** activo, los cambios que guardes localmente se verán al instante).
*   **Base de datos (PostgreSQL/PostGIS):** Expuesta en `localhost:5432`.

### 🔄 Reiniciar / Limpiar la Base de Datos
Si realizas modificaciones en los archivos de la carpeta `database` y deseas aplicarlas limpiando la base de datos por completo, ejecuta:
```powershell
docker compose down -v
docker compose up --build
```
*(La bandera `-v` elimina los volúmenes antiguos de datos para forzar la ejecución limpia de tus scripts `.sql`)*.

