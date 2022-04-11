# Conexión a la base de datos

Vamos a crear el archivo `db.js` dentro de la carpeta server y dentro de este agregaremos este código:

```javascript
// db.js
const Pool = require("pg").Pool

const { connectionString } = require("./config")

const pool = new Pool(
    connectionString
)

module.exports = pool
```

Fíjate que requerimos crear una variable adicional `connectionString` en el archivo `config.js`.

Así que modifica el archivo `db.js` dejándolo así:


```javascript
// config.js
const dotenv = require('dotenv')

dotenv.config();

module.exports = {
    port: process.env.PORT,
    connectionString: process.env.CONNECTION_URL, // esta linea fue agregada en el paso 4
};
```

Ahora abre el archivo `.env` y agrega la variable `CONNECTION_URL`, de este modo este archivo quedará así:

```
PORT=3001
CONNECTION_URL=postgres://localhost:5432/blog_db
```

## Qué hace este código

El código de `db.js` es relativamente sencillo de entender. La clave está en la sexta linea cuando creamos el objeto `pool` usando el string de configuración, que corresponde al valor de la variable de entorno `CONNECTION_URL`.

# A continuación 

- [Siguiente paso](STEP5.md)
- [Tabla de contenido](README.md#Primera-Parte)