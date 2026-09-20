import IDialog from "@/models/IDialog";

// REPRESENTA LOS DIALOGOS DE LOS NIVELES, CON SUS PREGUNTAS Y RESPUESTAS
export const dialogs: IDialog[] = [
  // ── NIVEL 1 ─────────────────────────────────────────────────────────────
  // Buenos Aires (provinceId: 1)
  {
    provinceId: 1,
    locationId: 1,
    npc: "Alberto",
    overlayBackgroundUrl: "/images/loadingscreens/level1/province_buenosaires/obelisco.jpg",
    npcCompleteUrl: "/images/dialogbackground/level1/dialogo_buenosaires_kiosco.jpg",
    infoBackground:
      "El Obelisco de Buenos Aires, ubicado en la intersección de las avenidas 9 de Julio y Corrientes, es uno de los monumentos más emblemáticos y representativos de la ciudad. Erigido en 1936 para conmemorar el cuarto centenario de la primera fundación de la capital, esta imponente estructura de 67,5 metros de altura se ha consolidado como el punto de encuentro por excelencia para festejar hitos deportivos, culturales y sociales.",
    portraitUrl: "/images/portraits/level1/portrait_alberto.webp",
    introText:
      "— Disculpe, ¿vio pasar a un sospechoso con estas características?\n\n* Abrís el expediente con las características * \n\n— ¡Uhh, jefe, llegás justito! Recién se me acaba de pasar por al lado un tipo corriendo...",
    questions: [
      "¿Qué tenía puesto?",
      "¿Estaba comiendo algo?",
      "¿Iba solo o acompañado?",
    ],
    answers: [
      "Puaaa, un traje sastrero muy clásico, muy pituco andaba el gil. Bolso de viaje y todo.",
      "Sehh, ese gordo panza andaba con una empanada en la mano, que hombre feliz se veía ese hdp.",
      "Iba solo creo, pero no estoy seguro."
    ],
  },
  {
    provinceId: 1,
    locationId: 2,
    npc: "Verdulero",
    portraitUrl: "/images/portraits/level1/portrait_bol.webp",
    overlayBackgroundUrl: "/images/loadingscreens/level1/province_buenosaires/mercadoavellaneda.webp",
    npcCompleteUrl: "/images/dialogbackground/level1/dialogo_buenosaires_verduleria.jpg",
    infoBackground:
      "El Mercado de Avellaneda es un centro neurálgico de compras, comercio y vida cotidiana popular en la zona sur del Gran Buenos Aires, conocido por su intenso movimiento de puesteros, comerciantes y transeúntes a lo largo de toda la semana.",
    introText:
      "¡Hola, paisano! ¿Qué andá buscando por estos pagos? Si es por los muchachos que pasaron corriendo, usté dirá, que yo vi todito desde mi puesto.",
    questions: [
      "¿Pudo ver cómo era?",
      "¿Algo que lo destacaba?",
      "¿Sabe hacia dónde se fue?",
    ],
    answers: [
      "Pucha, joven... ahí sí que me falló la vista, la verdad que no sabría decirle bien cómo era.",
      "Sí, padrecito, una cosa que se notaba al toque es que era bien bajito, y andaba con un apuro... como si lo fuera persiguiendo el diablo.",
      "No sabría decirle con certeza, che... con tanta balumba de gente que pasa por aquí, se me perdió de vista al ratico.",
    ],
  },
  {
    provinceId: 1,
    locationId: 3,
    npc: "Policía Lucas",
    portraitUrl: "/images/portraits/level1/portrait_lucas.webp",
    overlayBackgroundUrl: "/images/loadingscreens/level1/province_buenosaires/ezeiza.webp",
    npcCompleteUrl: "/images/dialogbackground/level1/dialogo_buenosaires_ezeiza.jpg",
    infoBackground:
      "El Aeropuerto Internacional Ministro Pistarini (Ezeiza) es la principal terminal aérea internacional de Argentina, situado a 35 kilómetros al sudoeste de la Ciudad Autónoma de Buenos Aires, conectando al país con todo el mundo.",
    introText: "— Buen día, ¿en qué lo puedo ayudar, señor?\n\n — Si oficial, estoy en búsqueda de un sospechoso con las siguientes características.\n\n* Le mostras un poco del expediente al oficial. * \n\n",
    questions: [
      "¿Sabe qué vuelo tomó?",
      "¿Tenía algo encima?",
      "¿Llevaba algo que llame la atención?",
    ],
    answers: [
      "Me mataste. Pero, ahora que lo decís, creo que lo vi hablar con otra persona, recuerdo que mencionó algo de tomarse un buen fernandito",
      "No que yo haya visto.",
      "Un bolso negro y una valija.",
    ],
  },

  // Córdoba (provinceId: 2)
  {
    provinceId: 2,
    locationId: 1,
    npc: "Vendedor de medias Braian",
    portraitUrl: "/images/portraits/level1/portrait_braian.webp",
    overlayBackgroundUrl: "/images/loadingscreens/level1/province_cordoba/plazasanmartin.webp",
    npcCompleteUrl: "/images/dialogbackground/level1/dialogo_cordoba_plazasanmartin.jpg",
    infoBackground:
      "La Plaza San Martín es el corazón histórico y cívico de la ciudad de Córdoba. Rodeada por la Catedral y el Cabildo Histórico, es el punto de encuentro tradicional de peatones, artistas y vendedores.",
    introText:
      "- Que paso compa, se le cayó la facha me parece, me compraría unas medias?, 3 pares por 10 mil pesitos, un oferton.\n\n- Disculpe, pero ahora mismo estoy en busca de un sospechoso con estas características.",
    questions: [
      "¿Sabe si pasó una persona que cumpla con estas características?",
      "¿En que se movilizaba?",
      "¿Llevaba algo en especial?",
    ],
    answers: [
      "Si amigo, tenía la camisa toda manchada de grasa, alto asado se comió de seguro. Le quise vender y me re descansó, me dijo que tenia un puestito pedorro y que no se qué, al final me dijo si iba a las cataratas de no se donde me compraba.",
      "En silla de ruedas debería ir, pero nah.",
      "Además de que casi se le revienta el lompa y se le salían los terribles rollos, también se le salian los fajos de dólares a ese gato. Creo que vi hasta una zunga... medias no compra pero zungas si, que loco che.",
    ],
  },
  {
    provinceId: 2,
    locationId: 2,
    npc: "Camarero Tiziano",
    portraitUrl: "/images/portraits/level1/portrait_meserotiziano.webp",
    overlayBackgroundUrl: "/images/loadingscreens/level1/province_cordoba/nuevoguemes.webp",
    npcCompleteUrl: "/images/dialogbackground/level1/dialogo_cordoba_restoguemes.jpg",
    infoBackground:
      "El barrio Güemes de Córdoba es famoso por su polo gastronómico, sus casas de diseño y sus bares bohemios, donde locales y turistas se reúnen para disfrutar de tragos de autor, platos tradicionales y ferias de artesanías.",
    introText: "- Buenos días señor, ¿tiene reserva?\n\n- Disculpe pero no. Estoy en búsqueda de un sospechoso con estas características.\n\n* Le mostras las características del sospechoso *",
    questions: [
      "¿Pudo notar si llevaba algo con él?",
      "¿Algo que pueda destacar de él?",
      "¿Sabe qué comió?",
    ],
    answers: [
      "Mmm, recuerdo a alguien así. Si, creo que tenía una especie de guardia de seguridad, le vivía secando la nuca todo el tiempo el pobre. Hablaban de la Plaza San Martin.",
      "Si, ni un peso de propina dejó el rata hdp, debería haberle escupido el fernandito que se pidió, encima casi se olvida su valija aca, vaya uno a saber que tendrá ahí.",
      "La pregunta sería, ¿qué no comió? Mamita, parecía Kirby, todo de una se lo morfo, era una aspiradora sin tope. Y ni un peso de propina.",
    ],
  },
  {
    provinceId: 2,
    locationId: 3,
    npc: "Cura Antonio",
    portraitUrl: "/images/portraits/level1/portrait_curaantonio.webp",
    overlayBackgroundUrl: "/images/loadingscreens/level1/province_cordoba/manzanajesuitica.webp",
    npcCompleteUrl: "/images/dialogbackground/level1/dialogo_cordoba_manzanajesuitica.jpg",
    infoBackground:
      "La Manzana Jesuítica de Córdoba, declarada Patrimonio de la Humanidad por la UNESCO, alberga la Universidad Nacional de Córdoba, el Colegio Nacional de Monserrat y la Iglesia de la Compañía de Jesús, testimonio histórico del siglo XVII.",
    introText: "- ¿Hola hermano mio, viene a recibir las bendiciones matutinas?\n\n- Buen dia Padre. Ahora mismo no, estoy en búsqueda de alguien que reúne estas características.\n\n* Le mostrás al cura las características *",
    questions: [
      "¿Usted vió a mi sospechoso?",
      "¿En qué vehículo se movilizaba?",
      "¿Pudo entablar una conversación con el sospechoso?",
    ],
    answers: [
      "Ay siii, como para no notarlo, esos pequeños ojos marrones café, me encandilaron como el cántico de un ángel.",
      "Uffa, no pude notarlo, ese enanito tan lindo, su belleza es como ver las montañas de las sierras por las mañanas, o poder presenciar la divinidad de un querubín en el.",
      "Si, hablamos del mundial y su adoración hacia la copa del mundo y cómo le encantaría llevarsela a su casa para tenerla en su cama y dormir con ella.",
    ],
  },

  // Misiones (provinceId: 3)
  {
    provinceId: 3,
    locationId: 1,
    npc: "Jardinero Carlitos",
    portraitUrl: "/images/portraits/level1/portrait_jardinerocarlitos.webp",
    overlayBackgroundUrl: "/images/loadingscreens/level1/province_misiones/jardinalbertoroth.webp",
    npcCompleteUrl: "/images/dialogbackground/level1/dialogo_misiones_jardinalbertoroth.jpg",
    infoBackground:
      "El Jardín Botánico Alberto Roth de Posadas es un oasis natural de conservación vegetal y recreación ecológica, con senderos rodeados de árboles autóctonos de la selva misionera y una rica biodiversidad.",
    introText:
      "- ¿Eh ura, venis a comprar algunas florcitas para su Kuñataĩ? Yo le puedo dar un buen precio, no se preocupe.\n\n- Buen día, ahora mismo no, estoy en búsqueda de alguien que reúne estas características.\n\n* Le mostrás las características al jardinero *",
    questions: [
      "¿Te acordás de una persona parecida?",
      "¿Viste en que se movilizaba?",
      "¿El sujeto en cuestión estaba con una camisa grasienta?",
    ],
    answers: [
      "Que pregunta de mierda chango, la cantidad de turistas que hay por aca, ¿te pensas que me voy a acordar?",
      "Cada croto me encuentro por aca gurisa, ya si me pongo a mirar el auto...",
      "¿Estás hablando de mi suegra acaso? Si la quiere arrestar no me quejo, me haría un gran favor?",
    ],
  },
  {
    provinceId: 3,
    locationId: 2,
    npc: "Pescador Don Juan",
    portraitUrl: "/images/portraits/level1/portrait_pescadordonjuan.webp",
    overlayBackgroundUrl: "/images/loadingscreens/level1/province_misiones/costanera.webp",
    npcCompleteUrl: "/images/dialogbackground/level1/dialogo_misiones_costanera.jpg",
    infoBackground:
      "La Costanera de Posadas bordea el imponente Río Paraná, ofreciendo kilómetros de paseo peatonal, miradores, monumentos y vistas privilegiadas de la ribera fluvial hacia la vecina Encarnación.",
    introText: "¿No me distraiga ura, no ve que estoy pescando?",
    questions: [
      "¿Estoy buscando a un sospechoso, sabe hacia dónde pudo ir?",
      "Necesito saber si tiene alguna característica del sospechoso.",
      "¿Sabe si lo pudo ver tomando fernet o donde lo consiguió?",
    ],
    answers: [
      "Justo ahora me venis a joder, la marea esta en su mejor punto, puedo sentir como se acercan los pescados, no me venga a romper las pelotas.",
      "Ni idea chango, mis ojos solo están enfocados en capturar a un gran Surubi del Paraná, llego a tenerlo en mis manos y no sabes lo que voy a festejar jajaja.",
      "Nahhh, que fernet? Aca se toma terere chango, no me interesan las bebidas de los porteños.",
    ],
  },
  {
    provinceId: 3,
    locationId: 3,
    npc: "Salvavidas Fernando",
    portraitUrl: "/images/portraits/level1/portrait_salvavidasfernando.webp",
    overlayBackgroundUrl: "/images/loadingscreens/level1/province_misiones/playabrete.webp",
    npcCompleteUrl: "/images/dialogbackground/level1/dialogo_misiones_playaselbrete.jpg",
    infoBackground:
      "Las Playas El Brete y Costa Sur son los principales balnearios y centros de recreación veraniega a orillas del río Paraná en Misiones, con amplias áreas de arena, deportes acuáticos y paradores.",
    introText:
      "Ahora no, ¿no ve que tengo que vigilar a estas hermosas gurisas que me tienen chapita?",
    questions: [
      "¿Usted me está escuchando?",
      "Mi sospechoso quizás alquilo una sombrilla acá, ¿No recuerda a alguien así?",
      "¿Al menos me podría decir adónde cree que pudo ir?",
    ],
    answers: [
      "Uhh mira como está esa gurisa... ehh, ¿dijiste algo chango?",
      "Mmm… Che, vi a un karai gordito, muy narigon, iba en zunga… ¡Ñandejára! Mis ojos ya están pidiendo una buena lavada con lavandina, mba’e.",
      "Ndaikuaái che, pero a un par de cuadras nomás hay un boliche bastante bueno. Hay unas minas re lindas por ahí. Si le interesa, mba’éichapa… le consigo un descuentito pa’ la entrada, ¿qué dice?",
    ],
  },

  // ── NIVEL 2 ─────────────────────────────────────────────────────────────
  // Chaco (provinceId: 4)
  {
    provinceId: 4,
    locationId: 1,
    npc: "Gaucho Chaqueño",
    portraitUrl: "/images/portraits/level2/cara_gaucho.webp",
    overlayBackgroundUrl: "/images/dialogbackground/level2/Dialogo_gaucho.webp",
    npcCompleteUrl: "/images/dialogbackground/level2/Dialogo_gaucho.webp",
    infoBackground:
      "El Parque Nacional El Impenetrable resguarda la mayor biodiversidad del monte chaqueño, tierra agreste de quebrachales y fauna autóctona protegida.",
    introText:
      "Buenas tardes forastero. Por estos montes cerrados la huella se borra rápido, pero el ojo gaucho nunca olvida.",
    questions: [
      "¿Vio pasar a alguien sospechoso por esta zona?",
      "¿Notó alguna pista en el camino?",
      "¿Hacia qué dirección iba?",
    ],
    answers: [
      "Vi a un tipo apurado esquivando las espinas del monte.",
      "Dejó caer un papel doblado cerca del sendero principal.",
      "Agarró para el lado de las aguadas antes del anochecer.",
    ],
  },
  {
    provinceId: 4,
    locationId: 2,
    npc: "Niña de Campo",
    portraitUrl: "/images/portraits/level2/cara_nena_chaco.webp",
    overlayBackgroundUrl: "/images/dialogbackground/level2/Dialogo_nena_indigente.webp",
    npcCompleteUrl: "/images/dialogbackground/level2/Dialogo_nena_indigente.webp",
    infoBackground:
      "Campo del Cielo es una región de valor cósmico y arqueológico donde impactó una lluvia meteórica hace miles de años, rodeada de leyendas locales.",
    introText:
      "Hola señor detective... acá vienen muchos curiosos a mirar las piedras del cielo, pero hubo uno muy raro hoy.",
    questions: [
      "¿Qué tenía de raro esa persona?",
      "¿Llevaba algo en las manos?",
      "¿Preguntó por alguien?",
    ],
    answers: [
      "Miraba para todos lados como esperando que nadie lo viera.",
      "Tenía un bolso oscuro bien apretado contra el pecho.",
      "Preguntó cómo cruzar rápido hacia la frontera.",
    ],
  },
  {
    provinceId: 4,
    locationId: 3,
    npc: "Poblador Isleño",
    portraitUrl: "/images/portraits/level2/cara_mapuche.webp",
    overlayBackgroundUrl: "/images/dialogbackground/level2/Dialogo_mapuche.webp",
    npcCompleteUrl: "/images/dialogbackground/level2/Dialogo_mapuche.webp",
    infoBackground:
      "La Isla del Cerrito se alza en la confluencia de los ríos Paraná y Paraguay, un enclave estratégico de frondosa naturaleza e historia.",
    introText:
      "El río hoy está tranquilo, pero las aguas traen novedades extrañas. ¿Qué busca por estas orillas?",
    questions: [
      "¿Vio embarcaciones salir con prisa?",
      "¿Reconoció a algún foráneo?",
      "¿Escuchó alguna conversación sospechosa?",
    ],
    answers: [
      "Una lancha a motor partió apenas aclaró el día.",
      "Subió un hombre con abrigo pesado que no es de por aquí.",
      "Mencionó que debía hacer escala en Corrientes cuanto antes.",
    ],
  },

  // Corrientes (provinceId: 5)
  {
    provinceId: 5,
    locationId: 1,
    npc: "Grafitero Urbano",
    portraitUrl: "/images/portraits/level2/cara_grafitero.webp",
    overlayBackgroundUrl: "/images/dialogbackground/level2/Dialogo_grafitero.webp",
    npcCompleteUrl: "/images/dialogbackground/level2/Dialogo_grafitero.webp",
    infoBackground:
      "El Paseo de los Murales en Corrientes expone una impresionante galería a cielo abierto de arte público que relata la historia y raíces guaraníes.",
    introText:
      "¡Ey! Pintando acá en el muro vi de todo. Si andás buscando data fresca, estás en el lugar correcto.",
    questions: [
      "¿Viste a alguien sospechoso merodeando?",
      "¿Qué vestimenta llevaba?",
      "¿Tomó algún transporte?",
    ],
    answers: [
      "Sí, pasó un tipo nervioso mirando su reloj cada dos segundos.",
      "Llevaba una campera oscura y una gorra tapándole media cara.",
      "Se subió a un taxi apurado en la esquina.",
    ],
  },
  {
    provinceId: 5,
    locationId: 2,
    npc: "Boletera del Teatro",
    portraitUrl: "/images/portraits/level2/Cara_ticketera1.webp",
    overlayBackgroundUrl: "/images/dialogbackground/level2/Dialogo_ticketera.webp",
    npcCompleteUrl: "/images/dialogbackground/level2/Dialogo_ticketera.webp",
    infoBackground:
      "El Teatro Oficial Juan de Vera es el templo lírico y cultural de Corrientes, reconocido por su majestuosa acústica y cúpula corrediza.",
    introText:
      "Buenas tardes. La función comienza más tarde, pero si investiga el incidente, puedo darle algunos detalles.",
    questions: [
      "¿Compró alguna entrada el sospechoso?",
      "¿Dejó algún objeto olvidado?",
      "¿Habló con alguien en la boletería?",
    ],
    answers: [
      "Pidió información pero no compró boleto, parecía querer ocultarse.",
      "Consultó horarios para viajar hacia el sur del país.",
      "Estaba hablando por teléfono con tono bastante tenso.",
    ],
  },
  {
    provinceId: 5,
    locationId: 3,
    npc: "Guía de Fauna",
    portraitUrl: "/images/portraits/level2/cara_carpincho.webp",
    overlayBackgroundUrl: "/images/dialogbackground/level2/Dialogo_carpincho.webp",
    npcCompleteUrl: "/images/dialogbackground/level2/Dialogo_carpincho.webp",
    infoBackground:
      "El Parque Nacional Mburucuyá protege esteros, cañadas y sabanas con una riquísima fauna nativa de carpinchos, ciervos y aves acuáticas.",
    introText:
      "¡Bienvenidos al parque! Cuiden a los carpinchos. Aunque hoy uno de los visitantes causó bastante alboroto...",
    questions: [
      "¿Qué alboroto causó ese visitante?",
      "¿Hacia qué sendero se dirigió?",
      "¿Logró ver alguna identificación?",
    ],
    answers: [
      "Salió corriendo espantando a las aves en la laguna.",
      "Tomó el sendero que lleva a la salida sur del parque.",
      "Se le cayó una tarjeta con destino a la Patagonia.",
    ],
  },

  // Tierra del Fuego (provinceId: 6)
  {
    provinceId: 6,
    locationId: 1,
    npc: "Ex-Recluso Guía",
    portraitUrl: "/images/portraits/level2/cara_preso.webp",
    overlayBackgroundUrl: "/images/dialogbackground/level2/Dialogo_preso.webp",
    npcCompleteUrl: "/images/dialogbackground/level2/Dialogo_preso.webp",
    infoBackground:
      "El histórico Presidio de Ushuaia funcionó en el confín del mundo albergando a célebres presidiarios, y hoy es museo y memoria austral.",
    introText:
      "En estos pabellones fríos los ecos no mienten. ¿Qué delito lo trae a la ciudad más austral del planeta?",
    questions: [
      "¿Alguien intentó esconderse en el presidio?",
      "¿Notó alguna conducta sospechosa?",
      "¿Hacia dónde cree que huyó?",
    ],
    answers: [
      "Alguien anduvo merodeando las celdas antiguas fuera del horario de visita.",
      "Tenía marcas de frío y un apuro tremendo por no ser visto.",
      "Preguntaba con insistencia sobre las salidas del tren austral.",
    ],
  },
  {
    provinceId: 6,
    locationId: 2,
    npc: "Maquinista del Tren",
    portraitUrl: "/images/portraits/level2/cara_conductora_tren.webp",
    overlayBackgroundUrl: "/images/dialogbackground/level2/Dialogo_maquinista.webp",
    npcCompleteUrl: "/images/dialogbackground/level2/Dialogo_maquinista.webp",
    infoBackground:
      "El Tren del Fin del Mundo revive la histórica travesía de los reclusos hacia los bosques del Parque Nacional Tierra del Fuego.",
    introText:
      "¡Atención pasajeros! El tren está listo para partir hacia las laderas del Monte Susana. ¿Usted viene por el pasajero de última hora?",
    questions: [
      "¿Quién abordó a última hora?",
      "¿Dónde descendió del tren?",
      "¿Llevaba equipaje consigo?",
    ],
    answers: [
      "Un hombre agitado que compró boleto justo antes de que sonara el silbato.",
      "Se bajó en la parada intermedia antes del final del recorrido.",
      "Cargaba un maletín pesado que no soltó en ningún momento.",
    ],
  },
  {
    provinceId: 6,
    locationId: 3,
    npc: "Bióloga en Pingüinera",
    portraitUrl: "/images/portraits/level2/cara_pinguino.webp",
    overlayBackgroundUrl: "/images/dialogbackground/level2/Dialogo_disfraz_pinguino.webp",
    npcCompleteUrl: "/images/dialogbackground/level2/Dialogo_disfraz_pinguino.webp",
    infoBackground:
      "La Isla Martillo en las aguas del Canal Beagle es el hábitat natural donde anidan colonias de pingüinos de Magallanes y Papúa.",
    introText:
      "Por favor no perturben a los pingüinos... ya tuvimos suficiente con un intruso que cruzó la zona restringida.",
    questions: [
      "¿Qué hacía el intruso en la isla?",
      "¿Logró encontrar la evidencia?",
      "¿Cómo escapó de la zona?",
    ],
    answers: [
      "Intentaba ocultar algo cerca de las piedras de la orilla.",
      "Dejó un rastro inconfundible antes de abordar una lancha rápida.",
      "Navegó con rumbo este adentrándose en el Canal Beagle.",
    ],
  },
];
