# PWM

# Nombre del proyecto: AutoHub

# Componentes del grupo

  -Alejo Santana, Alejandro

  -Ojeda Hernández, José Miguel
  
  -Pérez Sosa, Daniel
# Descripción del Proyecto

-Concepto principal: Básicamente, hemos creado una plataforma que centraliza múltiples talleres en un solo lugar. La idea detrás de esto es acabar con la molestia de tener que ir saltando de web en web o haciendo llamadas para encontrar un mecánico de confianza. Lo tenemos todo agrupado.

-Transparencia de la información: Nuestra herramienta permite consultar servicios, localización y disponibilidad de forma súperclara. Es decir, si alguien necesita un cambio de aceite, no solo ve qué talleres lo hacen, si no dónde están exactamente en el mapa y si tienen un hueco libre esta misma semana.

-Valor añadido: Aquí es donde realmente le solucionamos la vida al usuario. La plataforma facilita la reserva de citas online sin buscar taller por taller. Simplificando un proceso que suele ser un dolor de cabeza. El usuario entra, compara opciones, ve quién está libre y reserva al instante, todo sin salir de nuestra web.
# Requisitos Funcionales

-Registro de usuario

-Inicio de sesión

-Validación de campos obligatorios en formularios

-Selección de vehículo

-Selección de tipo de servicio

-Visualización de servicios ofrecidos

-Visualización de información del taller

-Calendario de disponibilidad

-Selección de día

-Visualización de franjas horarias disponibles y ocupadas

# PDF de Mockups y StoryBoard

-El pdf con los Mockups y el Stroyboard están ubicados en el directorio raíz y los archivos se llaman Mockups.pdf y Storyboard.pdf

# Listado de las páginas de HTML
https://www.figma.com/design/ep7QrRIzNu6s7XHIGgbBrd/SPRINT-1?node-id=33-218&t=WaOALsUylymES8q4-0
- (Para una mayor rapidez a la hora de ver e identificar los Mockups, en este apartado
se hablarán sobre los layers, es decir, los nombres que les hemos puesto a los mockups, que pueden ser tanto números,
como nombres, todo esto hablando sobre el figma)


Todos estos archivos se encuentran en PWM->pages

- El index corresponde a la página principal u Home (número 1 o Pantalla sin inicio de sesión)
- car_select corresponde al mockup nº18 o Sección Reserva
- calendar corresponde al 17 o el calendario
- profile corresponde al 13 o perfil 1
- reviews corresponde al numero 4 o reseñas T1
- Taller-información corresponde al número 12 o página taller

# Listado de archivos templates

Todos estos archivos se encuentran en PWM->partials 

- Footer-> se carga en todas las páginas y en él observamos datos de carácter general
- Header -> se carga en todas las páginas, y es bastante parecido al footer
- Talleres-Previsualización -> se carga en el index, y serán los distintos talleres, que en vez de meter directamente
en la página de index 1 a 1, con este template será mucho más sencillo
- luego también tenemos Text-> en este los cargamos siempre que accedamos a uno de los dos enlaces de footer relacionados con 
las preguntas frecuentes o sobre nosotros, realmente son lo mismo, ya que todavía no son de vital importancia. y tienen dentro
lore-Ipsum.
- Luego tenemos Especialidad-Taller, que es un template que nos servía de prueba, y sirve de prueba cuando queremos añadir un template
- también tenemos log y quest, que son formularios y diálogos hechos, que aunque todavía no están implementados, se añadirán en la siguiente
iteración

# Nuevo Listado de detalles del Sprint 2

# Nombre y ubicacion de los nuevos mockups
El nombre de los mockups responsive, es mockups_responsive y se encuentra en el directorio raíz

# Listado de paginas HTML

Index.html
- Se encuentra en el directorio principal, no dentro de ninguna carpeta, siguiendo las recomendaciones de nuestro profesor
    hemos decidido que lo mejor que podíamos hacer es sacar el index fuera, para que se vea a simple vista y hemos realizado
    la refactorización adecuada para ello
- En el index nos encontramos con 2 formularios cuando hacemos click en el botón del perfil o en las imágenes
    de cualquier taller, en el de iniciar sesión, la contraseña y el correo deben coincidir con alguno de los valores del JSON
    es decir, con un usuario ya creado por ejemplo (usuario: Leon@gmail.com y pass: 1234), el otro formulario que hay en esta
    página es el de registrarse, las validaciones que hacemos, es que hay campos que no pueden estar vacíos(required), que el correo, debe
    poseer un "@"(type="email") y que la contraseña como mínimo tiene que ser de 4 caracteres (minlength=4)
- en el apartado de responsive, en el index, suceden varias cosas, el header se hace más pequeño y desaparece el buscador,
    los talleres se posicionan uno debajo de otro en modo móvil, y en el footer cada elemento, como
    las políticas o redes sociales, uno debajo de otro
- los datos que se cargan del JSON, en el index son varias, uno, son del perfil, ya que al iniciar sesión aparece el nombre
    de usuario de cada usuario, también se cargan los nombre de los talleres, en cuanto a los templates en esta página hay 3 elementos
    los article que son Talleres-previsualisación.html, que son los talleres, el footer y el header.

Calendar.html
- en cuanto a responsive en esta página están el footer, el header, y los elementos que poseen esta página como el calendario, con las horas
y el botón de reserva, se muestran de forma vertical para una mejor visualización
- templates usados son los del footer y header, y los datos del JSON obtenidos es el nombre del taller y la especialidad

car_select-html
- es practicamente igual que calendar, en cuanto a footer y header y la visualisación de los elementos como la selección del coche y
 de la información mostrado, en formato vertical
- los templates usados son footer y header, y los datos del JSON obtenidos son, los vehículos del usuario logeado, nombre del taller
y precio por el servicio prestado

profile.html
- footer y header igual que en las otras páginas, en cuanto al diseño responsive se refiere, y como esta página es sencilla, simplemente
hacemos que los botones de reservas y coches sean más pequeños y se adapten a los diferentes dispositivos
- los templates usados son footer y header, luego los datos que obtenemos del JSON en esta página son, el número de vehículos que tenga
, nombre y apellidos y las reservas que tenga
- En esta página, hay un formulario para añadir coche a la cuenta, en el cual hay 3 campos, marca, modelo y contraseña, en el cual,
los tres campos son requeridos, para este Sprint hemos decidido que podamos poner cualquier nombre y demás, ya que lo ideal, sería que 
fuera un desplegable y que pudieras escribir y seleccionar la marca y matrícula

reviews.html
- es responsive como las otras páginas, esta es bastante más sencilla ya que, al ser solo reseñas, y no poseer más elementos,
la mayor dificultad fue, como en el resto de páginas, implementar el footer y el header
- tenemos dos templates de siempre footer y header, y aparte tenemos template dentro de review.js, que dependiendo del taller
que sea, pone una reseñas u otras, y del JSON, también obtenemos a traves de reviews.js los datos de cada taller, igual que con
el template.

Taller-información.html
- en cuanto a responsive, lo que hacemos aquí, es lo mismo con el footer y header que las demás, y luego se juntan más las
imágenes del taller, y luego la foto del mapa la movemos debajo de las fotos del taller para que sea visible de forma correcta
- los templates que usamos son footer, header y los datos que cargamos del JSON, son las especialidades de los talleres y 
la cantidad de reseñas que posee el taller, más la media de la valoración de todas las reseñas

-Otros
- luego también tenemos una página que se carga de un template, que es text.html, y que dependiendo de la página en que estés
si hacemos click en el footer, en la sección de políticas o preguntas frecuentes, nos mostrarán las preguntas frecuentes o 
políticas del taller, o nos mostrará las políticas y preguntas de la propia página web
- templates son text, footer y header, y no hay datos del JSON cargados


# Usuarios de prueba

Usuario: Leon@gmail.com

Pass:1234

tambien se pueden crear nuevos usuarios, aunque no se guardan en el JSON, pero es completamente usable.

# Ubicación del JSON
se encuentra en la carpeta JSON y es el archivo content.json

