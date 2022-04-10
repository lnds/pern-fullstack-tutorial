# Iniciando un servidor node

En este paso vamos a crear nuestro servidor node.

## Archivo config.js

Abre un editor de texto, crea el archivo `config.js` y escribe este código:

```javascript
// config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT
};
```

En este archivo mantendremos variables de configuración que serán usadas por el servidor.

Esta configuración se define usando "variables de entorno".

Como la configuración de entorno varía según el sistema operativo que ocupes, una buena idea es usar los archivos `.env`. 

Crea un archivo `.env` y escribe lo siguiente:

```
PORT=3001
````

De este modo defines una variable de ambiente por defecto. 

ATENCIÓN: el archivo `.env` es sensible, porque en este guardaremos valores que no queremos que sean accesibles por terceros. Es por esto que estos archivos no se guardan nunca en un repositorio git.

Más adelante modificaremos el archivo `config.js` para ir agregando nuevas variables.

## El archivo index.js

Crea un archivo `index.js` dentro de la carpeta `server` y escribe este código:

```javascript
// index.js
const express = require("express")
const cors = require("cors")
const { port } = require("./config")

const app = express()

// midleware
app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log("servidor iniciado en puerto: " + port)
})
```

Ahora abre tu browser en la dirección `http://localhost:3001/`(*) y deberías ver el mensaje "Cannot GET /".

Nota (*): 3001 es el valor de la variable `PORT` que configuraste en el archivo `.env`.

# A continuación 

- [Siguiente paso](STEP4.md)
- [Tabla de contenido](README.md#Primera-Parte)