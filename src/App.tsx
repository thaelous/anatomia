import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Printer,
  Download,
  X,
  Sliders,
  ChevronUp,
  ChevronDown,
  Sparkles,
  HelpCircle,
  Trophy,
  BookOpen
} from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import {
  playClickSound,
  playLayerToggleSound,
  playPinSelectSound,
  playLabelToggleSound,
  playSuccessSound,
  playGentleRetrySound,
  playCelebrationSound,
  setSoundEnabled
} from './utils/audio';

// Definición de tipos
interface OrganPin {
  name: string;
  x: number;
  y: number;
  side: 'left' | 'right';
  info: string;
}

interface AcetateSheet {
  id: number;
  numberLabel: string;
  name: string;
  short: string;
  slug: string;
  file: string;
  color: string;
  desc: string;
  emoji: string;
}

interface QuizItem {
  layerId: number;
  q: string;
  hint: string;
}

// Catálogo Maestro de Láminas
const ALL_ACETATE_SHEETS: AcetateSheet[] = [
  {
    id: 0,
    numberLabel: 'Capa Base',
    name: 'Cuerpo Humano Completo (Base)',
    short: 'Base',
    slug: 'hombre',
    file: '/hombre.jpg',
    color: '#6366F1',
    desc: 'Figura en posición anatómica estándar de frente con palmas hacia el frente.',
    emoji: '👤'
  },
  {
    id: 1,
    numberLabel: 'Capa 1',
    name: 'Sistema Muscular',
    short: 'Muscular',
    slug: 'musculo',
    file: '/musculo.jpg',
    color: '#EF4444',
    desc: 'Más de 600 músculos elásticos y tendones que generan movimiento.',
    emoji: '🦾'
  },
  {
    id: 2,
    numberLabel: 'Capa 2',
    name: 'Aparato Respiratorio',
    short: 'Respiratorio',
    slug: 'respiratorio',
    file: '/respiratorio.jpg',
    color: '#0EA5E9',
    desc: 'Tráquea anillada, bronquios y pulmones para captar oxígeno fresco.',
    emoji: '🫁'
  },
  {
    id: 3,
    numberLabel: 'Capa 3',
    name: 'Sistema Circulatorio',
    short: 'Circulatorio',
    slug: 'circulatorio',
    file: '/circulatorio.jpg',
    color: '#E11D48',
    desc: 'Corazón, arterias rojas y venas azules de distribución sanguínea.',
    emoji: '🫀'
  },
  {
    id: 4,
    numberLabel: 'Capa 4',
    name: 'Aparato Digestivo',
    short: 'Digestivo',
    slug: 'digestivo',
    file: '/digestivo.jpg',
    color: '#D97706',
    desc: 'Esófago, estómago, hígado e intestinos para absorber energía.',
    emoji: '🍽️'
  },
  {
    id: 5,
    numberLabel: 'Capa 5',
    name: 'Sistema Nervioso',
    short: 'Nervioso',
    slug: 'nervioso',
    file: '/nervioso.jpg',
    color: '#8B5CF6',
    desc: 'Cerebro, médula espinal y ramificaciones nerviosas motoras y sensoriales.',
    emoji: '🧠'
  },
  {
    id: 6,
    numberLabel: 'Capa 6',
    name: 'Sistema Reproductor',
    short: 'Reproductor',
    slug: 'reproductor',
    file: '/reproductor.jpg',
    color: '#EC4899',
    desc: 'Aparato urogenital y pélvico de continuidad de la vida y hormonas.',
    emoji: '🧬'
  },
  {
    id: 7,
    numberLabel: 'Capa 7',
    name: 'Sistema Óseo (Esqueleto)',
    short: 'Esqueleto',
    slug: 'oseo',
    file: '/oseo.jpg',
    color: '#475569',
    desc: 'Armazón rígido de 206 huesos que sostiene el cuerpo y protege órganos.',
    emoji: '🦴'
  }
];

const OVERLAY_LAYERS = ALL_ACETATE_SHEETS.filter((s) => s.id > 0);

// Base de datos de pines anatómicos interactivos
const ANATOMY_LABELS_DATA: Record<number, OrganPin[]> = {
  0: [
    { name: 'Cabeza y Semblante', x: 50, y: 8, side: 'right', info: 'Postura erguida con mirada al frente, resguardando los órganos de los sentidos.' },
    { name: 'Tórax y Tronco', x: 50, y: 28, side: 'left', info: 'Eje axial central que protege los órganos vitales torácicos y abdominales.' },
    { name: 'Palmas hacia el Frente', x: 37, y: 53, side: 'left', info: 'Posición anatómica universal: bipedestación, brazos a los lados y palmas hacia adelante.' },
    { name: 'Extremidades Inferiores', x: 47, y: 76, side: 'left', info: 'Piernas rectas ligeramente separadas preparadas para sostener el peso corporal con firmeza.' }
  ],
  1: [
    { name: 'Pectoral Mayor', x: 47.5, y: 27, side: 'left', info: 'Músculo amplio del pecho que permite abrazar, empujar y rotar los brazos hacia adentro.' },
    { name: 'Bíceps Braquial', x: 42, y: 34, side: 'left', info: 'Flexiona el codo como una bisagra y permite levantar objetos con gran fuerza.' },
    { name: 'Recto del Abdomen', x: 50, y: 38, side: 'right', info: 'Músculos abdominales que protegen las vísceras, estabilizan la columna y flexionan el tronco.' },
    { name: 'Cuádriceps', x: 46.5, y: 62, side: 'left', info: 'El grupo muscular más potente del muslo, indispensable para caminar, correr y saltar.' },
    { name: 'Gemelos (Pantorrilla)', x: 46.5, y: 81, side: 'left', info: 'Músculo gastronemio en la parte posterior de la pierna que impulsa el pie al dar cada paso.' }
  ],
  2: [
    { name: 'Cavidad Nasal / Faringe', x: 50, y: 13, side: 'right', info: 'Calienta, humedece y purifica el aire que respiramos antes de que llegue a los pulmones.' },
    { name: 'Tráquea Anillada', x: 50, y: 20, side: 'left', info: 'Tubo cartilaginoso reforzado con anillos que conduce el aire limpio hacia los bronquios.' },
    { name: 'Pulmones', x: 53, y: 27, side: 'right', info: 'Órganos esponjosos con millones de alvéolos que intercambian oxígeno vital por dióxido de carbono.' },
    { name: 'Diafragma', x: 50, y: 34, side: 'left', info: 'Músculo en forma de cúpula que desciende al inhalar permitiendo que los pulmones se expandan.' }
  ],
  3: [
    { name: 'Corazón', x: 51.5, y: 28, side: 'right', info: 'Bomba muscular incansable que late más de 100,000 veces al día impulsando la sangre a todo el organismo.' },
    { name: 'Arteria Aorta (Roja)', x: 49.5, y: 24, side: 'left', info: 'La arteria principal del cuerpo; transporta sangre recién oxigenada a alta presión desde el corazón.' },
    { name: 'Vena Cava (Azul)', x: 50.5, y: 36, side: 'right', info: 'Gran tronco venoso que recoge la sangre desoxigenada para llevarla de regreso al corazón.' },
    { name: 'Vasos Femorales', x: 48, y: 64, side: 'left', info: 'Red vital de arterias y venas de gran calibre que nutren todos los tejidos de las piernas.' }
  ],
  4: [
    { name: 'Esófago', x: 50, y: 21, side: 'left', info: 'Conducto muscular que traslada el bolo alimenticio desde la faringe hasta el estómago mediante ondas peristálticas.' },
    { name: 'Hígado', x: 48, y: 33, side: 'left', info: 'La fábrica bioquímica del cuerpo: sintetiza bilis para digerir grasas y neutraliza toxinas.' },
    { name: 'Estómago', x: 52, y: 33, side: 'right', info: 'Bolsa muscular ácida que tritura los alimentos y los descompone químicamente usando jugos gástricos.' },
    { name: 'Intestino Delgado', x: 50, y: 42, side: 'right', info: 'Tubo de casi 7 metros de longitud donde ocurre la digestión final y la absorción de nutrientes hacia la sangre.' },
    { name: 'Intestino Grueso (Colon)', x: 50, y: 48, side: 'left', info: 'Reabsorbe agua y sales minerales, compactando los residuos para su posterior evacuación.' }
  ],
  5: [
    { name: 'Cerebro / Encéfalo', x: 50, y: 9.5, side: 'right', info: 'El centro de control del cuerpo humano: procesa recuerdos, emociones, movimientos voluntarios y sensaciones.' },
    { name: 'Médula Espinal', x: 50, y: 28, side: 'left', info: 'Autopista central de señales nerviosas que conecta el cerebro con el resto de los órganos y extremidades.' },
    { name: 'Plexo Braquial (Brazos)', x: 44, y: 30, side: 'left', info: 'Red compleja de nervios que coordina la sensibilidad y la destreza motora fina de manos y dedos.' },
    { name: 'Nervio Ciático (Piernas)', x: 52, y: 63, side: 'right', info: 'El nervio individual más largo y grueso del cuerpo, indispensable para la locomoción bípeda.' }
  ],
  6: [
    { name: 'Riñones', x: 48, y: 36, side: 'left', info: 'Filtros biológicos de alta precisión que limpian toxinas de la sangre y regulan el equilibrio hídrico corporal.' },
    { name: 'Uréteres', x: 51.5, y: 41, side: 'right', info: 'Conductos finos que trasladan de forma continua la orina desde los riñones hacia la vejiga urinaria.' },
    { name: 'Aparato Reproductor / Vejiga', x: 50, y: 49, side: 'left', info: 'Órganos pélvicos responsables de la continuidad de la vida y la eliminación controlada de desechos líquidos.' }
  ],
  7: [
    { name: 'Cráneo', x: 50, y: 10, side: 'right', info: 'Cúpula ósea resistente formada por 22 huesos soldados que resguarda de impactos al cerebro.' },
    { name: 'Caja Torácica (Costillas)', x: 50, y: 28, side: 'left', info: '12 pares de costillas articuladas que protegen el corazón y los pulmones facilitando la respiración.' },
    { name: 'Columna Vertebral', x: 50, y: 36, side: 'right', info: 'Eje de 33 vértebras articuladas que permite la postura erguida, amortigua golpes y protege la médula.' },
    { name: 'Pelvis / Cadera', x: 50, y: 46, side: 'left', info: 'Cintura ósea ancha que transfiere el peso de la parte superior del cuerpo hacia los miembros inferiores.' },
    { name: 'Fémur', x: 47, y: 64, side: 'left', info: 'El hueso más largo, denso y resistente del esqueleto humano, situado en el muslo.' },
    { name: 'Tibia y Peroné', x: 47, y: 82, side: 'left', info: 'Huesos de la espinilla que articulan con la rodilla y el tobillo para proporcionar estabilidad al andar.' }
  ]
};

// Banco de retos interactivos para el Modo Quiz
const QUIZ_LIST: QuizItem[] = [
  { layerId: 3, q: '¿Qué sistema bombea sangre con el corazón por arterias y venas?', hint: 'Red de vasos sanguíneos rojos y azules con el corazón latiendo en el pecho.' },
  { layerId: 7, q: '¿Cuál es el armazón de 206 huesos que sostiene el cuerpo?', hint: 'Estructura rígida con cráneo, costillas, columna y fémur.' },
  { layerId: 2, q: '¿Qué aparato capta oxígeno fresco a través de los pulmones?', hint: 'Tráquea con anillos y dos pulmones esponjosos en el tórax.' },
  { layerId: 4, q: '¿Qué sistema procesa la comida con el estómago y el hígado?', hint: 'Transforma los alimentos en nutrientes y energía vital para las células.' },
  { layerId: 1, q: '¿Qué sistema contiene más de 600 músculos elásticos?', hint: 'Fibras musculares rojas que nos permiten movernos, sonreír y saltar.' },
  { layerId: 5, q: '¿Qué sistema actúa como supercomputadora con el cerebro?', hint: 'Envía órdenes eléctricas veloces por la médula espinal hacia todo el cuerpo.' }
];

export default function App() {
  // 1. Splash Screen con partículas de 3 segundos
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const splashCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 2. Estado de capas (Cuerpo Base activo al 100% por defecto, 1-7 inactivas)
  const [baseOpacity, setBaseOpacity] = useState(100);
  const [layerActive, setLayerActive] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  });
  const [layerOpacities, setLayerOpacities] = useState<Record<number, number>>({
    1: 70,
    2: 70,
    3: 70,
    4: 70,
    5: 70,
    6: 70,
    7: 70
  });
  const [layerStack, setLayerStack] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  // URLs con transparencia procesada vía Canvas
  const [transparentUrls, setTransparentUrls] = useState<Record<number, string>>({});

  // 3. Sistema de pines y tarjeta informativa
  const [showLabels, setShowLabels] = useState(false);
  const [activePin, setActivePin] = useState<{ layerId: number; pin: OrganPin } | null>(null);

  // 4. Modo Quiz escolar no bloqueante
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isQuizMinimized, setIsQuizMinimized] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ type: 'success' | 'retry' | 'idle'; msg: string }>({
    type: 'idle',
    msg: ''
  });

  // 5. Modales y soporte sonoro / PWA
  const [showDrawer, setShowDrawer] = useState(false);
  const [showAcetateModal, setShowAcetateModal] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [zipLoading, setZipLoading] = useState(false);
  const [zipStatusText, setZipStatusText] = useState('Descargar Paquete Completo (ZIP)');

  // Soporte PWA Android
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  // 6. Zoom y Pan estrictamente nativos (sin botones en pantalla)
  const [zoomScale, setZoomScale] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialPanX: 0, initialPanY: 0 });
  const touchStateRef = useRef<{
    initialDist: number;
    initialZoom: number;
    initialPan: { x: number; y: number };
    startMid: { x: number; y: number };
    lastTap: number;
    count: number;
  }>({
    initialDist: 0,
    initialZoom: 1.0,
    initialPan: { x: 0, y: 0 },
    startMid: { x: 0, y: 0 },
    lastTap: 0,
    count: 0
  });

  // Control sonoro
  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      playClickSound();
    }
  };

  // 1. Inicialización de la pantalla de bienvenida con partículas (3 segundos)
  useEffect(() => {
    const canvas = splashCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = [
      'rgba(99, 102, 241, 0.45)', // Índigo
      'rgba(56, 189, 248, 0.45)', // Celeste
      'rgba(245, 158, 11, 0.4)',  // Ámbar
      'rgba(16, 185, 129, 0.4)',  // Esmeralda
      'rgba(244, 63, 94, 0.35)'   // Rosa
    ];

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random() * (canvas.width || 400),
      y: Math.random() * (canvas.height || 800),
      radius: Math.random() * 4.5 + 2,
      vx: (Math.random() - 0.5) * 0.7,
      vy: -(Math.random() * 0.75 + 0.25),
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;
        const currentR = Math.max(1, p.radius + Math.sin(p.pulse) * 1.2);

        if (p.y < -15) p.y = canvas.height + 15;
        if (p.x < -15) p.x = canvas.width + 15;
        if (p.x > canvas.width + 15) p.x = -15;

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };
    render();

    // Timer de exactamente 3 segundos
    const timer = setTimeout(() => {
      setSplashFading(true);
      setTimeout(() => {
        setShowSplash(false);
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', resizeCanvas);
      }, 700);
    }, 3000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleSkipSplash = () => {
    setSplashFading(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 400);
  };

  // 2. Procesamiento de Transparencia de Láminas en Canvas
  useEffect(() => {
    OVERLAY_LAYERS.forEach((layer) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const w = 1834;
        const h = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const minX = w * 0.28;
        const maxX = w * 0.72;
        const minY = h * 0.02;
        const maxY = h * 0.98;

        for (let y = 0; y < h; y++) {
          const isOuterY = y < minY || y > maxY;
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            if (isOuterY || x < minX || x > maxX) {
              data[idx + 3] = 0;
              continue;
            }

            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            const dr = 255 - r;
            const dg = 255 - g;
            const db = 255 - b;
            const dist = Math.sqrt(dr * dr + dg * dg + db * db);

            if (dist < 24) {
              data[idx + 3] = 0;
            } else if (dist < 44) {
              const factor = (dist - 24) / 20;
              data[idx + 3] = Math.round(data[idx + 3] * factor);
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const resultUrl = canvas.toDataURL('image/png');
        setTransparentUrls((prev) => ({ ...prev, [layer.id]: resultUrl }));
      };
      img.onerror = () => {
        setTransparentUrls((prev) => ({ ...prev, [layer.id]: layer.file }));
      };
      img.src = layer.file;
    });
  }, []);

  // 3. Soporte PWA para Android
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setCanInstallPwa(false);
      setDeferredPrompt(null);
    });
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallPwa = async () => {
    playClickSound();
    if (!deferredPrompt) {
      alert('Para instalar en Android:\n1. Toca el menú (⋮) de tu navegador.\n2. Selecciona "Instalar aplicación" o "Agregar a la pantalla principal".');
      return;
    }
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setCanInstallPwa(false);
    }
    setDeferredPrompt(null);
  };

  // Zoom Helpers nativos
  const clampZoom = (z: number) => Math.min(Math.max(z, 0.75), 4.5);
  const clampPan = (px: number, py: number, currentZoom: number) => {
    const limitX = Math.max(50, (currentZoom - 0.85) * 400);
    const limitY = Math.max(50, (currentZoom - 0.85) * 550);
    return {
      x: Math.min(Math.max(px, -limitX), limitX),
      y: Math.min(Math.max(py, -limitY), limitY)
    };
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoomScale((prev) => {
      const nextZoom = clampZoom(prev + delta);
      if (nextZoom <= 1.05) {
        setPan({ x: 0, y: 0 });
      } else {
        setPan((prevPan) => clampPan(prevPan.x, prevPan.y, nextZoom));
      }
      return nextZoom;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touches = Array.from(e.touches).map((t) => ({ x: t.clientX, y: t.clientY }));
    const now = Date.now();

    if (e.touches.length === 1) {
      if (now - touchStateRef.current.lastTap < 300) {
        if (zoomScale > 1.2) {
          setZoomScale(1.0);
          setPan({ x: 0, y: 0 });
        } else {
          playClickSound();
          setZoomScale(2.2);
        }
        touchStateRef.current.lastTap = 0;
        return;
      }
      touchStateRef.current.lastTap = now;
      touchStateRef.current.initialPan = { ...pan };
      touchStateRef.current.startMid = touches[0];
      touchStateRef.current.count = 1;
    } else if (e.touches.length >= 2) {
      const dist = Math.hypot(touches[0].x - touches[1].x, touches[0].y - touches[1].y);
      touchStateRef.current.initialDist = dist || 1;
      touchStateRef.current.initialZoom = zoomScale;
      touchStateRef.current.initialPan = { ...pan };
      touchStateRef.current.startMid = {
        x: (touches[0].x + touches[1].x) / 2,
        y: (touches[0].y + touches[1].y) / 2
      };
      touchStateRef.current.count = 2;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touches = Array.from(e.touches).map((t) => ({ x: t.clientX, y: t.clientY }));
    if (e.touches.length === 2 && touchStateRef.current.count === 2) {
      e.preventDefault();
      const dist = Math.hypot(touches[0].x - touches[1].x, touches[0].y - touches[1].y);
      const factor = dist / touchStateRef.current.initialDist;
      const nextZoom = clampZoom(touchStateRef.current.initialZoom * factor);
      setZoomScale(nextZoom);

      const midX = (touches[0].x + touches[1].x) / 2;
      const midY = (touches[0].y + touches[1].y) / 2;
      const nextPanX = touchStateRef.current.initialPan.x + (midX - touchStateRef.current.startMid.x);
      const nextPanY = touchStateRef.current.initialPan.y + (midY - touchStateRef.current.startMid.y);
      setPan(clampPan(nextPanX, nextPanY, nextZoom));
    } else if (e.touches.length === 1 && touchStateRef.current.count === 1 && zoomScale > 1.05) {
      const deltaX = touches[0].x - touchStateRef.current.startMid.x;
      const deltaY = touches[0].y - touchStateRef.current.startMid.y;
      const nextPanX = touchStateRef.current.initialPan.x + deltaX;
      const nextPanY = touchStateRef.current.initialPan.y + deltaY;
      setPan(clampPan(nextPanX, nextPanY, zoomScale));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    const nextPanX = dragStartRef.current.initialPanX + deltaX;
    const nextPanY = dragStartRef.current.initialPanY + deltaY;
    setPan(clampPan(nextPanX, nextPanY, zoomScale));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Alternar capas
  const toggleLayer = (layerId: number) => {
    const willBeActive = !layerActive[layerId];
    playLayerToggleSound(layerId, willBeActive);
    setLayerActive((prev) => ({
      ...prev,
      [layerId]: willBeActive
    }));
  };

  // Alternar Pines
  const toggleLabels = () => {
    const nextState = !showLabels;
    playLabelToggleSound(nextState);
    setShowLabels(nextState);
    if (!nextState) {
      setActivePin(null);
    }
  };

  // Alternar Quiz
  const toggleQuiz = () => {
    playClickSound();
    const nextState = !isQuizActive;
    setIsQuizActive(nextState);
    setIsQuizMinimized(false);
    setQuizFeedback({ type: 'idle', msg: '' });
  };

  const handleAnswerQuiz = (chosenLayerId: number) => {
    const currentQ = QUIZ_LIST[quizIdx % QUIZ_LIST.length];
    if (chosenLayerId === currentQ.layerId) {
      playSuccessSound();
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      });
      setQuizScore((prev) => prev + 1);
      setLayerActive((prev) => ({ ...prev, [chosenLayerId]: true }));
      setQuizFeedback({
        type: 'success',
        msg: '¡Excelente! ¡Has identificado el sistema a la perfección!'
      });

      setTimeout(() => {
        setQuizIdx((prev) => prev + 1);
        setQuizFeedback({ type: 'idle', msg: '' });
      }, 1600);
    } else {
      playGentleRetrySound();
      setQuizFeedback({
        type: 'retry',
        msg: '¡Casi! Revisa las pistas o consulta las capas del cuerpo antes de responder.'
      });
    }
  };

  // Síntesis de voz en español
  const handleSpeakOrgan = (name: string, info: string) => {
    playClickSound();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${name}. ${info}`);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Impresión y descarga de acetatos
  const handlePrintSingle = (sheet: AcetateSheet) => {
    playClickSound();
    const printArea = document.getElementById('print-staging-area');
    if (!printArea) return;
    printArea.innerHTML = `
      <div class="page-break flex flex-col items-center justify-center p-4">
        <div style="text-align: center; margin-bottom: 8px;">
          <h2 style="font-size: 16px; font-weight: bold; color: #1e293b;">${sheet.name} — Lámina de Acetato</h2>
          <p style="font-size: 11px; color: #64748b;">Alinear con las 4 cruces de registro en esquinas • Margen de perforación a la izquierda</p>
        </div>
        <div style="width: 95vw; height: 85vh; display: flex; align-items: center; justify-content: center;">
          <img src="${sheet.file}" alt="${sheet.name}" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
      </div>
    `;
    window.print();
  };

  const handlePrintAllBatch = () => {
    playClickSound();
    const printArea = document.getElementById('print-staging-area');
    if (!printArea) return;
    let html = '';
    ALL_ACETATE_SHEETS.forEach((sheet) => {
      html += `
        <div class="page-break flex flex-col items-center justify-center p-4">
          <div style="text-align: center; margin-bottom: 8px;">
            <h2 style="font-size: 16px; font-weight: bold; color: #1e293b;">${sheet.numberLabel}: ${sheet.name}</h2>
            <p style="font-size: 11px; color: #64748b;">Cruces de registro en esquinas • Margen de encuadernación punteado a la izquierda</p>
          </div>
          <div style="width: 95vw; height: 85vh; display: flex; align-items: center; justify-content: center;">
            <img src="${sheet.file}" alt="${sheet.name}" style="width: 100%; height: 100%; object-fit: contain;">
          </div>
        </div>
      `;
    });
    printArea.innerHTML = html;
    window.print();
  };

  const handleDownloadAllZip = async () => {
    playClickSound();
    setZipLoading(true);
    setZipStatusText('Empacando láminas...');

    try {
      const zip = new JSZip();
      const folder = zip.folder('Acetatos_Anatomia_Aldebaran');

      for (let i = 0; i < ALL_ACETATE_SHEETS.length; i++) {
        const sheet = ALL_ACETATE_SHEETS[i];
        setZipStatusText(`Empacando ${i + 1}/${ALL_ACETATE_SHEETS.length}...`);
        const response = await fetch(sheet.file);
        const blob = await response.blob();
        folder?.file(`${sheet.id}_${sheet.slug}.jpg`, blob);
      }

      setZipStatusText('Generando ZIP...');
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipContent);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Acetatos_Clases_Anatomia_Aldebaran.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      playSuccessSound();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setZipStatusText('¡Descarga completa!');
      setTimeout(() => {
        setZipStatusText('Descargar Paquete Completo (ZIP)');
        setZipLoading(false);
      }, 2000);
    } catch (err) {
      console.warn('Fallback de descarga:', err);
      setZipStatusText('Descargar Paquete Completo (ZIP)');
      setZipLoading(false);
    }
  };

  // Reordenar capas en Z-Index
  const moveLayerUp = (indexInStack: number) => {
    if (indexInStack === 0) return;
    playClickSound();
    const newStack = [...layerStack];
    const temp = newStack[indexInStack];
    newStack[indexInStack] = newStack[indexInStack - 1];
    newStack[indexInStack - 1] = temp;
    setLayerStack(newStack);
  };

  const moveLayerDown = (indexInStack: number) => {
    if (indexInStack === layerStack.length - 1) return;
    playClickSound();
    const newStack = [...layerStack];
    const temp = newStack[indexInStack];
    newStack[indexInStack] = newStack[indexInStack + 1];
    newStack[indexInStack + 1] = temp;
    setLayerStack(newStack);
  };

  // Pines de capas activas
  const activeLayerIds = layerStack
    .slice()
    .reverse()
    .filter((id) => layerActive[id]);
  if (activeLayerIds.length === 0 && baseOpacity > 30) {
    activeLayerIds.push(0);
  }

  const currentQuizItem = QUIZ_LIST[quizIdx % QUIZ_LIST.length];

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] w-screen overflow-hidden flex flex-col justify-between bg-slate-100 text-slate-800 select-none relative font-sans">
      
      {/* ========================================================= */}
      {/* 1. PANTALLA DE BIENVENIDA (SPLASH SCREEN) FONDO BLANCO    */}
      {/* ========================================================= */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center select-none transition-opacity duration-700 ease-out ${
            splashFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={handleSkipSplash}
        >
          <canvas ref={splashCanvasRef} className="absolute inset-0 pointer-events-none w-full h-full" />

          <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-sm sm:max-w-md animate-in fade-in zoom-in-95 duration-500">
            {/* Logotipo oficial */}
            <div className="relative mb-5">
              <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500/20 via-sky-400/25 to-emerald-400/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white p-3 shadow-xl border border-slate-100 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Logo Aldebarán"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'logo.png';
                  }}
                />
              </div>
            </div>

            {/* Título Oficial Requerido */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
              Las clases de anatomía de Aldebarán
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-5 max-w-xs">
              Atlas interactivo de anatomía por capas y acetatos translúcidos
            </p>

            {/* Barra de progreso de 3 segundos exactos */}
            <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 rounded-full transition-all duration-3000 ease-linear"
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSkipSplash();
              }}
              className="mt-6 text-[11px] font-semibold text-slate-400 hover:text-indigo-600 px-3 py-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Toca para entrar ahora
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. BARRA SUPERIOR FIJA                                    */}
      {/* (TOTALMENTE LIMPIA: CERO BOTÓN DEL 70% O CONTROL REDUNDANTE) */}
      {/* ========================================================= */}
      <header className="h-12 sm:h-14 shrink-0 bg-white border-b border-slate-200 px-2 sm:px-6 flex items-center justify-between gap-1 sm:gap-2 shadow-xs z-30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src="/logo.png"
            alt="Aldebarán"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full shadow-xs shrink-0 bg-amber-50 border border-amber-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'logo.png';
            }}
          />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
              Las clases de anatomía de Aldebarán
            </h1>
            <span className="hidden md:block text-[10px] font-semibold text-emerald-600 truncate">
              Atlas de Anatomía • Control de Capas • Etiquetas Interactivas
            </span>
          </div>
        </div>

        {/* Acciones: PWA, Sonido, Pines, Quiz y Acetatos */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Botón PWA para Android */}
          {canInstallPwa && (
            <button
              type="button"
              onClick={handleInstallPwa}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Instalar aplicación en Android / Pantalla Principal"
            >
              <span>📱</span>
              <span className="hidden md:inline">Instalar App</span>
              <span className="md:hidden text-[11px]">Instalar</span>
            </button>
          )}

          {/* Botón Audio */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
            title={soundOn ? 'Silenciar sonidos' : 'Activar sonidos'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-slate-700" /> : <VolumeX className="w-4 h-4 text-red-500" />}
          </button>

          {/* Botón Pines / Etiquetas */}
          <button
            type="button"
            onClick={toggleLabels}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer ${
              showLabels
                ? 'bg-violet-600 text-white shadow-xs ring-2 ring-violet-300'
                : 'bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200'
            }`}
            title="Mostrar u ocultar nombres de órganos con pines interactivos"
          >
            <span>🏷️</span>
            <span className="hidden sm:inline">{showLabels ? 'Ocultar Etiquetas' : 'Mostrar Etiquetas'}</span>
            <span className="sm:hidden text-[11px]">{showLabels ? 'Pines ON' : 'Pines'}</span>
          </button>

          {/* Botón Quiz */}
          <button
            type="button"
            onClick={toggleQuiz}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isQuizActive
                ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
            }`}
            title="Activar reto educativo interactivo"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isQuizActive ? 'Reto Activo' : 'Quiz'}</span>
            <span className="sm:hidden text-[11px]">Quiz</span>
          </button>

          {/* Botón Impresión de Acetatos */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowAcetateModal(true);
            }}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            title="Centro de Impresión y Descarga de Acetatos"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Impresión de Acetatos</span>
            <span className="sm:hidden text-[11px]">Acetatos</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. ÁREA CENTRAL: VISOR ADAPTATIVO (CERO SCROLL)           */}
      {/* (ZOOM NATIVO: WHEEL + PINCH/PAN; CERO BOTONES DE LUPA)     */}
      {/* ========================================================= */}
      <main
        className="flex-1 min-h-0 w-full overflow-hidden p-0 m-0 bg-slate-100 flex flex-col justify-between relative"
        onWheel={handleWheel}
      >
        {/* ========================================================= */}
        {/* BANNER FLOTANTE DEL QUIZ NO BLOQUEANTE                     */}
        {/* ========================================================= */}
        {isQuizActive && (
          <div className="absolute top-2 left-2 right-2 sm:left-auto sm:right-6 sm:w-96 z-40 animate-in fade-in duration-200">
            {isQuizMinimized ? (
              <div className="bg-amber-500 text-white p-2 sm:px-4 rounded-2xl shadow-lg flex items-center justify-between gap-2 border border-amber-600">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-extrabold flex items-center gap-1 shrink-0">
                    ★ Reto {(quizIdx % QUIZ_LIST.length) + 1}:
                  </span>
                  <span className="text-xs truncate opacity-95">{currentQuizItem.q}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuizMinimized(false)}
                  className="px-2.5 py-1 bg-white text-amber-900 text-xs font-bold rounded-xl shadow-xs shrink-0 hover:bg-amber-50 cursor-pointer"
                >
                  Responder
                </button>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-xl border-2 border-amber-300 flex flex-col gap-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-amber-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                      ★
                    </span>
                    <span className="text-xs font-bold text-amber-950">
                      Reto {(quizIdx % QUIZ_LIST.length) + 1} de {QUIZ_LIST.length}
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                      {quizScore} Aciertos
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsQuizMinimized(true)}
                      className="px-2 py-0.5 rounded-lg text-amber-800 hover:bg-amber-100 font-bold text-xs cursor-pointer"
                      title="Minimizar para consultar capas del atlas"
                    >
                      _
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsQuizActive(false)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer text-xs font-bold"
                      title="Salir del Quiz"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                  {currentQuizItem.q}
                </p>

                <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  💡 <strong>Pista:</strong> {currentQuizItem.hint}
                </p>

                {/* Opciones directas */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {OVERLAY_LAYERS.map((layer) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => handleAnswerQuiz(layer.id)}
                      className="p-2 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span>{layer.emoji}</span>
                      <span className="truncate">{layer.short}</span>
                    </button>
                  ))}
                </div>

                {/* Mensaje de retroalimentación didáctica */}
                {quizFeedback.type !== 'idle' && (
                  <div
                    className={`p-2 rounded-xl text-xs font-bold ${
                      quizFeedback.type === 'success'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-sky-100 text-sky-900 border border-sky-300'
                    }`}
                  >
                    {quizFeedback.msg}
                  </div>
                )}

                {/* Botón didáctico: Consultar atlas antes de responder */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsQuizMinimized(true)}
                    className="w-full py-1.5 text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Explorar atlas y consultar capas antes de contestar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTENEDOR PRINCIPAL DEL VISOR (FLEX-1 FLUIDO, PERSONAJE COMPLETO CABEZA A PIES) */}
        <div className="flex-1 min-h-0 w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto bg-white sm:border-x border-slate-200/90 relative overflow-hidden flex items-center justify-center">
          
          {/* Viewport Interactivo (Zoom nativo con Rueda y Gesto Táctil, CERO botones de lupa) */}
          <div
            ref={viewportRef}
            className="w-full h-full relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={{ touchAction: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={() => {
              setActivePin(null);
            }}
          >
            {/* Escenario anatómico sincronizado con Pan y Zoom */}
            <div
              className="relative flex items-center justify-center transition-transform duration-100 ease-out"
              style={{
                height: '96%',
                maxHeight: '100%',
                width: 'auto',
                aspectRatio: '2752 / 1536',
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`,
                transformOrigin: 'center center'
              }}
            >
              {/* Capa 0 Base: hombre.jpg (Única activa por defecto) */}
              <img
                src="/hombre.jpg"
                alt="Cuerpo base"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0 transition-opacity duration-200"
                style={{ opacity: baseOpacity / 100 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'hombre.jpg';
                }}
              />

              {/* Capas 1 a 7 superpuestas con fondo transparente procesado */}
              {OVERLAY_LAYERS.map((layer) => {
                const zIndex = (layerStack.indexOf(layer.id) + 1) * 2;
                const isActive = layerActive[layer.id];
                const opacity = (layerOpacities[layer.id] ?? 70) / 100;
                const src = transparentUrls[layer.id] || layer.file;

                return (
                  <img
                    key={layer.id}
                    src={src}
                    alt={layer.name}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-250"
                    style={{
                      zIndex,
                      opacity: isActive ? opacity : 0
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = layer.file.replace(/^\//, '');
                    }}
                  />
                );
              })}

              {/* Capa de Etiquetas y Pines Interactivos */}
              {showLabels && (
                <div className="absolute inset-0 w-full h-full pointer-events-auto z-25">
                  {activeLayerIds.map((layerId) => {
                    const pins = ANATOMY_LABELS_DATA[layerId] || [];
                    const sheet = ALL_ACETATE_SHEETS.find((s) => s.id === layerId) || ALL_ACETATE_SHEETS[0];

                    return pins.map((pin, idx) => {
                      const isSelected = activePin?.pin.name === pin.name;
                      return (
                        <div
                          key={`${layerId}-${idx}`}
                          className="absolute pointer-events-auto"
                          style={{
                            left: `${pin.x}%`,
                            top: `${pin.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: isSelected ? 45 : 30
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playPinSelectSound();
                              setActivePin(isSelected ? null : { layerId, pin });
                            }}
                            className={`relative flex items-center justify-center cursor-pointer transition-all duration-200 outline-none ${
                              isSelected ? 'scale-125' : 'hover:scale-125 active:scale-95'
                            }`}
                            style={{ width: '22px', height: '22px' }}
                            title={`Toca para explorar: ${pin.name}`}
                          >
                            <span
                              className="absolute w-full h-full rounded-full opacity-70 animate-ping"
                              style={{ backgroundColor: sheet.color }}
                            />
                            <span
                              className="relative flex items-center justify-center w-4 h-4 rounded-full bg-white shadow-md border-2 transition-colors"
                              style={{ borderColor: sheet.color }}
                            >
                              <span
                                className={`w-2 h-2 rounded-full transition-transform ${
                                  isSelected ? 'scale-125' : 'scale-100'
                                }`}
                                style={{ backgroundColor: sheet.color }}
                              />
                            </span>
                          </button>
                        </div>
                      );
                    });
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. MODAL FLOTANTE (POP-UP) DE INFORMACIÓN DE PINES         */}
        {/* (COMPLETO Y SIN RECORTES DE TEXTO)                        */}
        {/* ========================================================= */}
        {showLabels && activePin && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-4 sm:max-w-sm z-40 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {(() => {
              const sheet =
                ALL_ACETATE_SHEETS.find((s) => s.id === activePin.layerId) || ALL_ACETATE_SHEETS[0];
              return (
                <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-slate-200/90 flex flex-col gap-2.5">
                  {/* Encabezado: Badge y Botón Cerrar */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div
                      className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs"
                      style={{
                        backgroundColor: `${sheet.color}15`,
                        color: sheet.color,
                        border: `1px solid ${sheet.color}40`
                      }}
                    >
                      <span className="text-base">{sheet.emoji}</span>
                      <span>{sheet.short}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSpeakOrgan(activePin.pin.name, activePin.pin.info)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        title="Escuchar en voz alta"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActivePin(null)}
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer text-sm font-bold"
                        title="Cerrar ficha"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Nombre del órgano */}
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {activePin.pin.name}
                  </h3>

                  {/* Descripción pedagógica completa y sin recortes */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    {activePin.pin.info}
                  </p>

                  {/* Pie con indicador de sistema y botón Entendido */}
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                    <span className="font-semibold text-slate-500">Capa: {sheet.name}</span>
                    <button
                      type="button"
                      onClick={() => setActivePin(null)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs cursor-pointer transition-colors"
                    >
                      Entendido
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Píldora guía cuando las etiquetas están activas y ningún pin ha sido seleccionado */}
        {showLabels && !activePin && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in duration-300">
            <div className="bg-slate-900/85 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-slate-700/60">
              <span className="text-amber-400">💡</span>
              <span>Toca cualquier punto interactivo para abrir su ficha</span>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 5. BARRA INFERIOR: SLIDER BASE Y BOTONES CON ICONOS       */}
      {/* ========================================================= */}
      <footer className="h-16 sm:h-18 shrink-0 bg-white border-t border-slate-200 px-2 sm:px-6 py-1.5 sm:py-2 flex flex-col justify-center gap-1 sm:gap-1.5 shadow-sm z-20">
        
        {/* Fila 1: Control Deslizante de Intensidad de la Base (0% a 100%) */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span className="text-xs sm:text-sm">👤</span>
            <span className="font-bold text-slate-800 text-[11px] sm:text-xs">Base:</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-1 max-w-xs sm:max-w-md">
            <input
              type="range"
              min="0"
              max="100"
              value={baseOpacity}
              onChange={(e) => setBaseOpacity(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              title="Ajustar opacidad del cuerpo humano base (0% a 100%)"
            />
            <span className="text-[11px] font-mono font-bold text-indigo-700 w-8 sm:w-9 text-right shrink-0">
              {baseOpacity}%
            </span>
          </div>

          {/* Botón que abre el cajón lateral para calibrar transparencias individuales */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowDrawer(true);
            }}
            className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-bold shrink-0 cursor-pointer transition-colors"
            title="Ajustar transparencias individuales de los acetatos"
          >
            <Sliders className="w-3 h-3" />
            <span className="hidden sm:inline">Ajustar Acetatos</span>
            <span className="sm:hidden">Acetatos</span>
          </button>
        </div>

        {/* Fila 2: Barra de Selección Directa Horizontal (1 a 7) con Iconos y Emojis */}
        <div className="flex items-center gap-1 sm:gap-1.5 justify-between overflow-x-hidden">
          {OVERLAY_LAYERS.map((layer) => {
            const isActive = layerActive[layer.id];
            const currentOp = layerOpacities[layer.id] ?? 70;

            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => toggleLayer(layer.id)}
                className={`flex-1 py-1 sm:py-1.5 px-0.5 sm:px-1.5 rounded-lg sm:rounded-xl text-center font-bold transition-all cursor-pointer truncate flex items-center justify-center gap-0.5 sm:gap-1 border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-1 ring-slate-800'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title={`${layer.name} (${isActive ? `Activo al ${currentOp}%` : 'Inactivo'})`}
              >
                <span className="text-xs sm:text-sm shrink-0 leading-none">{layer.emoji}</span>
                <span className="text-[10px] sm:text-xs font-bold truncate max-w-[48px] sm:max-w-none">
                  {layer.short}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                )}
                {isActive && (
                  <span className="text-[9px] font-mono opacity-80 hidden lg:inline">{currentOp}%</span>
                )}
              </button>
            );
          })}
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 6. MENÚ LATERAL: ACETATOS Y OPACIDADES (PRESET 70%)       */}
      {/* ========================================================= */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm sm:max-w-md h-full flex flex-col p-4 sm:p-5 shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                  Acetatos: Opacidad y Z-Index
                </h3>
                <span className="text-[11px] text-slate-500">
                  Sliders individuales (Default 70%) • ▲ / ▼ Reordenar
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 cursor-pointer font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets de calibración rápida */}
            <div className="flex items-center justify-between gap-1.5 py-3 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-600 text-[11px]">Calibración rápida:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    const newOps = { ...layerOpacities };
                    OVERLAY_LAYERS.forEach((l) => {
                      newOps[l.id] = 50;
                    });
                    setLayerOpacities(newOps);
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    const newOps = { ...layerOpacities };
                    OVERLAY_LAYERS.forEach((l) => {
                      newOps[l.id] = 70;
                    });
                    setLayerOpacities(newOps);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] cursor-pointer shadow-xs"
                >
                  70% (Óptimo)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    const newOps = { ...layerOpacities };
                    OVERLAY_LAYERS.forEach((l) => {
                      newOps[l.id] = 100;
                    });
                    setLayerOpacities(newOps);
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                >
                  100%
                </button>
              </div>
            </div>

            {/* Lista con sliders y reordenación de capas */}
            <div className="flex-1 min-h-0 overflow-y-auto py-3 space-y-2.5">
              {layerStack
                .slice()
                .reverse()
                .map((layerId) => {
                  const actualIndex = layerStack.indexOf(layerId);
                  const layer = OVERLAY_LAYERS.find((l) => l.id === layerId);
                  if (!layer) return null;
                  const isActive = layerActive[layer.id];
                  const currentOp = layerOpacities[layer.id] ?? 70;

                  return (
                    <div
                      key={layer.id}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base">{layer.emoji}</span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {layer.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveLayerUp(actualIndex)}
                            disabled={actualIndex === layerStack.length - 1}
                            className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Subir nivel en la pila"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveLayerDown(actualIndex)}
                            disabled={actualIndex === 0}
                            className="p-1 rounded text-slate-500 hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Bajar nivel en la pila"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleLayer(layer.id)}
                          className="w-4 h-4 rounded text-indigo-600 cursor-pointer accent-indigo-600"
                        />
                        <span className="text-[11px] font-semibold text-slate-600">Activo</span>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={currentOp}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setLayerOpacities((prev) => ({ ...prev, [layer.id]: val }));
                          }}
                          className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg flex-1"
                        />
                        <span className="text-[11px] font-mono font-bold text-indigo-700 w-8 text-right">
                          {currentOp}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setLayerStack([1, 2, 3, 4, 5, 6, 7]);
                }}
                className="text-xs text-slate-500 hover:text-indigo-600 font-bold cursor-pointer"
              >
                Restablecer orden anatómico
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowDrawer(false);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. CENTRO DE IMPRESIÓN Y DESCARGA DE ACETATOS             */}
      {/* ========================================================= */}
      {showAcetateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] max-h-[760px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Encabezado */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-none">
                    Centro de Impresión y Descarga de Acetatos
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Láminas listas con marcas de registro en las 4 esquinas y margen de encuadernación.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAcetateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 font-bold rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Acciones globales */}
            <div className="px-5 py-3 bg-indigo-50/70 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-indigo-900">
                <span className="font-bold">📦 Paquete Completo:</span>
                <span>8 láminas originales en alta definición (2752 × 1536 px)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={zipLoading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all disabled:opacity-75"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{zipStatusText}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintAllBatch}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Todo el Lote</span>
                </button>
              </div>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-slate-700">
              {/* Guía rápida */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-sky-50/80 p-3 rounded-2xl border border-sky-200">
                  <div className="font-bold text-sky-950 text-xs mb-1 flex items-center gap-1">
                    <span>📄</span> 1. Papel Acetato
                  </div>
                  <p className="text-[11px] text-sky-900/90 leading-relaxed">
                    Imprime en láminas de acetato transparente tamaño carta o A4 para armar el atlas anatómico físico por capas.
                  </p>
                </div>
                <div className="bg-indigo-50/80 p-3 rounded-2xl border border-indigo-200">
                  <div className="font-bold text-indigo-950 text-xs mb-1 flex items-center gap-1">
                    <span>✂️</span> 2. Margen de Perforación
                  </div>
                  <p className="text-[11px] text-indigo-900/90 leading-relaxed">
                    La línea vertical punteada en el extremo izquierdo sirve de guía para perforar y coser o anillar sin invadir el cuerpo.
                  </p>
                </div>
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200">
                  <div className="font-bold text-emerald-950 text-xs mb-1 flex items-center gap-1">
                    <span>🎯</span> 3. Cruces de Registro
                  </div>
                  <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                    Superpón las hojas haciendo coincidir exactamente las 4 marcas de cruz en las esquinas para una alineación milimétrica.
                  </p>
                </div>
              </div>

              {/* Catálogo de láminas individuales */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Láminas Individuales para Descarga o Impresión Separada
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">8 láminas disponibles</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ALL_ACETATE_SHEETS.map((sheet) => (
                    <div
                      key={sheet.id}
                      className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg flex items-center gap-1"
                            style={{ backgroundColor: `${sheet.color}15`, color: sheet.color }}
                          >
                            <span>{sheet.emoji}</span>
                            <span>{sheet.numberLabel}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">2752 × 1536</span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                          {sheet.name}
                        </h4>

                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          {sheet.desc}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="w-full h-24 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-1">
                          <img
                            src={sheet.file}
                            alt={sheet.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = sheet.file.replace(/^\//, '');
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <a
                            href={sheet.file}
                            download={`Acetato_${sheet.slug}.jpg`}
                            onClick={() => playClickSound()}
                            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
                            title="Descargar imagen JPG en alta resolución"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Descargar</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handlePrintSingle(sheet)}
                            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
                            title="Imprimir lámina individual"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Imprimir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pie de modal */}
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Tip: En la impresora escolar, selecciona "Ajustar al área de impresión" y escala al 100%.
              </span>
              <button
                type="button"
                onClick={() => setShowAcetateModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA DE IMPRESIÓN OCULTA */}
      <div id="print-staging-area" className="hidden" />
    </div>
  );
}
