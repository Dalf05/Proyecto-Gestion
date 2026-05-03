# SISTEMA DE GESTIÓN DE INCIDENCIAS - UNIE UNIVERSIDAD

Este proyecto es una plataforma para la gestión de incidencias dentro de la universidad UNIE. Permite a los diferentes miembros de la comunidad universitaria reportar y dar seguimiento a problemas técnicos, de infraestructura o mobiliario.

## 🚀 Instalación y Ejecución

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1.  **Requisitos:** Asegúrate de tener instalado Node.js (v18 o superior).
2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
3.  **Ejecutar el Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
4.  **Acceso:** Abre tu navegador en `http://localhost:3000`.

*Nota: Aunque la propuesta inicial mencionaba Django, este prototipo final funciona sobre un stack de Node.js (Express) con React para garantizar la máxima fluidez en la interfaz y compatibilidad con el entorno de despliegue actual.*

## 👥 Usuarios de Prueba

Para probar el sistema con diferentes roles, puedes seleccionar estos perfiles al iniciar la aplicación:

*   **Administrador:** Acceso total y panel de control con estadísticas.
*   **Técnico:** Gestión operativa de incidencias (cambio de estado).
*   **Docente:** Reporte de fallos específicos de aula y TI.
*   **Alumno:** Reporte de fallos generales (Limpieza, Mobiliario).

## 🛠️ Tecnologías Utilizadas

*   **Backend:** Node.js + Express (Simulando la lógica de Django).
*   **Base de Datos:** SQLite (archivo `db.sqlite3` autogenerado).
*   **Frontend:** React 19 + Tailwind CSS.
*   **Gráficos:** D3.js para la distribución de incidencias.
*   **Iconos:** Lucide React.

## 📂 Estructura del Código

*   `server.ts`: Contiene toda la lógica del backend, el esquema de la base de datos y el algoritmo de prioridad automática.
*   `src/App.tsx`: Enrutamiento y gestión de la sesión del usuario.
*   `src/components/`: Componentes modulares (Dashboard, Listados, Formularios).

---
*Desarrollado como trabajo de curso - UNIE 2026*
