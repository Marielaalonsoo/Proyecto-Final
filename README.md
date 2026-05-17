# PistaPadel

Proyecto unificado de backend y frontend para gestionar pistas y reservas de padel.


## Miembros: 

Mariela Alonso Morales, Andrés Guerrero Cabrera, Álvaro Amieva Bascarán y Pablo de la Cal Priede. 


## Estructura

- Backend: `src/main/java`
- Configuracion y datos: `src/main/resources`
- Frontend: `src/main/resources/static`
- HTML principales: `src/main/resources/static/*.html`
- CSS: `src/main/resources/static/css`
- JavaScript: `src/main/resources/static/js`

## Usuarios de prueba

Para poder probar la aplicación se incluyen dos usuarios iniciales: un administrador y un usuario normal.


**Administrador**

Email: `admin@padel.com`  
Contraseña: `admin`

**Usuario normal**

Email: `user@padel.com`  
Contraseña: `user`

Las contraseñas están almacenadas en la base de datos mediante `password_hash`.


## Endpoints principales

Todos los endpoints del backend usan el prefijo `/pistaPadel`.

- `GET /pistaPadel/health`
- `POST /pistaPadel/auth/register`
- `POST /pistaPadel/auth/login`
- `GET /pistaPadel/auth/me`
- `POST /pistaPadel/auth/logout`
- `GET /pistaPadel/courts`
- `POST /pistaPadel/courts`
- `PATCH /pistaPadel/courts/{courtId}`
- `DELETE /pistaPadel/courts/{courtId}`
- `GET /pistaPadel/courts/{courtId}/availability?date=YYYY-MM-DD`
- `GET /pistaPadel/availability?date=YYYY-MM-DD`
- `GET /pistaPadel/reservations`
- `POST /pistaPadel/reservations`
- `GET /pistaPadel/reservations/{reservationId}`
- `PATCH /pistaPadel/reservations/{reservationId}`
- `DELETE /pistaPadel/reservations/{reservationId}`
- `GET /pistaPadel/admin/reservations`
- `GET /pistaPadel/users`
- `GET /pistaPadel/users/{userId}`
- `PATCH /pistaPadel/users/{userId}`
