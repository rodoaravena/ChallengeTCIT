# Respuesta al Challenge de TCIT

## Introducción

A continuación, se presenta el producto final del Challenge para la postulación al cargo de Desarrollador .NET para TCIT

## Requisitos de ejecución

* **Frontend** Tener instalado `Node.js` junto al gestor de paquetes npm el cual puede obtener en este enlace: [Sito oficial Node.JS](https://nodejs.org/)
* **Backend** Tener instalado el SDK de `dotnet` en su  versión **8** el cual puede obtener en el siguiente enlace: [Descargar SDK .NET 8](https://dotnet.microsoft.com/en-us/download/dotnet/8.0), una vez instalado, instalar la herramienta de EntityFramework Core ejecutando `dotnet tool install --global dotnet-ef` en una terminal

## Ejecución

### Frontend

1. Abrir la carpeta `frontend` en una terminal y ejecutar el comando `npm install @angular/cli` para instalar la herramienta de linea de comandos de Angular

2. Luego en la misma terminal ejecutar `npm install` para instalar las dependencias del proyecto

3. Finalmente, ejecutar `ng serve` para levantar el proyecto en modo desarrollador

### Backend

1. Modificar el archivo `appsettings.json` (o `appsettings.Development.json` según corresponda) que se encuentra en la carpeta `backend/ChallengeApi/` y modificar el valor de `postgresCS` con los parametros de conexión de la base de datos de **PostgreSQL**

2. El valor del `postgresCS` predeterminado es `"Server=<HOST>; Database=<DATABASE_NAME>; Port=<PORT>; Username=<USER>; Password=<PASSWORD>"` debe cambiarlos por los que corresponda a su servidor de base de datos. Ejemplo: `"Server=url.servidor.com; Database=proyecto; Port=5432; Username=usuario; Password=contraseña`

3. Abrir la carpeta `ChallengeApi` (que está dentro de `backend`) en una terminal y ejecutar `dotnet ef database update` para cargar las tablas a la base de datos de Posgresql

4. Finalmente, ejecutar `dotnet run` para ejecutar el proyecto de .NET
