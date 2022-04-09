# Paso 1: Configurando el backend

Crea un directorio donde dejarás tu aplicación:

    $ mkdir blog_app

Nota: Acá el signo `$` representa el prompt de tu sistema operativo. Debes siempre escribir los comandos que vienen después del signo $.

Luego cambiate al directorio

    $ cd blog_app

Por fortuna estos comandos funcionan en los 3 sistemas operativos que usaremos.

Ahora crearemos una carpeta donde dejaremos nuestro server:

    $ mkdir server

E inicializaremos node en esta carpeta:

    $ cd server
    $ npm init -y

Después de hacer esto si revisas el contenido de la carpeta verás un archivo llamado `package.json`:

    $ ls 
    package.json

En windows:
    > dir
    package.json

Luego instalaremos los paquetes necesarios:

    $ npm i express cors pg jsonwebtoken bcrypt

Estos son los paquetes que necesitaremos

- express: es el framework web
- cors: un middleware que implementa soporte para CORS (Cross-origin resource sharing)
- pg: integración con postgresql
- jsonwebtoken: para generar tokens JWT para darle seguridad al uso de nuestras APIs
- bcrypt: que permite encriptar, en particular las passwords

# A continuación 

[Siguiente paso](STEP2.md)
[Tabla de contenido](README.md#Pasos)