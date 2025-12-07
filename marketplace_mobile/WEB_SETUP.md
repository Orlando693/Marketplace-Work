# Marketplace Mobile App - Web Support

##  Inicio Rápido

### Ejecutar en Web
```bash
cd marketplace_mobile
npx expo start
```
Presiona `w` para abrir en el navegador web o ve a: http://localhost:8081

### Ejecutar en Móvil
- Presiona `a` para Android emulator
- Presiona `i` para iOS simulator
- Escanea el QR con Expo Go en tu celular

##  Credenciales de Prueba

Para acceder a la aplicación, usa estas credenciales:

```
Email: admin@test.com
Password: admin123
```

O presiona el botón "Use Test Credentials" en la pantalla de login.

##  Configuración de Backend

### Para Web (localhost):
El archivo `src/services/api.ts` está configurado para detectar automáticamente:
- **Web**: `http://localhost:8080/api`
- **Android Emulator**: `http://10.0.2.2:8080/api`
- **iOS Simulator**: `http://localhost:8080/api`

### Para Dispositivo Físico:
1. Abre `src/services/api.ts`
2. Cambia la IP en la última línea por la IP de tu PC:
   ```typescript
   return "http://TU_IP_LOCAL:8080/api";
   ```
3. Ejemplo: `http://192.168.1.100:8080/api`

##  Módulos Disponibles

**Users** - Gestión de usuarios
**Orders** - Gestión de órdenes
**OrderItems** - Items de órdenes
**Reviews** - Reseñas de productos
 **Products** - Catálogo de productos
**Store** - Gestión de tiendas

##  Diseño Responsivo

La aplicación ahora está optimizada para:
-  **Móvil**: Diseño en 2 columnas
-  **Tablet**: Diseño en 3 columnas
-  **Desktop/Web**: Diseño en 4 columnas con max-width de 1200px

##  Características Web

-  Login responsivo con credenciales de prueba
-  Dashboard adaptativo según tamaño de pantalla
-  Navegación optimizada para web
-  Confirmaciones nativas (alert) en lugar de Alert de React Native
-  Detección automática de plataforma (Web/iOS/Android)

##  Solución de Problemas

### El login no funciona en web:
1. Verifica que el backend esté corriendo en `http://localhost:8080`
2. Usa las credenciales de prueba: `admin@test.com` / `admin123`
3. Abre la consola del navegador (F12) para ver errores

### Error de CORS en web:
Agrega en tu backend Spring Boot:
```java
@CrossOrigin("*")
```
O configura CORS globalmente.

### La app no se ve bien en web:
1. Asegúrate de tener la última versión
2. Limpia el caché: `npx expo start --clear`
3. Recarga la página en el navegador

##  Notas Importantes

- El login simulado (mock) funciona sin backend para pruebas
- Las credenciales reales dependen de tu backend
- AsyncStorage funciona en web usando localStorage
- Todas las pantallas son responsivas

## Actualizar después de cambios

```bash
# Detener el servidor (Ctrl+C)
# Limpiar caché y reiniciar
npx expo start --clear
```

Luego presiona `w` para web o `a`/`i` para móvil.
