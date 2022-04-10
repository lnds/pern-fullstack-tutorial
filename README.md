# Tutorial PERN Stack Completo

Este tutorial implementa una aplicación usando el stack PERN (Postgresql, Express, React and Node.js).

## Sobre este Tutorial

Fue desarrollado en MacOs usando NIX. Las notas sobre el uso de NIX las puedes encontrar en el archivo NIX.md.

Si usas Linux: TBD
Si usas Windows: TBD

# Objetivos

Crear un tutorial completo para construir una aplicación que use el stack PERN, incorpore buenas prácticas de código y seguridad. Además muestra todo lo detallado para demostrar el uso de este framework.

# Descripción de la aplicación

Construiremos un plataforma de blogging. El usuario podrá crear artículos y los visitantes podrán publicar comentarios anónimos o como usuarios registrados. Los comentarios anónimos quedarán en una cola de moderación, los comentarios como usuarios registrados se publicarán inmediatamente.

Cada usuario registrado podrá crear su propio blog. Además podrá revisar los comentarios que ha emitido.

Los artículos tendrán un botón para apoyarlo mediante "aplausos". 
Los comentarios tendrán un botón me gusta (like) y un botón no me gusta (dislike). Si un comentario tiene más "dislikes" que "likes" el comentario se bloquea y el autor del blog es el único que puede desbloquearlo.

## Pasos

Cada paso del titular se describe en un archivo específico, que quedan enlazados a continuación:

- [Paso 1: Configurando el backend](STEP1.md)
- [Paso 2: Creando la base de datos](STEP2.md)
- [Paso 3: Iniciando un servidor node](STEP3.md)


# Licencia y Uso

Este código es de uso libre. Personalmente lo uso en clases que imparto, pero puedes usarlo en lo que quieras.
Apreciaría si das los créditos.

Este código está basado en diversas fuentes de información en internet, pero principalmente en estos tutoriales, publicados en el canal "The Stoic Programmers" en youtube:

Parte 1: https://www.youtube.com/watch?v=7UQBMb8ZpuE&t=1008s
Parte 2: https://www.youtube.com/watch?v=cjqfF5hyZFg&t=25s

(c) 2022 Eduardo Díaz