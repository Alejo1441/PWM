# PWM

# Nombre del proyecto: AutoHub
# Componentes del grupo

  -Alejo Santana, Alejandro

  -Ojeda Hernández, José Miguel
  
  -Pérez Sosa, Daniel
# Descripción del Proyecto

-Concepto principal: Básicamente, hemos creado una plataforma que centraliza múltiples talleres en un solo lugar. La idea detrás de esto es acabar con la molestia de tener que ir saltando de web en web o haciendo           llamadas para encontrar un mecánico de confianza. Lo tenemos todo agrupado.

-Transparencia de la información: Nuestra herramienta permite consultar servicios, localización y disponibilidad de forma súper clara. Es decir, si alguien necesita un cambio de aceite, no solo ve qué talleres lo hacen,      sino dónde están exactamente en el mapa y si tienen un hueco libre esta misma semana.

-Valor añadido: Aquí es donde realmente le solucionamos la vida al usuario. La plataforma facilita la reserva de citas online sin buscar taller por taller. Simplificando un proceso que suele ser un dolor de cabeza. El        usuario entra, compara opciones, ve quién está libre y reserva al instante, todo sin salir de nuestra web.
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
se hablarán sobre los layes, es decir, los nombres que les hemos puesto a los mockups, que pueden ser tanto números,
como nombres, todo esto hablando sobre el figma)


Todos estos archivos se encuentran en PWM->pages

- El index seria la pagina principal o Home (nº1 o Pantalla sin inicio de sesión)
- car_select seria el mockup nº18 o el Sección Reserva
- calendar seria el 17 o el calendario
- profile seria 13 o perfil 1
- reviews seria el numero 4 o reseñas T1
- Taller-información sería el número 12 o pagina taller

# Listado de archivos templates

todos estos archivos se encuentran en PWM->partials 

- Footer-> se carga en todas las páginas y en él observamos datos de caracter general
- Header -> se carga en todas las páginas, y es bastante parecido al footer
- Talleres-Previsualisación -> se carga en el index, y seran los distintos tallers, que en vez de meter directamente
en la pagina de index 1 a 1, con este template sera mucho mas sencillo
- luego tambien tenemos Text-> en este los cargamos siempre que accedamos a uno de los dos enlaces de footer relacionados con 
las preguntas frecuentes o sobre nosotros, realmente son lo mismo, ya que todavia no son de vital importancia. y tienen dentro
lore-Ipsum.
- Luego tenemos Especialidad-Taller, que es un template que nos servia de prueba, y sirve de prueba cuando queremos añadir un template
- tambien tenemos log y quest, que son formularios  y dialgos hechos, que aunque todavia no estan implentados, se añadiran en la siguiente
itereación


# Otros
- hemos realizado un par de tareas en javaScript, aparte de la de poder añadir templates a las páginas, como es el caso del footer y header
ya que estas, son de un archivo visto en clase, una para poder seleccionar botones en la pagina de calendar(esta se encuentra dentro del html del propio calendar) y también en la parte del perfil para 
poder cambiar entre los datos de los coches en posesión de un individuo y las reservas que posee, este ultimo se encuentra en la carpeta de javascript y se llama
profile.js.

