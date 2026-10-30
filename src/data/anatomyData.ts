import { AnatomyLayer, QuizQuestion } from '../types/anatomy';

export const ANATOMY_LAYERS: AnatomyLayer[] = [
  {
    id: 1,
    slug: 'piel',
    name: 'Cuerpo Completo (Piel y Exterior)',
    shortTitle: 'Piel y Exterior',
    systemName: 'Sistema Tegumentario',
    color: '#F59E0B',
    accentColor: '#D97706',
    iconName: 'User',
    description: 'La piel es el órgano más grande de nuestro cuerpo. Nos protege del frío, del calor y de las bacterias.',
    organs: [
      {
        id: 'piel_cabeza',
        name: 'Cabeza y Rostro',
        system: 'Piel y Exterior',
        shortDesc: 'Contiene los ojos, la nariz, la boca y las orejas para percibir todo a nuestro alrededor.',
        funFact: 'La piel de los párpados es la más delgada de todo nuestro cuerpo (menos de 1 mm).',
        calloutPos: { x: 250, y: 110 },
        calloutSide: 'right',
        badgeColor: 'bg-amber-100 text-amber-800'
      },
      {
        id: 'piel_torso',
        name: 'Tórax y Abdomen',
        system: 'Piel y Exterior',
        shortDesc: 'La pared exterior que resguarda el pecho y la barriga, con el ombligo en el centro.',
        funFact: 'El ombligo es la primera cicatriz que tenemos al nacer cuando nos separan del cordón umbilical.',
        calloutPos: { x: 250, y: 340 },
        calloutSide: 'left',
        badgeColor: 'bg-amber-100 text-amber-800'
      },
      {
        id: 'piel_brazos',
        name: 'Brazos y Manos',
        system: 'Piel y Exterior',
        shortDesc: 'En posición anatómica, las palmas de las manos miran hacia adelante y los pulgares hacia afuera.',
        funFact: 'Las huellas de la punta de tus dedos son 100% únicas en el mundo.',
        calloutPos: { x: 130, y: 440 },
        calloutSide: 'left',
        badgeColor: 'bg-amber-100 text-amber-800'
      },
      {
        id: 'piel_piernas',
        name: 'Piernas y Pies',
        system: 'Piel y Exterior',
        shortDesc: 'Extremidades fuertes cubiertas de piel elástica que nos permiten correr, saltar y bailar.',
        funFact: 'La piel de la planta de los pies es la más gruesa para aguantar nuestro peso al caminar.',
        calloutPos: { x: 290, y: 650 },
        calloutSide: 'right',
        badgeColor: 'bg-amber-100 text-amber-800'
      }
    ]
  },
  {
    id: 2,
    slug: 'muscular',
    name: 'Sistema Muscular',
    shortTitle: 'Músculos',
    systemName: 'Sistema Muscular',
    color: '#EF4444',
    accentColor: '#DC2626',
    iconName: 'Flame',
    description: 'Tenemos más de 600 músculos. Trabajan como cuerdas elásticas que tiran de los huesos para que podamos movernos.',
    organs: [
      {
        id: 'musculo_pectoral',
        name: 'Músculos Pectorales',
        system: 'Sistema Muscular',
        shortDesc: 'Músculos anchos en el pecho que te permiten abrazar y empujar objetos.',
        funFact: 'Cuando nadas al estilo crol o pecho, tus pectorales hacen un gran esfuerzo.',
        calloutPos: { x: 220, y: 270 },
        calloutSide: 'left',
        badgeColor: 'bg-red-100 text-red-800'
      },
      {
        id: 'musculo_deltoides',
        name: 'Deltoides (Hombros)',
        system: 'Sistema Muscular',
        shortDesc: 'Músculo triangular en el hombro que te permite levantar los brazos hacia los lados.',
        funFact: 'Tiene forma de la letra griega delta (un triángulo) y es muy fuerte.',
        calloutPos: { x: 165, y: 240 },
        calloutSide: 'left',
        badgeColor: 'bg-red-100 text-red-800'
      },
      {
        id: 'musculo_biceps',
        name: 'Bíceps Braquial',
        system: 'Sistema Muscular',
        shortDesc: 'Músculo en la parte frontal del brazo que dobla el codo como una bisagra.',
        funFact: 'Al flexionarlo para hacer fuerza, se infla como una pequeña montañita.',
        calloutPos: { x: 155, y: 350 },
        calloutSide: 'left',
        badgeColor: 'bg-red-100 text-red-800'
      },
      {
        id: 'musculo_abdominales',
        name: 'Recto Abdominal',
        system: 'Sistema Muscular',
        shortDesc: 'Músculos del vientre que protegen los órganos internos y nos ayudan a mantenernos erguidos.',
        funFact: 'Muchos lo llaman la "tableta de chocolate" por su forma cuadriculada.',
        calloutPos: { x: 250, y: 380 },
        calloutSide: 'right',
        badgeColor: 'bg-red-100 text-red-800'
      },
      {
        id: 'musculo_cuadriceps',
        name: 'Cuádriceps Femoral',
        system: 'Sistema Muscular',
        shortDesc: 'El grupo muscular más potente del muslo; estira la rodilla al patear un balón.',
        funFact: 'Se llama cuádriceps porque está formado por cuatro músculos unidos en uno.',
        calloutPos: { x: 220, y: 600 },
        calloutSide: 'left',
        badgeColor: 'bg-red-100 text-red-800'
      },
      {
        id: 'musculo_gemelos',
        name: 'Gemelos (Gastrocnemios)',
        system: 'Sistema Muscular',
        shortDesc: 'Músculos de la pantorrilla que te impulsan a ponerte de puntitas y saltar alto.',
        funFact: 'Se conectan al talón por el tendón de Aquiles, el tendón más grueso de todo el cuerpo.',
        calloutPos: { x: 285, y: 760 },
        calloutSide: 'right',
        badgeColor: 'bg-red-100 text-red-800'
      }
    ]
  },
  {
    id: 3,
    slug: 'respiratorio',
    name: 'Aparato Respiratorio',
    shortTitle: 'Respiratorio',
    systemName: 'Aparato Respiratorio',
    color: '#0EA5E9',
    accentColor: '#0284C7',
    iconName: 'Wind',
    description: 'Lleva el oxígeno del aire a la sangre y expulsa el dióxido de carbono que nuestro cuerpo ya no necesita.',
    organs: [
      {
        id: 'resp_nariz_traquea',
        name: 'Tráquea y Laringe',
        system: 'Aparato Respiratorio',
        shortDesc: 'Tubo con anillos elásticos que lleva el aire desde la garganta hasta el pecho.',
        funFact: 'En la laringe están las cuerdas vocales, que vibran con el aire para producir tu voz.',
        calloutPos: { x: 250, y: 195 },
        calloutSide: 'right',
        badgeColor: 'bg-sky-100 text-sky-800'
      },
      {
        id: 'resp_pulmon_izquierdo',
        name: 'Pulmón Izquierdo',
        system: 'Aparato Respiratorio',
        shortDesc: 'Pulmón esponjoso con dos lóbulos; deja un pequeño hueco donde descansa el corazón.',
        funFact: 'Es un poco más pequeño que el derecho para que el corazón quepa cómodamente.',
        calloutPos: { x: 290, y: 280 },
        calloutSide: 'right',
        badgeColor: 'bg-sky-100 text-sky-800'
      },
      {
        id: 'resp_pulmon_derecho',
        name: 'Pulmón Derecho',
        system: 'Aparato Respiratorio',
        shortDesc: 'Pulmón grande dividido en tres partes (lóbulos); absorbe el aire fresco.',
        funFact: 'Si estiraras todas las bolsitas de aire (alvéolos), ¡cubrirían una cancha de tenis!',
        calloutPos: { x: 210, y: 280 },
        calloutSide: 'left',
        badgeColor: 'bg-sky-100 text-sky-800'
      },
      {
        id: 'resp_bronquios',
        name: 'Árbol Bronquial',
        system: 'Aparato Respiratorio',
        shortDesc: 'Red de tubitos que se ramifican como las ramas de un árbol dentro de los pulmones.',
        funFact: 'Se llaman así porque literalmente parecen ramas de un árbol al revés.',
        calloutPos: { x: 250, y: 250 },
        calloutSide: 'left',
        badgeColor: 'bg-sky-100 text-sky-800'
      },
      {
        id: 'resp_diafragma',
        name: 'Músculo Diafragma',
        system: 'Aparato Respiratorio',
        shortDesc: 'Músculo en forma de paracaídas que baja al inhalar y sube al exhalar.',
        funFact: 'Cuando el diafragma se irrita y da pequeños saltitos involuntarios, ¡nos da hipo!',
        calloutPos: { x: 250, y: 335 },
        calloutSide: 'right',
        badgeColor: 'bg-sky-100 text-sky-800'
      }
    ]
  },
  {
    id: 4,
    slug: 'circulatorio',
    name: 'Sistema Circulatorio',
    shortTitle: 'Circulatorio',
    systemName: 'Sistema Circulatorio',
    color: '#E11D48',
    accentColor: '#BE123C',
    iconName: 'Heart',
    description: 'Autopista de la vida: transporta sangre con nutrientes y oxígeno a cada rincón del cuerpo mediante venas y arterias.',
    organs: [
      {
        id: 'circ_corazon',
        name: 'El Corazón',
        system: 'Sistema Circulatorio',
        shortDesc: 'Bomba muscular incansable del tamaño de tu puño que late unas 100,000 veces al día.',
        funFact: 'Late unas 100,000 veces cada día sin descansar un solo segundo.',
        calloutPos: { x: 260, y: 275 },
        calloutSide: 'right',
        badgeColor: 'bg-rose-100 text-rose-800'
      },
      {
        id: 'circ_aorta',
        name: 'Arteria Aorta (Rojo)',
        system: 'Sistema Circulatorio',
        shortDesc: 'La arteria más grande del cuerpo; sale del corazón llevando sangre rica en oxígeno.',
        funFact: 'En un adulto, la arteria aorta tiene casi el mismo grosor que una manguera de jardín.',
        calloutPos: { x: 245, y: 240 },
        calloutSide: 'left',
        badgeColor: 'bg-rose-100 text-rose-800'
      },
      {
        id: 'circ_venas',
        name: 'Venas Cavas (Azul)',
        system: 'Sistema Circulatorio',
        shortDesc: 'Grandes vasos que recogen la sangre de vuelta hacia el corazón para que se oxigene de nuevo.',
        funFact: 'En los libros de ciencias se pintan de azul para distinguirlas de las arterias rojas.',
        calloutPos: { x: 235, y: 265 },
        calloutSide: 'left',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      {
        id: 'circ_vasos_brazos',
        name: 'Vasos de los Brazos',
        system: 'Sistema Circulatorio',
        shortDesc: 'Arterias y venas braquiales que llevan sangre hasta la punta de los dedos.',
        funFact: 'En tu muñeca puedes sentir el pulso de la arteria radial con dos deditos.',
        calloutPos: { x: 150, y: 380 },
        calloutSide: 'left',
        badgeColor: 'bg-rose-100 text-rose-800'
      },
      {
        id: 'circ_vasos_piernas',
        name: 'Vasos Femorales',
        system: 'Sistema Circulatorio',
        shortDesc: 'Arterias y venas que recorren las piernas para alimentar los músculos al correr.',
        funFact: 'La sangre tarda menos de 1 minuto en viajar del corazón a los pies y volver.',
        calloutPos: { x: 265, y: 640 },
        calloutSide: 'right',
        badgeColor: 'bg-rose-100 text-rose-800'
      }
    ]
  },
  {
    id: 5,
    slug: 'digestivo',
    name: 'Aparato Digestivo',
    shortTitle: 'Digestivo',
    systemName: 'Aparato Digestivo',
    color: '#D97706',
    accentColor: '#B45309',
    iconName: 'Apple',
    description: 'Transforma la comida que desayunas, comes y cenas en nutrientes y energía para crecer fuertes y sanos.',
    organs: [
      {
        id: 'dig_esofago',
        name: 'Esófago',
        system: 'Aparato Digestivo',
        shortDesc: 'Tubo muscular que empuja el bolo alimenticio desde la boca hasta el estómago.',
        funFact: 'Sus músculos empujan la comida tan bien que podrías tragar incluso boca abajo.',
        calloutPos: { x: 250, y: 210 },
        calloutSide: 'right',
        badgeColor: 'bg-amber-100 text-amber-800'
      },
      {
        id: 'dig_estomago',
        name: 'Estómago',
        system: 'Aparato Digestivo',
        shortDesc: 'Bolsa elástica en forma de "J" con jugos digestivos que deshacen los alimentos.',
        funFact: 'Tiene una capa protectora especial para que sus propios ácidos no lo lastimen.',
        calloutPos: { x: 275, y: 325 },
        calloutSide: 'right',
        badgeColor: 'bg-amber-100 text-amber-800'
      },
      {
        id: 'dig_higado',
        name: 'Hígado',
        system: 'Aparato Digestivo',
        shortDesc: 'Gran laboratorio del cuerpo que limpia toxinas, almacena vitaminas y produce bilis.',
        funFact: 'Es el órgano interno más pesado del cuerpo humano (pesa alrededor de 1.5 kg).',
        calloutPos: { x: 220, y: 320 },
        calloutSide: 'left',
        badgeColor: 'bg-amber-100 text-amber-800'
      },
      {
        id: 'dig_pancreas',
        name: 'Páncreas',
        system: 'Aparato Digestivo',
        shortDesc: 'Glándula oculta tras el estómago que fabrica insulina para controlar el azúcar en sangre.',
        funFact: 'Produce encimas esenciales para digerir grasas y proteínas.',
        calloutPos: { x: 260, y: 350 },
        calloutSide: 'right',
        badgeColor: 'bg-amber-100 text-amber-800'
      },
      {
        id: 'dig_intestino_delgado',
        name: 'Intestino Delgado',
        system: 'Aparato Digestivo',
        shortDesc: 'Tubo largo enrollado en el centro del vientre donde se absorben la mayoría de nutrientes.',
        funFact: '¡Mide unos 6 a 7 metros de largo! Es más largo que un automóvil grande.',
        calloutPos: { x: 250, y: 405 },
        calloutSide: 'left',
        badgeColor: 'bg-amber-100 text-amber-800'
      },
      {
        id: 'dig_intestino_grueso',
        name: 'Intestino Grueso (Colon)',
        system: 'Aparato Digestivo',
        shortDesc: 'Marco exterior que absorbe agua y prepara los desechos que el cuerpo expulsa.',
        funFact: 'En él viven millones de bacterias buenas que forman nuestra microbiota protectora.',
        calloutPos: { x: 290, y: 400 },
        calloutSide: 'right',
        badgeColor: 'bg-amber-100 text-amber-800'
      }
    ]
  },
  {
    id: 6,
    slug: 'nervioso',
    name: 'Sistema Nervioso',
    shortTitle: 'Nervioso',
    systemName: 'Sistema Nervioso',
    color: '#8B5CF6',
    accentColor: '#7C3AED',
    iconName: 'Zap',
    description: 'La supercomputadora del cuerpo: procesa lo que sientes, piensas, recuerdas y envía órdenes ultrarrápidas a los músculos.',
    organs: [
      {
        id: 'nerv_cerebro',
        name: 'Cerebro (Encéfalo)',
        system: 'Sistema Nervioso',
        shortDesc: 'Centro de control donde imaginas, aprendes matemáticas, recuerdas historias y sientes emociones.',
        funFact: 'Tiene cerca de 86,000 millones de neuronas que se comunican con electricidad.',
        calloutPos: { x: 250, y: 100 },
        calloutSide: 'right',
        badgeColor: 'bg-purple-100 text-purple-800'
      },
      {
        id: 'nerv_cerebelo',
        name: 'Cerebelo',
        system: 'Sistema Nervioso',
        shortDesc: 'Ubicado en la parte posterior del cráneo; coordina tu equilibrio para no caerte de la bicicleta.',
        funFact: 'Su nombre en latín significa "pequeño cerebro", pero contiene la mitad de las neuronas.',
        calloutPos: { x: 250, y: 140 },
        calloutSide: 'left',
        badgeColor: 'bg-purple-100 text-purple-800'
      },
      {
        id: 'nerv_medula_espinal',
        name: 'Médula Espinal',
        system: 'Sistema Nervioso',
        shortDesc: 'Cable principal protegido dentro de la columna vertebral que conecta el cerebro con el cuerpo.',
        funFact: 'Los mensajes viajan por ella a más de 400 kilómetros por hora.',
        calloutPos: { x: 250, y: 290 },
        calloutSide: 'left',
        badgeColor: 'bg-purple-100 text-purple-800'
      },
      {
        id: 'nerv_nervios_brazos',
        name: 'Nervios Periféricos (Brazos)',
        system: 'Sistema Nervioso',
        shortDesc: 'Finos hilos que te permiten sentir si algo está frío, caliente, suave o rasposo.',
        funFact: 'Cuando te golpeas el codo y sientes un corrientazo, ¡es el nervio cubital quejándose!',
        calloutPos: { x: 155, y: 400 },
        calloutSide: 'left',
        badgeColor: 'bg-purple-100 text-purple-800'
      },
      {
        id: 'nerv_nervio_ciatico',
        name: 'Nervio Ciático y de Piernas',
        system: 'Sistema Nervioso',
        shortDesc: 'El nervio más largo y ancho del cuerpo humano; baja desde la espalda hasta los dedos del pie.',
        funFact: 'Puede ser tan grueso como tu dedo pulgar.',
        calloutPos: { x: 275, y: 650 },
        calloutSide: 'right',
        badgeColor: 'bg-purple-100 text-purple-800'
      }
    ]
  },
  {
    id: 7,
    slug: 'reproductor',
    name: 'Sistema Reproductor',
    shortTitle: 'Reproductor',
    systemName: 'Sistema Reproductor',
    color: '#EC4899',
    accentColor: '#DB2777',
    iconName: 'Sparkles',
    description: 'Sistema biológico encargado de la continuidad de la vida y el desarrollo del cuerpo humano según el sexo biológico.',
    organs: [
      {
        id: 'rep_organo_principal',
        name: 'Órganos Reproductores',
        system: 'Sistema Reproductor',
        shortDesc: 'Estructuras biológicas naturales adaptadas para la reproducción humana y la producción de hormonas.',
        funFact: 'Durante la pubertad, las hormonas de este sistema hacen que crezcamos y cambiemos de voz.',
        calloutPos: { x: 250, y: 495 },
        calloutSide: 'right',
        badgeColor: 'bg-pink-100 text-pink-800'
      },
      {
        id: 'rep_vejiga',
        name: 'Vejiga Urinaria',
        system: 'Sistema Excretor / Pélvico',
        shortDesc: 'Bolsa muscular en la pelvis que almacena la orina filtrada por los riñones antes de ir al baño.',
        funFact: 'Se puede expandir como un globito cuando se llena de líquido.',
        calloutPos: { x: 250, y: 465 },
        calloutSide: 'left',
        badgeColor: 'bg-pink-100 text-pink-800'
      },
      {
        id: 'rep_glandulas',
        name: 'Glándulas y Conductos',
        system: 'Sistema Reproductor',
        shortDesc: 'Vías y glándulas protectoras esenciales para el funcionamiento saludable del aparato reproductor.',
        funFact: 'El sistema reproductor trabaja en equipo con el sistema hormonal (endocrino).',
        calloutPos: { x: 250, y: 520 },
        calloutSide: 'left',
        badgeColor: 'bg-pink-100 text-pink-800'
      }
    ]
  },
  {
    id: 8,
    slug: 'oseo',
    name: 'Sistema Óseo (Esqueleto)',
    shortTitle: 'Huesos',
    systemName: 'Sistema Óseo',
    color: '#64748B',
    accentColor: '#475569',
    iconName: 'Shield',
    description: 'El armazón resistente de 206 huesos que sostiene todo nuestro cuerpo, protege los órganos y nos da forma.',
    organs: [
      {
        id: 'oseo_craneo',
        name: 'Cráneo',
        system: 'Sistema Óseo',
        shortDesc: 'Casco óseo natural muy fuerte que protege el cerebro de cualquier golpe.',
        funFact: 'Al nacer tenemos placas separadas en el cráneo que luego se unen formando una sola pieza sólida.',
        calloutPos: { x: 250, y: 105 },
        calloutSide: 'right',
        badgeColor: 'bg-slate-100 text-slate-800'
      },
      {
        id: 'oseo_costillas',
        name: 'Costillas y Esternón',
        system: 'Sistema Óseo',
        shortDesc: 'Caja protectora con 12 pares de costillas que resguardan el corazón y los pulmones.',
        funFact: 'Se mueven hacia arriba y afuera cada vez que respiras profundo.',
        calloutPos: { x: 220, y: 280 },
        calloutSide: 'left',
        badgeColor: 'bg-slate-100 text-slate-800'
      },
      {
        id: 'oseo_columna',
        name: 'Columna Vertebral',
        system: 'Sistema Óseo',
        shortDesc: 'Cadena de 33 huesos pequeños llamados vértebras que te permite doblarte y girar.',
        funFact: 'Tiene forma de ligera "S" para amortiguar los saltos al caminar y correr.',
        calloutPos: { x: 250, y: 350 },
        calloutSide: 'right',
        badgeColor: 'bg-slate-100 text-slate-800'
      },
      {
        id: 'oseo_pelvis',
        name: 'Pelvis (Cadera)',
        system: 'Sistema Óseo',
        shortDesc: 'Cintura ósea con forma de cuenco que une la columna con las piernas.',
        funFact: 'Sostiene el peso de la parte superior del cuerpo y protege los órganos inferiores.',
        calloutPos: { x: 250, y: 475 },
        calloutSide: 'left',
        badgeColor: 'bg-slate-100 text-slate-800'
      },
      {
        id: 'oseo_humero',
        name: 'Húmero y Brazos',
        system: 'Sistema Óseo',
        shortDesc: 'Hueso largo del brazo que va desde el hombro hasta el codo, seguido de cúbito y radio.',
        funFact: 'En el codo no tenemos casi amortiguación, por eso golpearse ahí se siente curioso.',
        calloutPos: { x: 155, y: 320 },
        calloutSide: 'left',
        badgeColor: 'bg-slate-100 text-slate-800'
      },
      {
        id: 'oseo_femur',
        name: 'Fémur (Muslo)',
        system: 'Sistema Óseo',
        shortDesc: 'El hueso más largo, pesado y fuerte de todo el cuerpo humano.',
        funFact: '¡Es más resistente que el concreto y aguanta hasta 30 veces nuestro peso corporal!',
        calloutPos: { x: 220, y: 580 },
        calloutSide: 'left',
        badgeColor: 'bg-slate-100 text-slate-800'
      },
      {
        id: 'oseo_tibia',
        name: 'Tibia y Peroné',
        system: 'Sistema Óseo',
        shortDesc: 'Los dos huesos de la pantorrilla; la tibia soporta casi todo el peso al caminar.',
        funFact: 'La rótula o patela es un huesito redondo que protege la rodilla por delante.',
        calloutPos: { x: 280, y: 760 },
        calloutSide: 'right',
        badgeColor: 'bg-slate-100 text-slate-800'
      }
    ]
  }
];

export const POSITIVE_PRAISES = [
  '¡Excelente trabajo!',
  '¡Genial, lo encontraste a la perfección!',
  '¡Brillante! Tienes ojo de científico.',
  '¡Muy bien! Estás aprendiendo un montón.',
  '¡Exacto! Esa es la respuesta correcta.',
  '¡Fantástico! Tu cuerpo es asombroso.'
];

export const GENTLE_ENCOURAGEMENTS = [
  '¡Casi! Inténtalo de nuevo, tú puedes.',
  '¡Sigue buscando, estás muy cerca!',
  '¡No te preocupes! Observa bien la silueta.',
  '¡Buen intento! Mira la pista con atención.',
  '¡Ánimo! Explora la zona indicada.',
  '¡Estuviste a un pasito! Vuelve a probar.'
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    targetId: 'circ_corazon',
    targetName: 'El Corazón',
    systemName: 'Sistema Circulatorio',
    layerId: 4,
    hint: 'Busca la bomba muscular roja en el centro del pecho que late día y noche.',
    educationalFact: 'Late unas 100,000 veces al día bombeando sangre con oxígeno.'
  },
  {
    targetId: 'nerv_cerebro',
    targetName: 'Cerebro (Encéfalo)',
    systemName: 'Sistema Nervioso',
    layerId: 6,
    hint: 'Está protegido dentro de la cabeza y piensa todas tus ideas.',
    educationalFact: 'Tiene 86,000 millones de neuronas que envían impulsos eléctricos.'
  },
  {
    targetId: 'oseo_femur',
    targetName: 'Fémur (Hueso del Muslo)',
    systemName: 'Sistema Óseo',
    layerId: 8,
    hint: 'Es el hueso más largo y fuerte de todo el cuerpo, en el muslo.',
    educationalFact: 'Es más resistente que el concreto y soporta tu peso al correr.'
  },
  {
    targetId: 'resp_pulmon_derecho',
    targetName: 'Pulmón Derecho',
    systemName: 'Aparato Respiratorio',
    layerId: 3,
    hint: 'Está en el lado derecho del pecho y se llena de aire fresco al inhalar.',
    educationalFact: 'Tiene 3 lóbulos y es un poquito más grande que el izquierdo.'
  },
  {
    targetId: 'dig_estomago',
    targetName: 'Estómago',
    systemName: 'Aparato Digestivo',
    layerId: 5,
    hint: 'Es una bolsa con forma de "J" bajo el pecho que digiere tus alimentos.',
    educationalFact: 'Sus ácidos descomponen la comida en pedacitos microscópicos.'
  },
  {
    targetId: 'musculo_biceps',
    targetName: 'Bíceps Braquial',
    systemName: 'Sistema Muscular',
    layerId: 2,
    hint: 'Está en el frente del brazo y se infla cuando doblas el codo con fuerza.',
    educationalFact: 'Trabaja en equipo con el tríceps para flexionar y estirar el brazo.'
  },
  {
    targetId: 'oseo_craneo',
    targetName: 'Cráneo',
    systemName: 'Sistema Óseo',
    layerId: 8,
    hint: 'Es el casco óseo en la cabeza que protege tu valioso cerebro.',
    educationalFact: 'Está compuesto por 22 huesos soldados firmemente entre sí.'
  },
  {
    targetId: 'resp_diafragma',
    targetName: 'Diafragma',
    systemName: 'Aparato Respiratorio',
    layerId: 3,
    hint: 'Es el músculo en forma de cúpula debajo de los pulmones.',
    educationalFact: 'Cuando se irrita y da pequeños saltos nos produce hipo.'
  },
  {
    targetId: 'dig_higado',
    targetName: 'Hígado',
    systemName: 'Aparato Digestivo',
    layerId: 5,
    hint: 'Es el órgano grande y rojizo al lado derecho del abdomen.',
    educationalFact: 'Es el laboratorio del cuerpo y ayuda a limpiar sustancias y procesar nutrientes.'
  },
  {
    targetId: 'nerv_medula_espinal',
    targetName: 'Médula Espinal',
    systemName: 'Sistema Nervioso',
    layerId: 6,
    hint: 'Es el cordón nervioso que baja por el centro de la espalda dentro de la columna.',
    educationalFact: 'Transmite órdenes del cerebro a los brazos y piernas a 400 km/h.'
  },
  {
    targetId: 'musculo_cuadriceps',
    targetName: 'Cuádriceps',
    systemName: 'Sistema Muscular',
    layerId: 2,
    hint: 'Músculo grande y potente en la parte frontal del muslo.',
    educationalFact: 'Tiene 4 partes y te da la fuerza para patear una pelota de fútbol.'
  },
  {
    targetId: 'oseo_costillas',
    targetName: 'Costillas y Esternón',
    systemName: 'Sistema Óseo',
    layerId: 8,
    hint: 'La caja de huesos curvados en el pecho que protege el corazón.',
    educationalFact: 'Son 12 pares de costillas flexibles que se mueven al respirar.'
  }
];
