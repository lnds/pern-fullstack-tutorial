# ¿Qué es Express?

Express es un framework minimal y flexible para construir aplicaciones web sobre Node.js.

Puedes leer su documentación oficial acá: https://expressjs.com


Para efectos de este tutorial usaremos Express en el backend debido a su simplicidad y flexibilidad. Además es uno de los frameworks más populares para Node.

## El protocolo HTTP

El protocolo HTTP es un protocolo sobre TCP. En este protocolo se envían requerimientos (requests) los que corresponden a mensajes que tienen la siguiente sintáxis:

- Request line: que consiste de un método (en mayúsculas), un espacio, una URL, otro espacio y la versión.
Por ejemplo:
    GET /images/logo.png HTTP/1.1
- Cero o más request headers (encabezados). Cada encabezado tiene un nombre de campo (field name), luego viene el símbolo dos puntos (':'), un espacio opcional, el valor del campo (field value)
Por ejemplo:
    Host: www.dominio.com
    Content-Type: application/json

- Una linea en blanco
- Un cuerpo opcional del mensaje (message body), que puede ir en diversos formatos.


Los servidores HTTP mandan una respuesta usando el formato:

- Status line: que consiste de la versión del protocolo, un espacio, un código de estado (response status code), otro espacio, y una razón (opcional). Por ejemplo:
    HTTP/1.1 200 OK

- Cero o más response headers (encabezados de respuesta), con un formato idéntico al de los request headers. Ejemplo:
    Content-Type: text/html

- Una linea en blanco
- Un cuerpo opcional con el cuerpo del mensaje (message body)

## Request y Response object en Express

La descripción oficial del objeto que representa un Request HTTP en Express está acá: https://expressjs.com/en/4x/api.html#req.

La descripción del objeto que representa un Response HTTP en Express está acá: https://expressjs.com/en/4x/api.html#res

## Métodos HTTP

Los métodos posible en HTTP son: GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE y PATCH.

Nosotros usaremos los métodos en el sentido que se usan en [REST](REST.md).


## Manejando distintos "request methods" en Express

En Express es bastante sencillo crear funciones que atiendan requests específicos según el tipo de método.

Veamos un ejemplo:

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('hola mundo')
})

app.listen(3000)
```

Acá hemos creado una aplicación representada por el objeto `app` y esta aplicación define una "ruta" para el método GET y la url "/". Notar que esta definición de enrutamiento recibe un callback, que es una función que recibirá dos argumentos `req` y `res`, que corresponden a los objetos que representan al request y al response respectivamente.