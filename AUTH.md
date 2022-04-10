# Registro, Autenticación y Control de Acceso

Imagina que estás a cargo de la seguridad de un club, o una disco. 

Este club tiene un área pública al que pueden acceder todas las personas. Y hay un área privada a la que acceden los socios del club.
Además a este club sólo ingresan mayores de edad. Por último, el club es muy estricto y te piden registrar en un libro los nombres y número de identificación (RUT, DNI, etc) de todos los que ingresan.

Pones guardias en las puertas de entrada que se encargan de verificar a las personas que entran al club. Si la persona tiene una credencial entregada por el club entonces se le marca en la mano con un sello de tinta, que brilla en la oscuridad y que es de color verde. A los no socios se les marca con un sello de color amarillo.

Luego los guardias de la sección VIP sólo tienen que mirar si la persona tiene un sello de color verde en su mano.

La labor más compleje la cumplen los guardias de la entrada que deben leer la cédula de identidad, verificar la edad y registrar el acceso en un libro. Pero la labor de los guardias internos es más simple porque la realizan con un simple vistazo.

Estos sellos tienen la gracia que duran pocas horas adheridos al cuerpo y son intransferibles.

Al proceso de validar las credenciales de los socios lo llamamos **"Autenticación"**. 

Hay un proceso previo que han realizado los socios del club, y es cuando han obtenido la tarjeta del club, este se llama **"Registro"**.

Por último cuando verificamos el sello que llevan las personas dentro del club, antes de que entren a una zona VIP, estamos ejecutando el proceso de **"Control de Acceso"**.

En una aplicación web ocurre lo mismo. Hay URLs públicas y otras a las que acceden los usuarios autenticados. Incluso en algunos casos hay niveles de acceso, de modo que hay URLs a las que acceden ciertos usuarios que cumplen con algún perfil requerido. En este tutorial no tenemos ese tipo de control tan detallado.
