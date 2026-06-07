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

*ARIA - Tu voz en el mapa, tu huella en el futuro.*
