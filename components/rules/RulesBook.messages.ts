import { defineMessages } from "@/lib/i18n/messages";

/**
 * Textos del manual de reglas. Marcas dentro de los textos (las interpreta <Rich>):
 *   **texto** → negrita · ++texto++ → verde (victoria) · !!texto!! → rojo (derrota)
 */
export const rulesBookMessages = defineMessages({
  es: {
    // Encabezado, pie y navegación
    gameTitle: "CRÍMENES ARGENTINOS",
    manualSubtitle: "MANUAL DE PROCEDIMIENTO POLICIAL",
    closeTitle: "Cerrar Manual (Esc)",
    close: "CERRAR",
    authorityLabel: "Autoridad: ",
    authority: "Policía Federal Argentina",
    sectionLabel: "Sección: ",
    jurisdictionLabel: "Jurisdicción: ",
    jurisdiction: "Territorio Nacional",
    pageOf: "Folio {n} de {total}",
    prev: "← ANTERIOR",
    next: "SIGUIENTE →",
    start: "COMENZAR",
    startSuffix: " INVESTIGACIÓN",
    sealTop: "POLICÍA FEDERAL",
    sealBottom: "OFICIAL",
    spine: "PFA • MANUAL",

    // 01 · El objetivo
    objetivoTab: "El Objetivo",
    objetivoTitle: "EL OBJETIVO DE LA MISIÓN",
    objetivoIntro:
      "Un sospechoso de alta peligrosidad se ha dado a la fuga por territorio argentino. Tu labor como detective es reconstruir su itinerario de escape antes de que el caso prescriba.",
    objetivoCard1Title: "Informe de Guardia",
    objetivoCard1Body:
      "Cada caso se inicia con un **informe de guardia** que contiene los primeros indicios sobre la última locación registrada y la contextura del prófugo.",
    objetivoCard2Title: "Viajes e Interrogatorios",
    objetivoCard2Body:
      "Deberás **viajar entre provincias**, interrogar testigos clave y acumular pruebas materiales y testimoniales.",
    objetivoCard3Title: "Detención Final",
    objetivoCard3Body:
      "El operativo concluye con éxito al dar con el **escondite del criminal** habiendo emitido la **orden de arresto correspondiente**.",
    objetivoCalloutLabel: "ADVERTENCIA DE PROCEDIMIENTO",
    objetivoCallout:
      "Presentarse en el escondite sin orden judicial o con una orden emitida contra un inocente provocará la fuga inmediata del criminal y el fracaso definitivo del caso.",
    objetivoPhoto1Caption: "SUJETO PRÓFUGO",
    objetivoPhoto1Sub: "Última foto registrada",
    objetivoPhoto1Stamp: "BUSCADO",
    objetivoPhoto2Caption: "RUTA INTERPROVINCIAL",
    objetivoPhoto2Sub: "Itinerario de fuga",

    // 02 · Niveles y casos
    nivelesTab: "Niveles y Casos",
    nivelesTitle: "SISTEMA DE NIVELES Y ROTACIÓN",
    ruleNum: "REGLA {n}",
    nivelesCard1Title: "Dificultad Escalonada",
    nivelesCard1Body:
      "Comenzás en el **Nivel 1**. Cada nivel resuelto de forma exitosa desbloquea el acceso al siguiente escalafón de casos.",
    nivelesCard2Title: "Sorteo Aleatorio",
    nivelesCard2Body:
      "Al iniciar una partida, el sistema sortea al azar un caso que aún no hayas ganado en ese nivel de dificultad.",
    nivelesCard3Title: "Reintentos Variados",
    nivelesCard3Body:
      "Si sufrís una derrota, el próximo intento te asignará un caso diferente del mismo nivel para mantener la investigación inédita. Los casos resueltos no vuelven a aparecer en la misma vuelta.",
    nivelesCard4Title: "Vuelta Completa",
    nivelesCard4Body:
      "Al conquistar la totalidad de los niveles, se abre una vuelta maestra con todos los casos nuevamente en sorteo.",
    nivelesCalloutLabel: "DOCUMENTACIÓN DE CASOS",
    nivelesCallout:
      "Cada expediente cuenta con testigos, rutas geográficas, diálogos y pistas exclusivas ambientadas en distintos puntos de la República Argentina.",
    nivelesPhotoCaption: "CASO ASIGNADO",
    nivelesPhotoSub: "Rotación de expediente",
    nivelesPhotoStamp: "EXPEDIENTE",

    // 03 · Tiempo y recursos
    recursosTab: "Tiempo y Recursos",
    recursosTitle: "TIEMPO Y PUNTOS DE INVESTIGACIÓN",
    timeEyebrow: "RECURSO OPERATIVO",
    timeTitle: "Horas de Tiempo",
    timeBody: "Cada desplazamiento e interrogatorio descuenta horas del reloj.",
    piEyebrow: "PUNTAJE DE ACCIÓN",
    piTitle: "Puntos de Investigación (PI)",
    piBody: "Recursos para viajar e indagar. ¡Preguntas con pista nueva dan +5 PI!",
    recursosHeadAction: "Acción en el Terreno",
    recursosHeadCost: "Consumo de Recursos",
    costProvince: "Viajar a otra provincia",
    costProvinceValue: "Consumo alto de Tiempo y PI",
    costLocation: "Desplazarse a locación interna",
    costLocationValue: "Consumo moderado de Tiempo y PI",
    costWitness: "Interrogar a un testigo por 1ra vez",
    costWitnessValue: "1 hora de tiempo y costo en PI",
    costNewClue: "Pregunta que arroja una **pista nueva**",
    costNewClueValue: "Consume tiempo, pero ++¡recompensa con +5 PI!++",
    costRepeat: "Repetir pregunta ya consultada",
    costStay: "Permanecer en provincia o punto actual",
    costFree: "Sin costo (0 h / 0 PI)",
    recursosCalloutLabel: "CONDICIÓN DE FRACASO",
    recursosCallout:
      "Si el marcador de tiempo llega a !!0 horas!! o tu partida agota los !!0 PI!!, el operativo se suspende automáticamente por falta de recursos y se declara la derrota.",

    // 04 · Testigos y pistas
    pistasTab: "Testigos y Pistas",
    pistasTitle: "TESTIGOS, INTERROGATORIOS Y PISTAS",
    pistasCard1Title: "Testigos en cada locación",
    pistasCard1Body:
      "En cada punto de interés provincial hallarás lugareños que aportarán información testimonial sobre el fugitivo.",
    pistasCard2Title: "Cuaderno de Pistas",
    pistasCard2Body:
      "Toda evidencia aportada por testigos o recibida en el informe inicial se archiva de manera automática en el panel de Pistas.",
    pistasCard3Title: "Preguntas Desbloqueables",
    pistasCard3Body:
      "Ciertas pistas obtenidas en una región permiten formular preguntas específicas e inéditas ante testigos de otras provincias.",
    pistasCard4Title: "Historial de Declaraciones",
    pistasCard4Body:
      "Cada diálogo concluido queda asentado en actas y puede volver a leerse cuantas veces sea necesario sin costo operativo.",
    pistasCalloutLabel: "RECOMENDACIÓN TÁCTICA",
    pistasCallout:
      "Prestá atención a los detalles físicos: contextura corporal, estatura, rasgos faciales, vestimenta y particularidades de conducta del sospechoso.",
    pistasPhotoCaption: "TESTIGO PROVINCIAL",
    pistasPhotoSub: "Declaración testimonial",

    // 05 · Orden de arresto
    arrestoTab: "Orden de Arresto",
    arrestoTitle: "LA ORDEN DE ARRESTO",
    arrestoIntro: "Para proceder a la detención legal se exige sustento probatorio fehaciente ante la fiscalía:",
    articleNum: "ART. {n}",
    arrestoCard1Title: "Requisito Indispensable",
    arrestoCard1Body:
      "Se requiere un mínimo de **3 pistas obtenidas mediante interrogatorios** a testigos (las pistas del informe de guardia no computan para el aval judicial).",
    arrestoCard2Title: "Determinación",
    arrestoCard2Body: "Seleccioná al individuo de la nómina que coincida con la **totalidad de los indicios reunidos**.",
    arrestoCard3Title: "Carácter Irrevocable",
    arrestoCard3Body:
      "Una vez librada la orden judicial, **no puede ser anulada ni reemplazada** por otra durante el transcurso del caso.",
    arrestoCalloutLabel: "PRECAUCIÓN JUDICIAL",
    arrestoCallout:
      "Cotejá detenidamente la ficha técnica de cada sospechoso antes de estampar la firma. Una orden mal dirigida conducirá a la fuga del verdadero culpable.",
    arrestoPhotoCaption: "ORDEN JUDICIAL",
    arrestoPhotoSub: "Firma fehaciente",
    arrestoPhotoStamp: "ORDEN DE ARRESTO",

    // 06 · El escondite
    esconditeTab: "El Escondite",
    esconditeTitle: "EL ESCONDITE Y DESENLACE",
    esconditeIntro:
      "El delincuente se encuentra agazapado en el punto final de su ruta. Al arribar a dicha locación, el caso se resolverá de acuerdo a tu estado procesal:",
    esconditeHeadSituation: "Situación Procesal al Arribar",
    esconditeHeadOutcome: "Resolución Oficial",
    outcomeGuilty: "Con orden emitida contra el culpable",
    outcomeGuiltyValue: "Victoria: Se concreta la captura formal",
    outcomeInnocent: "Con orden librada contra otro sospechoso",
    outcomeInnocentValue: "Derrota: Se detiene a un inocente y el prófugo huye",
    outcomeNoWarrantFew: "Sin orden emitida y con menos de 3 pistas",
    outcomeNoWarrantFewValue: "Derrota: Falta de mérito probatorio, el prófugo escapa",
    outcomeNoWarrantEnough: "Sin orden emitida pero con 3 o más pistas",
    outcomeNoWarrantEnoughValue: "Última oportunidad: Deberás librar la orden en el acto",
    esconditeCalloutLabel: "COSTO DE TRASLADO FINAL",
    esconditeCallout:
      "El desplazamiento hasta el escondite descuenta tiempo y PI. Arribar con el reloj en cero frustrará la detención antes de poder actuar.",

    // 07 · Tu progreso
    progresoTab: "Tu Progreso",
    progresoTitle: "REGISTRO, GUARDADO Y RANKING",
    progresoCard1Num: "REGISTRO",
    progresoCard1Title: "Sincronización",
    progresoCard1Body:
      "Cada desplazamiento, pista y declaración se guarda automáticamente. Podés interrumpir la sesión y reanudarla con tu expediente intacto.",
    progresoCard2Num: "INTENTOS",
    progresoCard2Title: "Sin Penalización",
    progresoCard2Body:
      "En caso de no superar un caso, podés reiniciar de inmediato con un nuevo caso asignado a tu nivel de dificultad.",
    progresoCard3Num: "ESCALAFÓN",
    progresoCard3Title: "Ranking Oficial",
    progresoCard3Body:
      "Competí por el puntaje acumulado en el ranking. A igualdad de puntos, se premia al agente que resolvió los casos en menor número de partidas.",
    dispatchTitle: "EXPEDIENTE LISTO PARA COMENZAR",
    dispatchInGame: "Volvé a la central y elegí tu próximo caso.",
    dispatchGuest: "Iniciá sesión o registrá tu credencial de detective para asumir tu primer caso.",
    dispatchInGameButton: "VOLVER A LOS CASOS →",
    dispatchGuestButton: "INGRESAR AL ACCESO →",
  },
  en: {
    // Header, footer and navigation
    gameTitle: "CRÍMENES ARGENTINOS",
    manualSubtitle: "POLICE PROCEDURE MANUAL",
    closeTitle: "Close Manual (Esc)",
    close: "CLOSE",
    authorityLabel: "Authority: ",
    authority: "Argentine Federal Police",
    sectionLabel: "Section: ",
    jurisdictionLabel: "Jurisdiction: ",
    jurisdiction: "National Territory",
    pageOf: "Page {n} of {total}",
    prev: "← PREVIOUS",
    next: "NEXT →",
    start: "START",
    startSuffix: " INVESTIGATION",
    sealTop: "FEDERAL POLICE",
    sealBottom: "OFFICIAL",
    spine: "PFA • MANUAL",

    // 01 · The objective
    objetivoTab: "The Objective",
    objetivoTitle: "THE MISSION OBJECTIVE",
    objetivoIntro:
      "A highly dangerous suspect is on the run across Argentina. Your job as a detective is to reconstruct their escape route before the case goes cold.",
    objetivoCard1Title: "Duty Report",
    objetivoCard1Body:
      "Every case opens with a **duty report** holding the first leads on the fugitive's last known location and build.",
    objetivoCard2Title: "Travel and Interrogations",
    objetivoCard2Body:
      "You'll have to **travel between provinces**, question key witnesses and gather physical and testimonial evidence.",
    objetivoCard3Title: "Final Arrest",
    objetivoCard3Body:
      "The operation succeeds when you track down the **criminal's hideout** after issuing the **right arrest warrant**.",
    objetivoCalloutLabel: "PROCEDURE WARNING",
    objetivoCallout:
      "Showing up at the hideout without a warrant, or with a warrant against an innocent person, lets the criminal escape at once and the case is lost for good.",
    objetivoPhoto1Caption: "FUGITIVE SUBJECT",
    objetivoPhoto1Sub: "Last photo on file",
    objetivoPhoto1Stamp: "WANTED",
    objetivoPhoto2Caption: "INTERPROVINCIAL ROUTE",
    objetivoPhoto2Sub: "Escape route",

    // 02 · Levels and cases
    nivelesTab: "Levels and Cases",
    nivelesTitle: "LEVEL SYSTEM AND ROTATION",
    ruleNum: "RULE {n}",
    nivelesCard1Title: "Stepped Difficulty",
    nivelesCard1Body: "You start at **Level 1**. Every level you solve unlocks the next tier of cases.",
    nivelesCard2Title: "Random Draw",
    nivelesCard2Body: "When you start a game, the system randomly draws a case you haven't won yet at that difficulty level.",
    nivelesCard3Title: "Varied Retries",
    nivelesCard3Body:
      "If you lose, your next attempt assigns you a different case from the same level so the investigation stays fresh. Solved cases don't come back in the same round.",
    nivelesCard4Title: "Full Round",
    nivelesCard4Body: "Once you've conquered every level, a master round opens with all cases back in the draw.",
    nivelesCalloutLabel: "CASE FILES",
    nivelesCallout:
      "Every file has its own witnesses, routes, dialogue and clues, set in different corners of the Argentine Republic.",
    nivelesPhotoCaption: "ASSIGNED CASE",
    nivelesPhotoSub: "File rotation",
    nivelesPhotoStamp: "CASE FILE",

    // 03 · Time and resources
    recursosTab: "Time and Resources",
    recursosTitle: "TIME AND INVESTIGATION POINTS",
    timeEyebrow: "OPERATIONAL RESOURCE",
    timeTitle: "Hours of Time",
    timeBody: "Every trip and interrogation takes hours off the clock.",
    piEyebrow: "ACTION SCORE",
    piTitle: "Investigation Points (IP)",
    piBody: "Resources to travel and investigate. Questions that reveal a new clue give +5 IP!",
    recursosHeadAction: "Field Action",
    recursosHeadCost: "Resource Cost",
    costProvince: "Travel to another province",
    costProvinceValue: "High cost in Time and IP",
    costLocation: "Move to a location in the province",
    costLocationValue: "Moderate cost in Time and IP",
    costWitness: "Question a witness for the 1st time",
    costWitnessValue: "1 hour of time plus an IP cost",
    costNewClue: "Question that reveals a **new clue**",
    costNewClueValue: "Takes time, but ++rewards you with +5 IP!++",
    costRepeat: "Repeat a question already asked",
    costStay: "Stay in the current province or spot",
    costFree: "Free (0 h / 0 IP)",
    recursosCalloutLabel: "FAILURE CONDITION",
    recursosCallout:
      "If the clock hits !!0 hours!! or your game runs down to !!0 IP!!, the operation is automatically called off for lack of resources and you lose.",

    // 04 · Witnesses and clues
    pistasTab: "Witnesses and Clues",
    pistasTitle: "WITNESSES, INTERROGATIONS AND CLUES",
    pistasCard1Title: "Witnesses at every location",
    pistasCard1Body: "At every point of interest in a province you'll find locals with testimony about the fugitive.",
    pistasCard2Title: "Clue Notebook",
    pistasCard2Body:
      "Every piece of evidence from witnesses or from the opening report is filed automatically in the Clues panel.",
    pistasCard3Title: "Unlockable Questions",
    pistasCard3Body:
      "Some clues found in one region let you ask new, specific questions to witnesses in other provinces.",
    pistasCard4Title: "Statement History",
    pistasCard4Body:
      "Every finished conversation goes on the record and can be reread as many times as you need at no cost.",
    pistasCalloutLabel: "TACTICAL TIP",
    pistasCallout:
      "Pay attention to physical details: the suspect's build, height, facial features, clothing and behavioral quirks.",
    pistasPhotoCaption: "PROVINCIAL WITNESS",
    pistasPhotoSub: "Witness statement",

    // 05 · The arrest warrant
    arrestoTab: "Arrest Warrant",
    arrestoTitle: "THE ARREST WARRANT",
    arrestoIntro: "A lawful arrest requires solid evidence before the prosecutor:",
    articleNum: "ART. {n}",
    arrestoCard1Title: "Mandatory Requirement",
    arrestoCard1Body:
      "You need at least **3 clues obtained by questioning** witnesses (clues from the duty report don't count toward the court's approval).",
    arrestoCard2Title: "Identification",
    arrestoCard2Body: "Pick the person from the list who matches **every lead you've gathered**.",
    arrestoCard3Title: "Irrevocable",
    arrestoCard3Body: "Once the warrant is issued, it **can't be canceled or replaced** for the rest of the case.",
    arrestoCalloutLabel: "JUDICIAL CAUTION",
    arrestoCallout:
      "Check each suspect's profile carefully before you sign. A misdirected warrant lets the real culprit get away.",
    arrestoPhotoCaption: "COURT ORDER",
    arrestoPhotoSub: "Signed and sealed",
    arrestoPhotoStamp: "ARREST WARRANT",

    // 06 · The hideout
    esconditeTab: "The Hideout",
    esconditeTitle: "THE HIDEOUT AND THE ENDGAME",
    esconditeIntro:
      "The criminal is holed up at the last stop of their route. When you reach that location, the case is settled based on your legal standing:",
    esconditeHeadSituation: "Legal Standing on Arrival",
    esconditeHeadOutcome: "Official Outcome",
    outcomeGuilty: "Warrant issued against the culprit",
    outcomeGuiltyValue: "Victory: The arrest is made",
    outcomeInnocent: "Warrant issued against another suspect",
    outcomeInnocentValue: "Defeat: An innocent is arrested and the fugitive flees",
    outcomeNoWarrantFew: "No warrant and fewer than 3 clues",
    outcomeNoWarrantFewValue: "Defeat: Not enough evidence, the fugitive escapes",
    outcomeNoWarrantEnough: "No warrant but 3 or more clues",
    outcomeNoWarrantEnoughValue: "Last chance: You must issue the warrant on the spot",
    esconditeCalloutLabel: "FINAL TRIP COST",
    esconditeCallout:
      "Traveling to the hideout costs time and IP. Arriving with the clock at zero blows the arrest before you can act.",

    // 07 · Your progress
    progresoTab: "Your Progress",
    progresoTitle: "RECORDS, SAVING AND RANKING",
    progresoCard1Num: "RECORD",
    progresoCard1Title: "Auto-save",
    progresoCard1Body:
      "Every trip, clue and statement is saved automatically. You can leave the session and pick it back up with your file intact.",
    progresoCard2Num: "ATTEMPTS",
    progresoCard2Title: "No Penalty",
    progresoCard2Body: "If you fail a case, you can restart right away with a new case assigned to your difficulty level.",
    progresoCard3Num: "RANKS",
    progresoCard3Title: "Official Ranking",
    progresoCard3Body:
      "Compete for total score in the ranking. On a tie, the agent who solved the cases in fewer games ranks higher.",
    dispatchTitle: "CASE FILE READY TO BEGIN",
    dispatchInGame: "Head back to HQ and pick your next case.",
    dispatchGuest: "Log in or register your detective badge to take on your first case.",
    dispatchInGameButton: "BACK TO CASES →",
    dispatchGuestButton: "GO TO LOGIN →",
  },
});

export type RulesBookMessageKey = keyof (typeof rulesBookMessages)["es"];
