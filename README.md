# Snake Soccer ⚽ - de Colo Champre

Un juego multijugador que combina la mecánica clásica de Snake con el fútbol. Los jugadores controlan serpientes en un campo de juego, con el objetivo de empujar la pelota hacia la portería del oponente para marcar goles.

## Características
- Juego multijugador en tiempo real
- Mecánica clásica de Snake
- Para web y mobile
- Modos de juego 1v1 2v2 y 3v3
- Chat rápido
- Estadísticas y Ranking de jugadores
- Personalización de serpiente y pelota

## Tecnologías utilizadas
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Motor de plantillas: Pug
- Base de datos: MySQL
- Autenticación: JWT, bcrypt
- Comunicación en tiempo real: Socket.io

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/colochampre/snake-soccer.git
cd snake-soccer

# Instalar dependencias
npm install

# Crear archivo .env para configuración local
cp .env.example .env
```

## Configuración

Edita el archivo `.env` con tus configuraciones:

```env
NODE_ENV=development
PORT=3000
ALLOWED_ORIGINS=https://tudominio.com
```

### Variables de entorno

- **NODE_ENV**: `development` o `production`
  - En desarrollo: desactiva CSP y HSTS para facilitar pruebas en red local
  - En producción: activa todas las políticas de seguridad
- **PORT**: Puerto del servidor (por defecto 3000)
- **ALLOWED_ORIGINS**: Orígenes permitidos en producción (separados por comas)

## Uso

### Desarrollo

```bash
# Iniciar en modo desarrollo (con hot-reload)
npm run dev
```

Para acceder desde dispositivos móviles en tu red local:
1. Obtén tu IP local: `ipconfig` (Windows) o `ifconfig` (Linux/Mac)
2. Accede desde el móvil: `http://<tu-ip-local>:3000`
3. Asegúrate de que ambos dispositivos estén en la misma red WiFi

### Producción

```bash
# Iniciar en modo producción
npm start
```

