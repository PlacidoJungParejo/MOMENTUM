# Guía de Configuración del Backend MOMENTUM

## Instalación de Prerrequisitos

### 1. Instalación de XAMPP
1. Descarga XAMPP desde el [sitio web oficial](https://www.apachefriends.org/)
2. Ejecuta el instalador y sigue el asistente de instalación
3. Instala los componentes Apache y MySQL (mínimo requerido)

### 2. Instalación de Node.js
1. Descarga Node.js desde el [sitio web oficial](https://nodejs.org/)
2. Ejecuta el instalador y sigue los pasos de instalación
3. Verifica la instalación ejecutando:
    ```
    node --version
    npm --version
    ```

## Configuración del Proyecto

### 1. Iniciar XAMPP
1. Abre el Panel de Control de XAMPP
2. Inicia los servicios de Apache y MySQL
3. Haz clic en "Admin" para MySQL o navega a http://localhost/phpmyadmin
### 2. Configuración de la Base de Datos
1. En phpMyAdmin, accede a través de http://localhost/phpmyadmin
2. Haz clic en "Importar" en el menú superior
3. Selecciona el archivo SQL desde `/utils/script/momentum.sql`
4. Haz clic en "Continuar" para importar la estructura de la base de datos y sus datos
    - La base de datos `momentum` se creará automáticamente durante la importación

### 3. Configuración del Backend
1. Abre la terminal en la raíz del proyecto
2. Instala las dependencias:
    ```
    npm install
    ```
3. Inicia el servidor:
    ```
    npm start
    ```

### 4. Configuración de Postman
1. Descarga e instala [Postman](https://www.postman.com/downloads/)
2. Abre Postman
3. Haz clic en el botón "Importar"
4. Selecciona el archivo JSON desde `/utils/postman.json`
5. La colección se importará con todos los endpoints disponibles para poder probar sin tener que modificar mucho

## Pruebas
- El backend debería estar ejecutándose en `http://localhost:3000`
- Prueba la conexión usando los endpoints de la colección de Postman
- Asegúrate de que la conexión a la base de datos sea exitosa

## Solución de Problemas
- Verifica que los servicios de XAMPP estén funcionando
- Comprueba si los puertos 3000 y 3306 están disponibles
- Asegúrate de que las credenciales de la base de datos coincidan en los archivos de configuración