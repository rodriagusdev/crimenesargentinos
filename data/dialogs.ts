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
    intro: [
      {
        speaker: "player",
        text: "Disculpe, ¿vio pasar a un sospechoso con estas características?",
      },
      {
        speaker: "narrator",
        text: "Abrís el expediente con las características.",
      },
      {
        speaker: "npc",
        text: "¡Uhh, jefe, llegás justito! Recién se me acaba de pasar por al lado un tipo corriendo...",
      },
    ],
    questions: [
      {
        id: "ba_kiosco_q1",
        text: "¿Qué tenía puesto?",
        answer: "Puaaa, un traje sastrero muy clásico, muy pituco andaba el gil. Bolso de viaje y todo.",
      },
      {
        id: "ba_kiosco_q2",
        text: "¿Estaba comiendo algo?",
        answer: "Sehh, ese gordo panza andaba con una empanada en la mano, que hombre feliz se veía ese hdp.",
      },
      {
        id: "ba_kiosco_q3",
        text: "¿Iba solo o acompañado?",
        answer: "Iba solo creo, pero no estoy seguro.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "¡Hola, paisano! ¿Qué andá buscando por estos pagos? Si es por los muchachos que pasaron corriendo, usté dirá, que yo vi todito desde mi puesto.",
      },
    ],
    questions: [
      {
        id: "ba_mercado_q1",
        text: "¿Pudo ver cómo era?",
        answer: "Pucha, joven... ahí sí que me falló la vista, la verdad que no sabría decirle bien cómo era.",
      },
      {
        id: "ba_mercado_q2",
        text: "¿Algo que lo destacaba?",
        answer: "Sí, padrecito, una cosa que se notaba al toque es que era bien bajito, y andaba con un apuro... como si lo fuera persiguiendo el diablo.",
      },
      {
        id: "ba_mercado_q3",
        text: "¿Sabe hacia dónde se fue?",
        answer: "No sabría decirle con certeza, che... con tanta balumba de gente que pasa por aquí, se me perdió de vista al ratico.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "Buen día, ¿en qué lo puedo ayudar, señor?",
      },
      {
        speaker: "player",
        text: "Si oficial, estoy en búsqueda de un sospechoso con las siguientes características.",
      },
      {
        speaker: "narrator",
        text: "Le mostrás un poco del expediente al oficial.",
      },
    ],
    questions: [
      {
        id: "ba_ezeiza_q1",
        text: "¿Sabe qué vuelo tomó?",
        answer: "Me mataste. Pero, ahora que lo decís, creo que lo vi hablar con otra persona, recuerdo que mencionó algo de tomarse un buen fernandito",
      },
      {
        id: "ba_ezeiza_q2",
        text: "¿Tenía algo encima?",
        answer: "No que yo haya visto.",
      },
      {
        id: "ba_ezeiza_q3",
        text: "¿Llevaba algo que llame la atención?",
        answer: "Un bolso negro y una valija.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "Qué paso compa, se le cayó la facha me parece, ¿me compraría unas medias? 3 pares por 10 mil pesitos, un ofertón.",
      },
      {
        speaker: "player",
        text: "Disculpe, pero ahora mismo estoy en busca de un sospechoso con estas características.",
      },
    ],
    questions: [
      {
        id: "cba_plaza_q1",
        text: "¿Sabe si pasó una persona que cumpla con estas características?",
        answer: "Si amigo, tenía la camisa toda manchada de grasa, alto asado se comió de seguro. Le quise vender y me re descansó, me dijo que tenia un puestito pedorro y que no se qué, al final me dijo que si me daba para un viaje a las cataratas de no se donde me compraba.",
        unlocksFlag: "KNOWS_GREASY_SHIRT",
      },
      {
        id: "cba_plaza_q2",
        text: "¿En que se movilizaba?",
        answer: "En silla de ruedas debería ir, pero nah.",
      },
      {
        id: "cba_plaza_q3",
        text: "¿Llevaba algo en especial?",
        answer: "Además de que casi se le revienta el lompa y se le salían los terribles rollos, también se le salian los fajos de dólares a ese gato. Creo que vi hasta una zunga... medias no compra pero zungas si, que loco che.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "Buenos días señor, ¿tiene reserva?",
      },
      {
        speaker: "player",
        text: "Disculpe pero no. Estoy en búsqueda de un sospechoso con estas características.",
      },
      {
        speaker: "narrator",
        text: "Le mostrás las características del sospechoso.",
      },
    ],
    questions: [
      {
        id: "cba_guemes_q1",
        text: "¿Pudo notar si llevaba algo con él?",
        answer: "Mmm, recuerdo a alguien así. Si, creo que tenía una especie de guardia de seguridad, le vivía secando la nuca todo el tiempo el pobre. Hablaban de la Plaza San Martin.",
      },
      {
        id: "cba_guemes_q2",
        text: "¿Algo que pueda destacar de él?",
        answer: "Si, ni un peso de propina dejó el rata hdp, debería haberle escupido el fernandito que se pidió, encima casi se olvida su valija aca, vaya uno a saber que tendrá ahí.",
      },
      {
        id: "cba_guemes_q3",
        text: "¿Sabe qué comió?",
        answer: "La pregunta sería, ¿qué no comió? Mamita, parecía Kirby, todo de una se lo morfo, era una aspiradora sin tope. Y ni un peso de propina.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "¿Hola hermano mío, viene a recibir las bendiciones matutinas?",
      },
      {
        speaker: "player",
        text: "Buen día Padre. Ahora mismo no, estoy en búsqueda de alguien que reúne estas características.",
      },
      {
        speaker: "narrator",
        text: "Le mostrás al cura las características.",
      },
    ],
    questions: [
      {
        id: "cba_manzana_q1",
        text: "¿Usted vió a mi sospechoso?",
        answer: "Ay siii, como para no notarlo, esos pequeños ojos marrones café, me encandilaron como el cántico de un ángel.",
        unlocksFlag: "CURA_MENTIONED_EYES",
      },
      {
        id: "cba_manzana_q2",
        text: "¿En qué vehículo se movilizaba?",
        answer: "Uffa, no pude notarlo, ese enanito tan lindo, su belleza es como ver las montañas de las sierras por las mañanas, o poder presenciar la divinidad de un querubín en el.",
        unlocksFlag: "CURA_MENTIONED_BEAUTY",
      },
      {
        id: "cba_manzana_q3",
        text: "¿Pudo entablar una conversación con el sospechoso?",
        answer: "Si, hablamos del mundial y su adoración hacia la copa del mundo y cómo le encantaría llevarsela a su casa para tenerla en su cama y dormir con ella.",
      },
      {
        id: "cba_manzana_q4",
        text: "Usted es un pervertido de novela. Lo voy a tener anotado.",
        answer: "¡Por favor hijo! La apreciación de la creación divina no es pecado...",
        requiredFlag: ["CURA_MENTIONED_EYES", "CURA_MENTIONED_BEAUTY"],
      },
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
    intro: [
      {
        speaker: "npc",
        text: "¿Eh ura, venís a comprar algunas florcitas para su Kuñataĩ? Yo le puedo dar un buen precio, no se preocupe.",
      },
      {
        speaker: "player",
        text: "Buen día, ahora mismo no, estoy en búsqueda de alguien que reúne estas características.",
      },
      {
        speaker: "narrator",
        text: "Le mostrás las características al jardinero.",
      },
    ],
    questions: [
      {
        id: "mis_jardin_q1",
        text: "¿Te acordás de una persona parecida?",
        answer: "Que pregunta de mierda chango, la cantidad de turistas que hay por aca, ¿te pensas que me voy a acordar?",
      },
      {
        id: "mis_jardin_q2",
        text: "¿Viste en que se movilizaba?",
        answer: "Cada croto me encuentro por aca gurisa, ya si me pongo a mirar el auto...",
      },
      {
        id: "mis_jardin_q3_conditional",
        text: "¿El sujeto en cuestión estaba de traje y con una camisa grasienta?",
        answer: "¿Estás hablando de mi suegra acaso? Si la quiere arrestar no me quejo, me haría un gran favor. Había un narigón medio mugroso si mal no recuerdo, pero no se quedó mucho. Estaba como para ir a la playa",
        requiredFlag: "KNOWS_GREASY_SHIRT",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "¿No me distraiga ura, no ve que estoy pescando?",
      },
    ],
    questions: [
      {
        id: "mis_costanera_q1",
        text: "¿Estoy buscando a un sospechoso, sabe hacia dónde pudo ir?",
        answer: "Justo ahora me venis a joder, la marea esta en su mejor punto, puedo sentir como se acercan los pescados, no me venga a romper las pelotas.",
      },
      {
        id: "mis_costanera_q2",
        text: "Necesito saber si tiene alguna característica del sospechoso.",
        answer: "Ni idea chango, mis ojos solo están enfocados en capturar a un gran Surubi del Paraná, llego a tenerlo en mis manos y no sabes lo que voy a festejar jajaja.",
      },
      {
        id: "mis_costanera_q3",
        text: "¿Sabe si lo pudo ver tomando fernet o donde lo consiguió?",
        answer: "Nahhh, que fernet? Aca se toma terere chango, no me interesan las bebidas de los porteños.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "Ahora no, ¿no ve que tengo que vigilar a estas hermosas gurisas que me tienen chapita?",
      },
      {
        speaker: "narrator",
        text: "Abrís de todas formas el expediente.",
      },
      {
        speaker: "player",
        text: "Así se ve mi sospechoso.",
      },
    ],
    questions: [
      {
        id: "mis_playa_q1",
        text: "¿Usted vió a alguien que cumpla con estas características?",
        answer: "Uhh mira como está esa gurisa... ehh, ¿dijiste algo chango?",
        unlocksFlag: "WANNA_INSULT",
      },
      {
        id: "mis_playa_q2",
        text: "Mi sospechoso quizás alquilo una sombrilla acá, ¿No recuerda a alguien así?",
        answer: "Mmm… Che, vi a un karai gordito, muy narigon, iba en zunga… ¡Ñandejára! Mis ojos ya están pidiendo una buena lavada con lavandina, mba’e.",
      },
      {
        id: "mis_playa_q3",
        text: "¿Al menos me podría decir adónde cree que pudo ir?",
        answer: "Ndaikuaái che, pero a un par de cuadras nomás hay un boliche bastante bueno. Hay unas minas re lindas por ahí. Si le interesa, mba’éichapa… le consigo un descuentito pa’ la entrada, ¿qué dice?",
        unlocksFlag: "WANNA_INSULT_2",
      },
      {
        id: "mis_playa_q4",
        text: "Algún día podrías ejercer de salvavidas y no de pervertido, payaso.",
        answer: "Mba'eve! No me jodas chango, vos seguí por tu camino.",
        requiredFlag: ["WANNA_INSULT", "WANNA_INSULT_2"],
      },
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
    intro: [
      {
        speaker: "npc",
        text: "Buenas tardes forastero. Por estos montes cerrados la huella se borra rápido, pero el ojo gaucho nunca olvida.",
      },
    ],
    questions: [
      {
        id: "chaco_parque_q1",
        text: "¿Vio pasar a alguien sospechoso por esta zona?",
        answer: "Vi a un tipo apurado esquivando las espinas del monte.",
      },
      {
        id: "chaco_parque_q2",
        text: "¿Notó alguna pista en el camino?",
        answer: "Dejó caer un papel doblado cerca del sendero principal.",
      },
      {
        id: "chaco_parque_q3",
        text: "¿Hacia qué dirección iba?",
        answer: "Agarró para el lado de las aguadas antes del anochecer.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "Hola señor detective... acá vienen muchos curiosos a mirar las piedras del cielo, pero hubo uno muy raro hoy.",
      },
    ],
    questions: [
      {
        id: "chaco_campo_q1",
        text: "¿Qué tenía de raro esa persona?",
        answer: "Miraba para todos lados como esperando que nadie lo viera.",
      },
      {
        id: "chaco_campo_q2",
        text: "¿Llevaba algo en las manos?",
        answer: "Tenía un bolso oscuro bien apretado contra el pecho.",
      },
      {
        id: "chaco_campo_q3",
        text: "¿Preguntó por alguien?",
        answer: "Preguntó cómo cruzar rápido hacia la frontera.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "El río hoy está tranquilo, pero las aguas traen novedades extrañas. ¿Qué busca por estas orillas?",
      },
    ],
    questions: [
      {
        id: "chaco_isla_q1",
        text: "¿Vio embarcaciones salir con prisa?",
        answer: "Una lancha a motor partió apenas aclaró el día.",
      },
      {
        id: "chaco_isla_q2",
        text: "¿Reconoció a algún foráneo?",
        answer: "Subió un hombre con abrigo pesado que no es de por aquí.",
      },
      {
        id: "chaco_isla_q3",
        text: "¿Escuchó alguna conversación sospechosa?",
        answer: "Mencionó que debía hacer escala en Corrientes cuanto antes.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "¡Ey! Pintando acá en el muro vi de todo. Si andás buscando data fresca, estás en el lugar correcto.",
      },
    ],
    questions: [
      {
        id: "corr_murales_q1",
        text: "¿Viste a alguien sospechoso merodeando?",
        answer: "Sí, pasó un tipo nervioso mirando su reloj cada dos segundos.",
      },
      {
        id: "corr_murales_q2",
        text: "¿Qué vestimenta llevaba?",
        answer: "Llevaba una campera oscura y una gorra tapándole media cara.",
      },
      {
        id: "corr_murales_q3",
        text: "¿Tomó algún transporte?",
        answer: "Se subió a un taxi apurado en la esquina.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "Buenas tardes. La función comienza más tarde, pero si investiga el incidente, puedo darle algunos detalles.",
      },
    ],
    questions: [
      {
        id: "corr_teatro_q1",
        text: "¿Compró alguna entrada el sospechoso?",
        answer: "Pidió información pero no compró boleto, parecía querer ocultarse.",
      },
      {
        id: "corr_teatro_q2",
        text: "¿Dejó algún objeto olvidado?",
        answer: "Consultó horarios para viajar hacia el sur del país.",
      },
      {
        id: "corr_teatro_q3",
        text: "¿Habló con alguien en la boletería?",
        answer: "Estaba hablando por teléfono con tono bastante tenso.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "¡Bienvenidos al parque! Cuiden a los carpinchos. Aunque hoy uno de los visitantes causó bastante alboroto...",
      },
    ],
    questions: [
      {
        id: "corr_parque_q1",
        text: "¿Qué alboroto causó ese visitante?",
        answer: "Salió corriendo espantando a las aves en la laguna.",
      },
      {
        id: "corr_parque_q2",
        text: "¿Hacia qué sendero se dirigió?",
        answer: "Tomó el sendero que lleva a la salida sur del parque.",
      },
      {
        id: "corr_parque_q3",
        text: "¿Logró ver alguna identificación?",
        answer: "Se le cayó una tarjeta con destino a la Patagonia.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "En estos pabellones fríos los ecos no mienten. ¿Qué delito lo trae a la ciudad más austral del planeta?",
      },
    ],
    questions: [
      {
        id: "tdf_presidio_q1",
        text: "¿Alguien intentó esconderse en el presidio?",
        answer: "Alguien anduvo merodeando las celdas antiguas fuera del horario de visita.",
      },
      {
        id: "tdf_presidio_q2",
        text: "¿Notó alguna conducta sospechosa?",
        answer: "Tenía marcas de frío y un apuro tremendo por no ser visto.",
      },
      {
        id: "tdf_presidio_q3",
        text: "¿Hacia dónde cree que huyó?",
        answer: "Preguntaba con insistencia sobre las salidas del tren austral.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "¡Atención pasajeros! El tren está listo para partir hacia las laderas del Monte Susana. ¿Usted viene por el pasajero de última hora?",
      },
    ],
    questions: [
      {
        id: "tdf_tren_q1",
        text: "¿Quién abordó a última hora?",
        answer: "Un hombre agitado que compró boleto justo antes de que sonara el silbato.",
      },
      {
        id: "tdf_tren_q2",
        text: "¿Dónde descendió del tren?",
        answer: "Se bajó en la parada intermedia antes del final del recorrido.",
      },
      {
        id: "tdf_tren_q3",
        text: "¿Llevaba equipaje consigo?",
        answer: "Cargaba un maletín pesado que no soltó en ningún momento.",
      },
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
    intro: [
      {
        speaker: "npc",
        text: "Por favor no perturben a los pingüinos... ya tuvimos suficiente con un intruso que cruzó la zona restringida.",
      },
    ],
    questions: [
      {
        id: "tdf_pinguinos_q1",
        text: "¿Qué hacía el intruso en la isla?",
        answer: "Intentaba ocultar algo cerca de las piedras de la orilla.",
      },
      {
        id: "tdf_pinguinos_q2",
        text: "¿Logró encontrar la evidencia?",
        answer: "Dejó un rastro inconfundible antes de abordar una lancha rápida.",
      },
      {
        id: "tdf_pinguinos_q3",
        text: "¿Cómo escapó de la zona?",
        answer: "Navegó con rumbo este adentrándose en el Canal Beagle.",
      },
    ],
  },
];
