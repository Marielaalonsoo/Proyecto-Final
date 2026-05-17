# PistaPadel

Proyecto unificado de backend y frontend para gestionar pistas y reservas de padel.

## Como ejecutar

Desde la carpeta raiz del proyecto:

```powershell
mvn spring-boot:run
```

Despues abre el navegador en:

```text
http://localhost:8080/index.html
```

## Estructura

- Backend: `src/main/java`
- Configuracion y datos: `src/main/resources`
- Frontend: `src/main/resources/static`
- HTML principales: `src/main/resources/static/*.html`
- CSS: `src/main/resources/static/css`
- JavaScript: `src/main/resources/static/js`

El frontend ya esta dentro del backend, asi que el proyecto se ejecuta como una sola aplicacion Spring Boot.

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

## Notas

- El proyecto ya no necesita un repositorio Git separado para frontend y backend.
- Se puede iniciar un repositorio Git nuevo desde esta carpeta raiz.
- La autenticacion del backend usa Basic Auth; el frontend guarda las credenciales en `sessionStorage` mientras dura la sesion del navegador.
