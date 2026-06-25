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

## 📌 Índice de Etapas de Configuración y Desarrollo

1. [Etapa 1: Comprensión del Sistema (Problema, Solución y Arquitectura)](#etapa-1-comprensión-del-sistema)
2. [Etapa 2: Configuración del Entorno de Desarrollo (Puesta en Marcha)](#etapa-2-configuración-del-entorno-de-desarrollo)
3. [Etapa 3: Flujo de Trabajo y Colaboración (Git & PRs)](#etapa-3-flujo-de-trabajo-y-colaboración)
4. [Etapa 4: Documentación de la API y Pruebas (Endpoints & Postman)](#etapa-4-documentación-de-la-api-y-pruebas)

---

## Etapa 1: Comprensión del Sistema

### 🛑 El Problema
Diariamente es común observar problemas ambientales en las colonias urbanas, tales como basura acumulada, fugas de agua, tala de árboles o áreas verdes abandonadas. Aunque estos problemas afectan constantemente a la comunidad, muchas veces no son atendidos de manera oportuna debido a la falta de una herramienta accesible y práctica para reportarlos ante las autoridades.

En la mayoría de los casos, la apatía ciudadana triunfa debido a:
* La dificultad burocrática del proceso.
* La falta de seguimiento institucional.
* La imposibilidad de adjuntar evidencia visual y proporcionar la ubicación exacta del incidente.

La ausencia de herramientas tecnológicas y de incentivos provoca que numerosos reportes queden inconclusos, ocasionando el deterioro del entorno, aumento de la contaminación visual y ambiental, y una afectación directa en la calidad de vida de los habitantes, especialmente en zonas densamente pobladas como la Ciudad de México.

### 💡 Propuesta de Solución
Para resolver esta problemática, ARIA proporciona una plataforma web interactiva que simplifica el proceso de denuncia y motiva la participación activa de la comunidad. 

A través de la plataforma, los usuarios pueden:
* **Hacer reportes rápidos:** Subir evidencia fotográfica, agregar una breve descripción y registrar la ubicación exacta mediante geolocalización automática.
* **Clasificar la urgencia:** Etiquetar la categoría del problema ambiental y su nivel de severidad.
* **Explorar un mapa público:** Visualizar de forma interactiva todos los reportes de la zona para identificar los "puntos rojos" de la ciudad.
* **Ganar puntos (Gamificación):** Combatir la apatía mediante un sistema de recompensas, insignias y un ranking público (Leaderboard) que reconoce a los ciudadanos más activos.
* **Ayudar a tomar decisiones:** Proveer a las autoridades y líderes vecinales de un panel (Dashboard) con gráficas, tendencias y alertas en tiempo real para actuar de forma más inteligente.

### 🏗️ Arquitectura y Tecnologías
El sistema utiliza una arquitectura escalable orientada a servicios para garantizar el procesamiento de datos espaciales, notificaciones push, integración de IA y una experiencia de usuario responsiva.

<details>
<summary>💻 Detalle del Stack Tecnológico</summary>

* **Frontend (Capa de Presentación):**
  * **Framework:** React 19 (SPA) + Vite 8
  * **Estilos:** Tailwind CSS v4
  * **Mapas:** Leaflet
  * **Animaciones:** Motion
  * **Iconografía:** Lucide React
  * **Enrutamiento:** React Router v7
* **Backend (Lógica de Negocio):**
  * **Entorno & Framework:** Node.js + Express 5 (TypeScript)
  * **Base de Datos & ORM:** Prisma ORM 6
  * **Autenticación & Seguridad:** JWT (`jsonwebtoken`) y encriptación con `bcrypt`
  * **Notificaciones Push:** Firebase Admin SDK (FCM)
  * **Envío de Correos:** Nodemailer + Mailtrap
  * **Subida de Archivos:** Multer (para imágenes de evidencia)
* **Base de Datos (Persistencia y Geodatos):**
  * **Motor:** PostgreSQL
  * **Extensión Espacial:** PostGIS (coordenadas geográficas, radios y consultas espaciales nativas)
</details>

---

## Etapa 2: Configuración del Entorno de Desarrollo

Sigue estos pasos en orden para levantar el entorno de desarrollo local.

### 📋 Requisitos Previos
*   Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/) (con Docker Compose).
*   Node.js v22+ (opcional, solo para desarrollo local fuera de Docker).

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/ZoeGR14/ARIA.git
cd ARIA
```

### Paso 2: Configurar Variables de Entorno (`.env`)
Debes crear los archivos `.env` necesarios para el correcto funcionamiento del frontend y del backend.

1. **Raíz del proyecto (Frontend/Global)**: Crea un archivo `.env` en la raíz del proyecto:
    ```env
    POSTGRES_USER=<user>
    POSTGRES_PASSWORD=<password>
    POSTGRES_DB=<database_name>
    POSTGRES_PORT=<port>
    POSTGRES_HOST=<host>
    VITE_API_URL=<url>
    ```

2. **Backend**: Crea un archivo `.env` dentro de la carpeta `backend`:
    ```env
    PORT=<port>
    JWT_SECRET=<secret>
    DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database_name>
    EMAIL_USER=<user>
    MAILTRAP_TOKEN=<token>
    ``` 

### Paso 3: Inicializar Base de Datos y Levantar Contenedores

Abre una terminal en la raíz del proyecto y ejecuta:
```powershell
docker compose up --build
```
Esto levantará los siguientes servicios:
* **Frontend (React/Vite):** Disponible en [http://localhost:3000](http://localhost:3000) (Hot Reload habilitado).
* **Backend (Node.js/Express):** Disponible en [http://localhost:3001](http://localhost:3001).
* **Base de datos (PostgreSQL/PostGIS):** Expuesta en el puerto `5432`.

> [!NOTE]
> Para ejecutar los contenedores en segundo plano, añade la bandera `-d`: `docker compose up -d --build`.
> Para ver los logs en tiempo real, usa: `docker compose logs -f`.

### Paso 4: Sincronizar Prisma
Una vez levantada la base de datos y con el contenedor de backend en ejecución, sincroniza el esquema de Prisma y genera el cliente ejecutando:
```bash
# Obtener el esquema desde la base de datos
docker compose exec backend npx prisma db pull

# Generar Prisma Client
docker compose exec backend npx prisma generate
```
> [!IMPORTANT]
> Debes ejecutar estos comandos cada vez que realices cambios estructurales en la base de datos (`.sql`).

#### 🗺️ Nota sobre PostGIS y Prisma
<details>
<summary>🗺️ Detalles de Integración de PostGIS con Prisma</summary>

La tabla `REPORTE` utiliza el tipo espacial `GEOGRAPHY(POINT, 4326)`. Como Prisma no lo soporta de forma nativa, en `schema.prisma` aparecerá como:
`ubicacion Unsupported("geography")`

**No modifiques esta línea.** Las operaciones que involucren coordenadas geográficas deben realizarse mediante SQL nativo usando:
* `prisma.$queryRaw(...)`
* `prisma.$executeRaw(...)`

**Ejemplo para crear un punto geográfico:**
```sql
ST_SetSRID(ST_MakePoint(longitud, latitud), 4326)::geography
```

**Ejemplo para recuperar coordenadas:**
```sql
ST_X(ubicacion::geometry)
ST_Y(ubicacion::geometry)
```
</details>

### Paso 5: Gestión de Base de Datos (Limpieza y Reseteo)
Si realizas modificaciones en los archivos SQL y deseas reiniciar la base de datos por completo:
```powershell
docker compose down -v
docker compose up --build
```
*(La bandera `-v` elimina los volúmenes para realizar una carga limpia desde cero).*

---

## Etapa 3: Flujo de Trabajo y Colaboración

Para mantener la estabilidad de la rama `main` y asegurar la calidad del código, se debe seguir estrictamente este flujo de trabajo.

### 🚫 Regla de Oro
**No hacer push directo a `main`.** Todos los cambios deben pasar obligatoriamente por un Pull Request (PR).

### Paso 1: Trabajar en una Rama de Tarea
Crea una rama a partir de `main` siguiendo la nomenclatura correcta:
```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-funcionalidad
```
**Nomenclatura recomendada:**
* `feature/nombre-funcionalidad` (ej. `feature/login`, `feature/mapa`)
* `fix/error-resuelto` (ej. `fix/error-autenticacion`)

### Paso 2: Confirmar Cambios (Commits)
Realiza commits pequeños, limpios y descriptivos:
```bash
git add .
git commit -m "feat: agregar pantalla de inicio de sesión"
```
*Evita mensajes genéricos como "cambios", "fix", "update", "aaaa".*

### Paso 3: Mantener la Rama Actualizada
Antes de abrir un PR, integra los últimos cambios de `main` en tu rama para resolver posibles conflictos localmente:
```bash
git checkout main
git pull origin main
git checkout feature/nombre-funcionalidad
git merge main
```

### Paso 4: Subir Rama y Crear Pull Request
Sube tu rama al repositorio remoto:
```bash
git push origin feature/nombre-funcionalidad
```
Abre el PR en GitHub hacia `main`. Completa la plantilla de descripción detallando qué se cambió y cómo probarlo.

<details>
<summary>📝 Ejemplo de Estructura de Pull Request</summary>

La descripción del Pull Request debe estructurarse de la siguiente manera:

```markdown
## Cambios realizados

- Agregada pantalla de inicio de sesión.
- Validación de correo y contraseña.
- Manejo de errores de autenticación.

## Cómo probar

1. Abrir la aplicación.
2. Ingresar credenciales válidas.
3. Verificar acceso correcto.
```
</details>

### Paso 5: Revisión de Código y Fusión
* Al menos **un integrante del equipo** debe revisar y aprobar el PR.
* Resuelve todos los comentarios y asegúrate de pasar los checks.
* Al fusionar, utiliza la opción **Squash and Merge** para mantener un historial de commits limpio en `main`.

---

## Etapa 4: Documentación de la API y Pruebas

La URL base para consumir los servicios del backend es:
```text
http://localhost:3001/api
```

### 👥 Usuarios de Prueba Registrados
* **Ciudadano 1:** `juan.perez@example.com` / `hashed_pwd_123`
* **Ciudadano 2:** `maria.gomez@example.com` / `hashed_pwd_456`
* **Administrador:** `admin@ariaplataforma.org` / `hashed_admin_pwd`

---

### 📡 Listado de Endpoints

<details>
<summary>🔑 Autenticación y Cuentas</summary>

#### Registro de Usuario
* **POST** `/auth/register`
* **Body (JSON):**
  ```json
  {
    "nombreCompleto": "Juan Pérez",
    "correoElectronico": "juan@gmail.com",
    "password": "Password123!"
  }
  ```
* **Respuesta (200 OK):**
  ```json
  { "mensaje": "Usuario registrado correctamente" }
  ```

#### Inicio de Sesión
* **POST** `/auth/login`
* **Body (JSON):**
  ```json
  {
    "correoElectronico": "juan@gmail.com",
    "password": "Password123!"
  }
  ```
* **Respuesta (200 OK):**
  ```json
  {
    "token": "eyJhbGc...",
    "usuario": {
      "id": 1,
      "nombreCompleto": "Juan Pérez",
      "correoElectronico": "juan@gmail.com",
      "rol": "CIUDADANO"
    }
  }
  ```

#### Verificar Correo
* **GET** `/auth/verificar/:token`
* **Ejemplo:** `/auth/verificar/abc123`

#### Solicitar Recuperación de Contraseña
* **POST** `/auth/solicitar-recuperacion`
* **Body (JSON):**
  ```json
  { "correoElectronico": "juan@gmail.com" }
  ```

#### Restablecer Contraseña
* **POST** `/auth/restablecer-password`
* **Body (JSON):**
  ```json
  {
    "token": "abc123",
    "password": "NuevaPassword123!"
  }
  ```
</details>

<details>
<summary>🔔 Notificaciones Push (Firebase Cloud Messaging - FCM)</summary>

#### Registrar Token FCM
* **POST** `/fcm/fcm-token`
* **Headers:** `Authorization: Bearer <JWT>`
* **Body (JSON):**
  ```json
  {
    "fcmToken": "token_dispositivo",
    "dispositivoInfo": "Chrome Windows 11"
  }
  ```

#### Eliminar Token FCM
* **DELETE** `/fcm/fcm-token`
* **Headers:** `Authorization: Bearer <JWT>`
* **Body (JSON):**
  ```json
  { "fcmToken": "token_dispositivo" }
  ```

#### Obtener mis Dispositivos
* **GET** `/fcm/mis-dispositivos`
* **Headers:** `Authorization: Bearer <JWT>`
* **Respuesta (200 OK):**
  ```json
  [
    {
      "id": 1,
      "fcm_token": "fcm_token_test_juan_chrome_windows",
      "dispositivo_info": "Google Chrome en Windows 10/11 (Escritorio)",
      "fecha_registro": "2026-06-13T19:20:14.466Z"
    }
  ]
  ```
</details>

<details>
<summary>📋 Reportes Ambientales</summary>

#### Obtener Reportes Activos
* **GET** `/reportes/activos`
* **Respuesta (200 OK):**
  ```json
  [
    {
      "id": 1,
      "descripcion": "Acumulación de basura en el parque.",
      "fecha_creacion": "2026-06-13T19:20:14.466Z",
      "severidad": "Media",
      "url_evidencia_foto": "http://localhost:3001/uploads/img.jpg",
      "latitude": 19.4150,
      "longitude": -99.1620,
      "categoria": { "nombre": "Residuos Sólidos", "color_hex": "#FF5733" }
    }
  ]
  ```

#### Obtener Reporte por ID
* **GET** `/reportes/:id`

#### Crear Reporte (Subida de archivo con Multer)
* **POST** `/reportes`
* **Headers:** 
  * `Authorization: Bearer <JWT>`
  * `Content-Type: multipart/form-data`
* **Body (form-data):**
  * `descripcion`: Texto descriptivo.
  * `latitude`: Latitud numérica.
  * `longitude`: Longitud numérica.
  * `severidad`: `Baja` | `Media` | `Alta` | `Critica`
  * `categoria_id`: ID de la categoría (entero).
  * `foto`: Archivo de imagen (JPG/PNG).

#### Obtener mis Reportes
* **GET** `/reportes/mis-reportes`
* **Headers:** `Authorization: Bearer <JWT>`

#### Obtener Reportes de un Usuario Específico
* **GET** `/reportes/usuario/:userId`

#### Actualizar Estado o Puntos de Reporte (Admin)
* **PATCH** `/reportes/:id`
* **Headers:** `Authorization: Bearer <JWT_ADMIN>`
* **Body (JSON):**
  ```json
  {
    "estado_id": 3,
    "estado_puntos": "Otorgado",
    "puntos_asignados": 100
  }
  ```
</details>

<details>
<summary>📊 Estadísticas del Dashboard (Admin)</summary>

#### Obtener Estadísticas
* **GET** `/dashboard/stats`
* **Headers:** `Authorization: Bearer <JWT_ADMIN>`
* **Respuesta (200 OK):**
  ```json
  {
    "totalReportes": 150,
    "severidad": {
      "baja": 40,
      "media": 60,
      "alta": 35,
      "critica": 15
    }
  }
  ```
</details>

---

### 🧪 Guía Práctica de Pruebas (Postman / Thunder Client)

1. **Iniciar Sesión:** Envía un `POST` a `/auth/login` con credenciales de prueba para obtener el token `JWT`.
2. **Consultar Reportes Activos:** Envía un `GET` a `/reportes/activos`.
3. **Enviar Nuevo Reporte con Imagen:**
   - Crea una petición `POST` a `/reportes`.
   - Agrega la cabecera `Authorization` con el valor `Bearer <TU_JWT_TOKEN>`.
   - En la pestaña **Body**, selecciona **form-data** (no raw/json).
   - Registra los campos (`descripcion`, `latitude`, `longitude`, `severidad`, `categoria_id`) como campos de texto.
   - Registra el campo `foto` y cambia su tipo a **File/Archivo**, seleccionando una imagen local.
   - Envía y verifica la URL recibida en `url_evidencia_foto`.
4. **Probar Restablecimiento / Verificación de Correo:**
   - Si no tienes acceso al correo real configurado, puedes obtener el token generado directamente desde la base de datos:
     ```bash
     docker compose exec db psql -U postgres -d aria_db
     # Consultar token generado
     SELECT * FROM token_autenticacion;
     ```
     Luego, usa ese token en el endpoint correspondiente.
5. **Probar Notificaciones Push (FCM):**
   - Asegúrate de iniciar sesión en el frontend para registrar el dispositivo.
   - Inicia sesión como administrador (`admin@ariaplataforma.org`) para obtener su token `JWT_ADMIN`.
   - Ejecuta un `PATCH` a `/reportes/:id` cambiando el estado o los puntos.
   - Valida que el ciudadano reciba la notificación push en su navegador o dispositivo móvil.

---
*ARIA - Tu voz en el mapa, tu huella en el futuro.*
