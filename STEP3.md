# Iniciando un servidor node

En este paso vamos a configurar nuestra aplicación Express sobre un servidor node.js.

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

Esta configuración se define usando ["variables de entorno"](https://es.wikipedia.org/wiki/Variable_de_entorno).

Como la configuración de entorno varía según el sistema operativo que ocupes, una buena idea es usar los archivos `.env`. 

Crea un archivo `.env` y escribe lo siguiente:

```
PORT=3001
````

De este modo defines una variable de entorno por defecto. 

ATENCIÓN: el contenido del archivo `.env` es sensible, porque en este guardaremos valores que no queremos que sean accesibles por terceros (por ejemplo un hacker). Es por esto que estos archivos no se guardan nunca en un repositorio git.

IMPORTANTE: Más adelante modificaremos el archivo `config.js` para ir agregando nuevas variables.

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

### Qué hace este código

Agreguemos el número a cada linea de nuestro código:

```javascript
1  // index.js
2  const express = require("express")
3  const cors = require("cors")
4  const { port } = require("./config")
5
6  const app = express()
7
8  // midleware
9  app.use(express.json())
10 app.use(cors())
11 
12 app.listen(port, () => {
13    console.log("servidor iniciado en puerto: " + port)
14 })
```

Las lineas 2 y 3 importan dos paquetes que usaremos para configurar la aplicación.
La linea 4 recupera el valor de la variable `port` del archivo `config.js`.

La linea 6 crea una aplicación express y la asigna a la variable app.

Las lineas 9 y 10 crean dos middlewares. La explicación de qué son los middlewares está descrita [acá](Express.md).

Finalmente en las lineas 12 a 13 "levantamos" nuestro servidor para que atienda requerimientos en el puerto definido en nuestra variable de ambiente `PORT`. Aprovechamos de mostrar ese valor en la consola.

# A continuación 

- [Siguiente paso](STEP4.md)
- [Tabla de contenido](README.md#Primera-Parte)