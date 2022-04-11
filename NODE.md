# ¿Qué es Node.js?

Es un entorno de ejecución para Javascript, que usa el engine [V8](https://v8.dev) para interpretar este lenguaje.

El engine V8 interpreta código javascript y lo traduce a código de máquina, y es usado por el browser Chrome de Google, por Node y por Deno, que es otro entorno similar a Node pero más reciente.

Node permite ejecutar aplicaciones fuera de un browser, en particular en un servidor. 

Node usa el modelo de gestión de entrada y salida sin bloqueo controlado a través de eventos. Esto se conoce como el "event-loop".

Este diagram describe la estructura del event loop:

![arquitectura de Node.js](node-architecture.jpeg "Imagen provista por [@RichOnTheWeb](https://twitter.com/RichOnTheWeb/status/494959181871316992)")

No voy a explicar en detalle como funciona el event loop, pero te dejo algunas referencias:

- https://2014.jsconf.eu/speakers/philip-roberts-what-the-heck-is-the-event-loop-anyway.html
- https://www.youtube.com/watch?v=PNa9OMajw9w
- https://medium.com/the-node-js-collection/what-you-should-know-to-really-understand-the-node-js-event-loop-and-its-metrics-c4907b19da4c

Lo importante es entender que tu código corre en un único thread y cuando ejecutas operaciones de I/O, que potencialmente pueden bloquear tu thread, estas son ejecutadas  por Node.js usando distintas estrategias para asegurar de que estas acciones se ejecuten sin bloquer tu loop principal.

Node se puede usar para crear juegos, editores de texto (como VS Code por ejemplo), y por supuesto aplicaciones web.

Gracias a frameworks como [Express](Express.md) podemos usar Node.js como un servidor de aplicaciones web.