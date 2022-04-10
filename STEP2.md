# Creando la base de datos

Vamos a crear una base de datos en postgres. Para eso usamos psql (si estás usando [nix](NIX.md) o ya tienes instalado postgres en tu máquina).

    $ psql 
    postgres=# CREATE DATABASE blog_db;
    CREATE DATABASE
    postgres=# \l
                             List of databases
    Name    | Owner | Encoding | Collate | Ctype | Access privileges 
    -----------+-------+----------+---------+-------+-------------------
    blog_db   | ediaz | UTF8     | C       | C     | 
    postgres  | ediaz | UTF8     | C       | C     | 

Acá `postgres=#` representa el prompt de psql, después de este debes ingresar el comando `create database blog_db`. Luego escribes `\l` nos muestra la lista de bases de datos disponibles. Este resultado puede variar en cada caso.

## Creando la tabla users

Ahora crearemos la tabla asociada a nuestros usuarios:

    postgres=# \c blog_db
    postgres=# CREATE TABLE users(
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );

NOTA: estamos usando Postgresql 13 o superior.

## El archivo database.sql

Todas las sentencias sql para crear nuestra base de datos las dejaremos en el archivo `database.sql`.


# A continuación 

- [Siguiente paso](STEP3.md)
- [Tabla de contenido](README.md#Pasos)