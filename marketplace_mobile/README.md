# Welcome to your Expo app 

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

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
el archivo .env tiene que contener lo siguiente JWT_SECRET=misupersecretoultralargo1234567891011121314151617181920
