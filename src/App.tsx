/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import {
  Printer,
  Gamepad2,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Layers as LayersIcon,
  HelpCircle,
  X,
  Maximize2,
  BookOpen,
  Download,
  Package,
  Tag,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import {
  playSuccessSound,
  playGentleRetrySound,
  playClickSound,
  playLayerToggleSound,
  playPinSelectSound,
  playLabelToggleSound,
  playZoomSound,
  playCelebrationSound,
  setSoundEnabled
} from './utils/audio';

export interface AcetateSheet {
  id: number;
  numberLabel: string;
  name: string;
  shortName: string;
  slug: string;
  fileName: string;
  color: string;
  desc: string;
  emoji: string;
}

export interface AnatomyLabel {
  name: string;
  x: number;
  y: number;
  side: 'left' | 'right';
  info: string;
}

export const ALL_ACETATE_SHEETS: AcetateSheet[] = [
  {
    id: 0,
    numberLabel: 'Capa Base',
    name: 'Cuerpo Humano Completo (Base)',
    shortName: 'Base',
    slug: 'hombre',
    fileName: '/hombre.jpg',
    color: '#6366F1',
    desc: 'Figura en posición anatómica estándar de frente con palmas hacia el frente.',
    emoji: '👤'
  },
  {
    id: 1,
    numberLabel: 'Capa 1',
    name: 'Sistema Muscular',
    shortName: 'Muscular',
    slug: 'musculo',
    fileName: '/musculo.jpg',
    color: '#EF4444',
    desc: 'Más de 600 músculos elásticos y tendones que generan movimiento.',
    emoji: '🦾'
  },
  {
    id: 2,
    numberLabel: 'Capa 2',
    name: 'Aparato Respiratorio',
    shortName: 'Respiratorio',
    slug: 'respiratorio',
    fileName: '/respiratorio.jpg',
    color: '#0EA5E9',
    desc: 'Tráquea anillada, bronquios y pulmones para captar oxígeno fresco.',
    emoji: '🫁'
  },
  {
    id: 3,
    numberLabel: 'Capa 3',
    name: 'Sistema Circulatorio',
    shortName: 'Circulatorio',
    slug: 'circulatorio',
    fileName: '/circulatorio.jpg',
    color: '#E11D48',
    desc: 'Corazón, arterias rojas y venas azules de distribución sanguínea.',
    emoji: '🫀'
  },
  {
    id: 4,
    numberLabel: 'Capa 4',
    name: 'Aparato Digestivo',
    shortName: 'Digestivo',
    slug: 'digestivo',
    fileName: '/digestivo.jpg',
    color: '#D97706',
    desc: 'Esófago, estómago, hígado e intestinos para absorber energía.',
    emoji: '🍽️'
  },
  {
    id: 5,
    numberLabel: 'Capa 5',
    name: 'Sistema Nervioso',
    shortName: 'Nervioso',
    slug: 'nervioso',
    fileName: '/nervioso.jpg',
    color: '#8B5CF6',
    desc: 'Cerebro, médula espinal y ramificaciones nerviosas motoras y sensoriales.',
    emoji: '🧠'
  },
  {
    id: 6,
    numberLabel: 'Capa 6',
    name: 'Sistema Reproductor',
    shortName: 'Reproductor',
    slug: 'reproductor',
    fileName: '/reproductor.jpg',
    color: '#EC4899',
    desc: 'Aparato urogenital y pélvico de continuidad de la vida y hormonas.',
    emoji: '🧬'
  },
  {
    id: 7,
    numberLabel: 'Capa 7',
    name: 'Sistema Óseo (Esqueleto)',
    shortName: 'Esqueleto',
    slug: 'oseo',
    fileName: '/oseo.jpg',
    color: '#475569',
    desc: 'Armazón rígido de 206 huesos que sostiene el cuerpo y protege órganos.',
    emoji: '🦴'
  }
];

export const BASE_LAYER = ALL_ACETATE_SHEETS[0];
export const ANATOMY_LAYERS = ALL_ACETATE_SHEETS.filter((s) => s.id > 0);

/*
  BASE DE DATOS DE ETIQUETAS ANATÓMICAS POR CAPA
  Porcentajes exactos respecto al lienzo 2752 x 1536
*/
export const ANATOMY_LABELS_MAP: Record<number, AnatomyLabel[]> = {
  0: [
    { name: 'Cabeza y Rostro', x: 50, y: 8, side: 'right', info: 'Postura erguida con mirada al frente' },
    { name: 'Tórax y Tronco', x: 50, y: 28, side: 'left', info: 'Eje axial del cuerpo humano' },
    { name: 'Palmas hacia el Frente', x: 37, y: 53, side: 'left', info: 'Posición anatómica estándar universal' },
    { name: 'Extremidades Inferiores', x: 47, y: 76, side: 'left', info: 'Piernas rectas ligeramente separadas' }
  ],
  1: [
    { name: 'Pectoral Mayor', x: 47.5, y: 27, side: 'left', info: 'Músculo del pecho para empujar y mover brazos' },
    { name: 'Bíceps Braquial', x: 42, y: 34, side: 'left', info: 'Flexiona el brazo y levanta objetos' },
    { name: 'Recto del Abdomen', x: 50, y: 38, side: 'right', info: 'Abdominales que protegen y flexionan el tronco' },
    { name: 'Cuádriceps', x: 46.5, y: 62, side: 'left', info: 'Potente músculo del muslo para correr y saltar' },
    { name: 'Gemelos (Pantorrilla)', x: 46.5, y: 81, side: 'left', info: 'Músculo de la pierna para impulsarse al caminar' }
  ],
  2: [
    { name: 'Cavidad Nasal / Faringe', x: 50, y: 13, side: 'right', info: 'Calienta y filtra el aire inhalado' },
    { name: 'Tráquea Anillada', x: 50, y: 20, side: 'left', info: 'Tubo cartilaginoso que conduce el aire' },
    { name: 'Pulmones', x: 53, y: 27, side: 'right', info: 'Intercambian oxígeno por dióxido de carbono' },
    { name: 'Diafragma', x: 50, y: 34, side: 'left', info: 'Músculo que se contrae para permitir la respiración' }
  ],
  3: [
    { name: 'Corazón', x: 51.5, y: 28, side: 'right', info: 'Bomba muscular que late 100,000 veces al día' },
    { name: 'Arteria Aorta (Roja)', x: 49.5, y: 24, side: 'left', info: 'Lleva sangre rica en oxígeno a todo el cuerpo' },
    { name: 'Vena Cava (Azul)', x: 50.5, y: 36, side: 'right', info: 'Retorna la sangre usada al corazón' },
    { name: 'Vasos Femorales', x: 48, y: 64, side: 'left', info: 'Red de irrigación en las piernas' }
  ],
  4: [
    { name: 'Esófago', x: 50, y: 21, side: 'left', info: 'Tubo que transporta la comida de la boca al estómago' },
    { name: 'Hígado', x: 48, y: 33, side: 'left', info: 'Órgano que produce bilis y filtra toxinas' },
    { name: 'Estómago', x: 52, y: 33, side: 'right', info: 'Descompone los alimentos con ácidos y enzimas' },
    { name: 'Intestino Delgado', x: 50, y: 42, side: 'right', info: 'Tubo de 6 a 7 metros que absorbe los nutrientes' },
    { name: 'Intestino Grueso (Colon)', x: 50, y: 48, side: 'left', info: 'Absorbe agua y forma los desechos' }
  ],
  5: [
    { name: 'Cerebro / Encéfalo', x: 50, y: 9.5, side: 'right', info: 'Supercomputadora que procesa pensamientos y sentidos' },
    { name: 'Médula Espinal', x: 50, y: 28, side: 'left', info: 'Autopista central de señales nerviosas' },
    { name: 'Plexo Braquial (Brazos)', x: 44, y: 30, side: 'left', info: 'Nervios que controlan el movimiento de las manos' },
    { name: 'Nervio Ciático (Piernas)', x: 52, y: 63, side: 'right', info: 'El nervio más largo y grueso del cuerpo' }
  ],
  6: [
    { name: 'Riñones', x: 48, y: 36, side: 'left', info: 'Filtran la sangre y producen la orina' },
    { name: 'Uréteres', x: 51.5, y: 41, side: 'right', info: 'Conductos que llevan la orina a la vejiga' },
    { name: 'Aparato Reproductor / Vejiga', x: 50, y: 49, side: 'left', info: 'Órganos pélvicos y de continuidad de la vida' }
  ],
  7: [
    { name: 'Cráneo', x: 50, y: 10, side: 'right', info: 'Caja ósea que protege el cerebro' },
    { name: 'Caja Torácica (Costillas)', x: 50, y: 28, side: 'left', info: 'Protegen el corazón y los pulmones' },
    { name: 'Columna Vertebral', x: 50, y: 36, side: 'right', info: 'Eje de 33 vértebras que permite erguirnos' },
    { name: 'Pelvis / Cadera', x: 50, y: 46, side: 'left', info: 'Sostiene los órganos abdominales y conecta las piernas' },
    { name: 'Fémur', x: 47, y: 64, side: 'left', info: 'El hueso más largo y resistente del esqueleto' },
    { name: 'Tibia y Peroné', x: 47, y: 82, side: 'left', info: 'Huesos de la espinilla que sostienen el peso al caminar' }
  ]
};

const QUIZ_ITEMS = [
  {
    layerId: 3,
    question: '¿Qué capa contiene el corazón que bombea sangre con oxígeno por arterias y venas?',
    hint: 'Busca los vasos sanguíneos rojos y azules con el corazón latiendo en el pecho.'
  },
  {
    layerId: 7,
    question: '¿Cuál es el armazón de 206 huesos que sostiene el cuerpo y protege el cerebro con el cráneo?',
    hint: 'Es la estructura rígida con costillas, columna vertebral y fémur.'
  },
  {
    layerId: 2,
    question: '¿Qué aparato capta el oxígeno del aire a través de la tráquea anillada y los pulmones?',
    hint: 'Está en el pecho y cuello, con los bronquios ramificados.'
  },
  {
    layerId: 4,
    question: '¿Qué aparato transforma la comida en nutrientes vitales con el estómago y los intestinos?',
    hint: 'Incluye el hígado rojizo, el estómago y el tubo digestivo.'
  },
  {
    layerId: 1,
    question: '¿Qué sistema contiene más de 600 músculos elásticos que tiran de los huesos para movernos?',
    hint: 'Cubre todo el cuerpo con fibras rojas y tendones de anclaje.'
  },
  {
    layerId: 5,
    question: '¿Qué sistema actúa como la supercomputadora del cuerpo con el cerebro y nervios veloces?',
    hint: 'Tiene el encéfalo en la cabeza y cordones amarillos que llegan a cada dedo.'
  }
];

function processImageToTransparent(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = 1834;
      const h = 1024;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        resolve(src);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      const minX = w * 0.28;
      const maxX = w * 0.72;
      const minY = h * 0.02;
      const maxY = h * 0.98;

      for (let y = 0; y < h; y++) {
        const isOuterY = y < minY || y > maxY;
        const rowOffset = y * w * 4;
        for (let x = 0; x < w; x++) {
          const idx = rowOffset + x * 4;

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
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          resolve(canvas.toDataURL('image/png'));
        }
      }, 'image/png');
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export default function App() {
  const [baseOpacity, setBaseOpacity] = useState<number>(100);

  // Opacidad individual por cada sistema (Capa 1 a 7).
  // Requerimiento: Valor por defecto de 70% (0.7) para simular acetatos translúcidos reales.
  const [layerOpacities, setLayerOpacities] = useState<Record<number, number>>({
    1: 70,
    2: 70,
    3: 70,
    4: 70,
    5: 70,
    6: 70,
    7: 70
  });

  const [activeLayersMap, setActiveLayersMap] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: true,
    5: false,
    6: false,
    7: true
  });

  const [layerStack, setLayerStack] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [transparentUrls, setTransparentUrls] = useState<Record<number, string>>({});
  const processedRef = useRef<boolean>(false);

  // Zoom & Pan interactivo con gestos táctiles (Pinch-to-zoom, Pan y Doble toque)
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  const visorContainerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{
    touchesCount: number;
    initialDist: number;
    initialZoom: number;
    initialPan: { x: number; y: number };
    startPoints: { x: number; y: number }[];
    lastTapTime: number;
  }>({
    touchesCount: 0,
    initialDist: 0,
    initialZoom: 1.0,
    initialPan: { x: 0, y: 0 },
    startPoints: [],
    lastTapTime: 0
  });

  const mouseDragRef = useRef<{
    isDown: boolean;
    startX: number;
    startY: number;
    initialPan: { x: number; y: number };
  }>({
    isDown: false,
    startX: 0,
    startY: 0,
    initialPan: { x: 0, y: 0 }
  });

  // ETIQUETAS ANATÓMICAS (TOGGLE ON/OFF Y HOTSPOT ACTIVO)
  const [areLabelsOn, setAreLabelsOn] = useState<boolean>(false);
  const [activeHotspotKey, setActiveHotspotKey] = useState<string | null>(null);

  const [tooltipData, setTooltipData] = useState<null>(null); // Legacy compatibility if needed

  // Información del órgano seleccionado para el Panel de Información Externo (Fuera del visor anatómico)
  const selectedOrganData = useMemo(() => {
    if (!activeHotspotKey || !areLabelsOn) return null;
    const [layerIdStr, idxStr] = activeHotspotKey.split('-');
    const layerId = Number(layerIdStr);
    const idx = Number(idxStr);
    const labels = ANATOMY_LABELS_MAP[layerId] || [];
    const item = labels[idx];
    if (!item) return null;
    const meta = ALL_ACETATE_SHEETS.find((s) => s.id === layerId) || {
      id: layerId,
      numberLabel: 'Atlas',
      name: 'Atlas',
      shortName: 'Atlas',
      slug: 'atlas',
      fileName: '',
      color: '#6366F1',
      desc: '',
      emoji: '👤'
    };
    return { item, meta, layerId };
  }, [activeHotspotKey, areLabelsOn]);

  // Modales
  const [showZIndexDrawer, setShowZIndexDrawer] = useState<boolean>(false);
  const [showAcetateModal, setShowAcetateModal] = useState<boolean>(false);

  // Modo Quiz Didáctico No Bloqueante
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [isQuizMinimized, setIsQuizMinimized] = useState<boolean>(false);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<{ type: 'none' | 'success' | 'encouraging'; text: string }>({
    type: 'none',
    text: ''
  });

  // Estado de descarga en bloque (ZIP)
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [zipStatusText, setZipStatusText] = useState<string>('Descargar Paquete Completo (ZIP)');

  // Sonido
  const [soundEnabledState, setSoundEnabledState] = useState<boolean>(true);

  // PANTALLA DE BIENVENIDA (SPLASH SCREEN) DE 3 SEGUNDOS CON PARTÍCULAS
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [splashFade, setSplashFade] = useState<boolean>(false);
  const splashCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // PWA (Progressive Web App) Install Prompt para Android
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Exactamente 3 segundos de visualización antes del fundido suave
    const timerFade = setTimeout(() => {
      setSplashFade(true);
    }, 3000);

    const timerDismiss = setTimeout(() => {
      setShowSplash(false);
    }, 3650);

    return () => {
      clearTimeout(timerFade);
      clearTimeout(timerDismiss);
    };
  }, []);

  // Animación suave de partículas flotantes en Canvas nativo
  useEffect(() => {
    if (!showSplash) return;
    const canvas = splashCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      'rgba(99, 102, 241, 0.45)', // Índigo suave
      'rgba(56, 189, 248, 0.45)', // Celeste
      'rgba(245, 158, 11, 0.4)',  // Ámbar
      'rgba(16, 185, 129, 0.4)',  // Esmeralda
      'rgba(244, 63, 94, 0.35)'   // Rosa suave
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

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [showSplash]);

  // Soporte PWA para instalación en Android / Pantalla de inicio
  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;
    setIsAppInstalled(isStandalone);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const handleInstalled = () => {
      setIsAppInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    playClickSound();
    if (!installPrompt) {
      alert('Para instalar en Android:\n1. Toca el menú del navegador (los 3 puntos ⋮ en la esquina superior derecha).\n2. Selecciona "Instalar aplicación" o "Agregar a la pantalla principal".');
      return;
    }
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsAppInstalled(true);
    }
    setInstallPrompt(null);
  };

  const clampZoom = (z: number) => Math.min(Math.max(z, 0.75), 4.5);

  const clampPan = (px: number, py: number, currentZoom: number) => {
    const limitX = Math.max(50, (currentZoom - 0.85) * 400);
    const limitY = Math.max(50, (currentZoom - 0.85) * 550);
    return {
      x: Math.min(Math.max(px, -limitX), limitX),
      y: Math.min(Math.max(py, -limitY), limitY)
    };
  };

  const handleZoomIn = () => {
    playZoomSound('in');
    setZoomScale((prev) => clampZoom(prev + 0.3));
  };

  const handleZoomOut = () => {
    playZoomSound('out');
    setZoomScale((prev) => {
      const next = clampZoom(prev - 0.3);
      if (next <= 1.05) {
        setPanPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleResetZoom = () => {
    playZoomSound('reset');
    setZoomScale(1.0);
    setPanPosition({ x: 0, y: 0 });
  };

  // Zoom suave con rueda del mouse
  useEffect(() => {
    const container = visorContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      setZoomScale((prev) => {
        const next = clampZoom(prev + delta);
        if (next <= 1.05) {
          setPanPosition({ x: 0, y: 0 });
        }
        return next;
      });
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Gestos táctiles
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    const touches = Array.from(e.touches).map((t) => ({ x: t.clientX, y: t.clientY }));
    const now = Date.now();

    if (e.touches.length === 1) {
      if (now - touchStartRef.current.lastTapTime < 300) {
        // Doble toque detectado
        if (zoomScale > 1.2) {
          handleResetZoom();
        } else {
          playClickSound();
          setZoomScale(2.2);
        }
        touchStartRef.current.lastTapTime = 0;
        return;
      }
      touchStartRef.current.lastTapTime = now;
      touchStartRef.current.startPoints = touches;
      touchStartRef.current.initialPan = { ...panPosition };
      touchStartRef.current.touchesCount = 1;
    } else if (e.touches.length >= 2) {
      const dist = Math.hypot(touches[0].x - touches[1].x, touches[0].y - touches[1].y);
      touchStartRef.current.initialDist = dist || 1;
      touchStartRef.current.initialZoom = zoomScale;
      touchStartRef.current.initialPan = { ...panPosition };
      touchStartRef.current.startPoints = touches;
      touchStartRef.current.touchesCount = 2;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touches = Array.from(e.touches).map((t) => ({ x: t.clientX, y: t.clientY }));

    if (e.touches.length === 2 && touchStartRef.current.touchesCount === 2) {
      e.preventDefault();
      const dist = Math.hypot(touches[0].x - touches[1].x, touches[0].y - touches[1].y);
      const scaleFactor = dist / touchStartRef.current.initialDist;
      const newZoom = clampZoom(touchStartRef.current.initialZoom * scaleFactor);
      setZoomScale(newZoom);

      const currentMidX = (touches[0].x + touches[1].x) / 2;
      const currentMidY = (touches[0].y + touches[1].y) / 2;
      const startMidX = (touchStartRef.current.startPoints[0].x + touchStartRef.current.startPoints[1].x) / 2;
      const startMidY = (touchStartRef.current.startPoints[0].y + touchStartRef.current.startPoints[1].y) / 2;
      const nextPan = {
        x: touchStartRef.current.initialPan.x + (currentMidX - startMidX),
        y: touchStartRef.current.initialPan.y + (currentMidY - startMidY)
      };
      setPanPosition(clampPan(nextPan.x, nextPan.y, newZoom));
    } else if (e.touches.length === 1 && touchStartRef.current.touchesCount === 1) {
      const deltaX = touches[0].x - touchStartRef.current.startPoints[0].x;
      const deltaY = touches[0].y - touchStartRef.current.startPoints[0].y;
      const nextPan = {
        x: touchStartRef.current.initialPan.x + deltaX,
        y: touchStartRef.current.initialPan.y + deltaY
      };
      setPanPosition(clampPan(nextPan.x, nextPan.y, zoomScale));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsInteracting(false);
      touchStartRef.current.touchesCount = 0;
      if (zoomScale < 0.95) {
        setZoomScale(1.0);
        setPanPosition({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1) {
      touchStartRef.current.touchesCount = 1;
      touchStartRef.current.startPoints = [{ x: e.touches[0].clientX, y: e.touches[0].clientY }];
      touchStartRef.current.initialPan = { ...panPosition };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDragRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      initialPan: { ...panPosition }
    };
    setIsInteracting(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseDragRef.current.isDown) return;
    const deltaX = e.clientX - mouseDragRef.current.startX;
    const deltaY = e.clientY - mouseDragRef.current.startY;
    const nextPan = {
      x: mouseDragRef.current.initialPan.x + deltaX,
      y: mouseDragRef.current.initialPan.y + deltaY
    };
    setPanPosition(clampPan(nextPan.x, nextPan.y, zoomScale));
  };

  const handleMouseUp = () => {
    mouseDragRef.current.isDown = false;
    setIsInteracting(false);
  };

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    ANATOMY_LAYERS.forEach((layer) => {
      processImageToTransparent(layer.fileName).then((url) => {
        setTransparentUrls((prev) => ({ ...prev, [layer.id]: url }));
      });
    });
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabledState;
    setSoundEnabledState(next);
    setSoundEnabled(next);
  };

  const handleToggleLabels = () => {
    playLabelToggleSound(!areLabelsOn);
    setAreLabelsOn((prev) => {
      if (prev) {
        setActiveHotspotKey(null);
      }
      return !prev;
    });
  };

  const handleUpdateLayerOpacity = (id: number, val: number) => {
    setLayerOpacities((prev) => ({ ...prev, [id]: val }));
  };

  const handleSetAllOpacities = (val: number) => {
    playClickSound();
    const updated: Record<number, number> = {};
    ANATOMY_LAYERS.forEach((l) => {
      updated[l.id] = val;
    });
    setLayerOpacities(updated);
  };

  const handleToggleLayer = (id: number) => {
    const willBeActive = !activeLayersMap[id];
    playLayerToggleSound(id, willBeActive);
    setActiveLayersMap((prev) => {
      if (willBeActive && layerOpacities[id] === undefined) {
        setLayerOpacities((ops) => ({ ...ops, [id]: 70 }));
      }
      return { ...prev, [id]: willBeActive };
    });
  };

  const handleSelectAllLayers = () => {
    playClickSound();
    const next: Record<number, boolean> = {};
    ANATOMY_LAYERS.forEach((l) => {
      next[l.id] = true;
    });
    setActiveLayersMap(next);
  };

  const handleClearAllLayers = () => {
    playClickSound();
    const next: Record<number, boolean> = {};
    ANATOMY_LAYERS.forEach((l) => {
      next[l.id] = false;
    });
    setActiveLayersMap(next);
  };

  const handleMoveUp = (id: number) => {
    playClickSound();
    setLayerStack((prev) => {
      const idx = prev.indexOf(id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[idx + 1];
      copy[idx + 1] = temp;
      return copy;
    });
  };

  const handleMoveDown = (id: number) => {
    playClickSound();
    setLayerStack((prev) => {
      const idx = prev.indexOf(id);
      if (idx === -1 || idx === 0) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[idx - 1];
      copy[idx - 1] = temp;
      return copy;
    });
  };

  const activeQuiz = QUIZ_ITEMS[quizIndex % QUIZ_ITEMS.length];

  const handleQuizAnswer = (chosenLayerId: number) => {
    if (chosenLayerId === activeQuiz.layerId) {
      playSuccessSound();
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      });
      setQuizFeedback({ type: 'success', text: '¡Excelente! ¡Lo has identificado a la perfección!' });
      setQuizScore((prev) => prev + 1);
      setActiveLayersMap((prev) => ({ ...prev, [chosenLayerId]: true }));

      setTimeout(() => {
        setQuizIndex((prev) => prev + 1);
        setQuizFeedback({ type: 'none', text: '' });
      }, 1500);
    } else {
      playGentleRetrySound();
      const phrases = [
        '¡Casi! Puedes consultar las capas en la barra inferior y volver a probar.',
        '¡Buen intento! Revisa el cuerpo humano para encontrar la pista.',
        '¡Estás muy cerca! Explora las capas libremente antes de contestar.'
      ];
      setQuizFeedback({
        type: 'encouraging',
        text: phrases[Math.floor(Math.random() * phrases.length)]
      });
    }
  };

  const handleDownloadSingle = (sheet: AcetateSheet) => {
    playClickSound();
    const a = document.createElement('a');
    a.href = sheet.fileName;
    a.download = `Acetato_${sheet.slug}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintSingle = (sheet: AcetateSheet) => {
    playClickSound();
    const printContainer = document.getElementById('print-staging-area-react');
    if (!printContainer) return;

    printContainer.innerHTML = `
      <div class="page-break flex flex-col items-center justify-center p-4" style="height: 100vh;">
        <div style="text-align: center; margin-bottom: 8px;">
          <h2 style="font-size: 16px; font-weight: bold; color: #1e293b;">${sheet.name} — Lámina de Acetato</h2>
          <p style="font-size: 11px; color: #64748b;">Alinear con las 4 cruces de registro en esquinas • Margen de perforación a la izquierda</p>
        </div>
        <div style="width: 95vw; height: 85vh; display: flex; align-items: center; justify-content: center;">
          <img src="${sheet.fileName}" alt="${sheet.name}" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
      </div>
    `;
    window.print();
  };

  const handlePrintBatch = () => {
    playClickSound();
    const printContainer = document.getElementById('print-staging-area-react');
    if (!printContainer) return;

    let html = '';
    ALL_ACETATE_SHEETS.forEach((sheet) => {
      html += `
        <div class="page-break flex flex-col items-center justify-center p-4" style="height: 100vh; page-break-after: always; break-after: page;">
          <div style="text-align: center; margin-bottom: 8px;">
            <h2 style="font-size: 16px; font-weight: bold; color: #1e293b;">${sheet.numberLabel}: ${sheet.name}</h2>
            <p style="font-size: 11px; color: #64748b;">Cruces de registro en esquinas • Margen de encuadernación punteado a la izquierda</p>
          </div>
          <div style="width: 95vw; height: 85vh; display: flex; align-items: center; justify-content: center;">
            <img src="${sheet.fileName}" alt="${sheet.name}" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
        </div>
      `;
    });
    printContainer.innerHTML = html;
    window.print();
  };

  const handleDownloadAllZip = async () => {
    playClickSound();
    setIsZipping(true);
    setZipStatusText('Generando ZIP...');

    try {
      const zip = new JSZip();
      const folder = zip.folder('Acetatos_Anatomia_Humana');

      for (let i = 0; i < ALL_ACETATE_SHEETS.length; i++) {
        const sheet = ALL_ACETATE_SHEETS[i];
        setZipStatusText(`Empacando ${i + 1}/8...`);
        const response = await fetch(sheet.fileName);
        const blob = await response.blob();
        folder?.file(`${sheet.id}_${sheet.slug}.jpg`, blob);
      }

      setZipStatusText('Comprimiendo...');
      const zipContent = await zip.generateAsync({ type: 'blob' });

      const url = URL.createObjectURL(zipContent);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Acetatos_Clase_de_Anatomia_Aldebaran.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      playSuccessSound();
      setZipStatusText('¡Descarga Completa!');
      setTimeout(() => {
        setIsZipping(false);
        setZipStatusText('Descargar Paquete Completo (ZIP)');
      }, 2500);
    } catch (err) {
      console.warn('Fallback a descarga individual:', err);
      setZipStatusText('Descargando...');
      for (const sheet of ALL_ACETATE_SHEETS) {
        handleDownloadSingle(sheet);
        await new Promise((r) => setTimeout(r, 400));
      }
      setIsZipping(false);
      setZipStatusText('Descargar Paquete Completo (ZIP)');
    }
  };

  // Calcular capas que muestran etiquetas
  const activeLabelLayerIds: number[] = [];
  const reversed = [...layerStack].reverse();
  reversed.forEach((id) => {
    if (activeLayersMap[id]) activeLabelLayerIds.push(id);
  });
  if (activeLabelLayerIds.length === 0 && baseOpacity > 30) {
    activeLabelLayerIds.push(0);
  }
  // Mostrar pines de todas las capas activas (sin amontonamiento de texto gracias al sistema de despliegue por toque)
  const displayLabelLayers = activeLabelLayerIds;

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] w-screen overflow-hidden flex flex-col justify-between bg-slate-100 text-slate-800 select-none relative">
      
      {/* 0. PANTALLA DE BIENVENIDA (SPLASH SCREEN) FONDO BLANCO, LOGO, TÍTULO Y PARTÍCULAS (3 SEGUNDOS) */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center select-none transition-opacity duration-700 ease-out ${
            splashFade ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={() => {
            setSplashFade(true);
            setTimeout(() => setShowSplash(false), 300);
          }}
        >
          {/* Canvas con efecto suave de partículas flotantes */}
          <canvas
            ref={splashCanvasRef}
            className="absolute inset-0 pointer-events-none w-full h-full"
          />

          {/* Tarjeta central limpia de bienvenida */}
          <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-sm sm:max-w-md animate-fadeIn">
            {/* Logotipo en contenedor circular con sutil halo */}
            <div className="relative mb-5">
              <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500/20 via-sky-400/25 to-emerald-400/20 rounded-full blur-xl animate-pulse" />
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white p-3 shadow-xl border border-slate-100 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Logo Aldebarán"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Título Oficial Solicitado */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2 font-display">
              Las clases de anatomía de Aldebarán
            </h1>

            {/* Subtítulo escolar amigable */}
            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-5 max-w-xs">
              Atlas interactivo de anatomía por capas y acetatos translúcidos
            </p>

            {/* Barra de progreso de 3 segundos exactos */}
            <div className="w-40 h-1 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 rounded-full"
                style={{
                  animation: 'progressFill 3s linear forwards'
                }}
              />
            </div>

            {/* Opción rápida de saltar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSplashFade(true);
                setTimeout(() => setShowSplash(false), 300);
              }}
              className="mt-6 text-[11px] font-semibold text-slate-400 hover:text-indigo-600 px-3 py-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Toca para entrar ahora
            </button>
          </div>
        </div>
      )}

      {/* 1. BARRA SUPERIOR FIJA COMPACTA */}
      <header className="h-12 sm:h-14 shrink-0 bg-white border-b border-slate-200 px-2 sm:px-6 flex items-center justify-between gap-1 sm:gap-2 shadow-xs z-30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src="/logo.png"
            alt="Aldebarán"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full shadow-xs shrink-0 bg-amber-50 border border-amber-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
              Las clases de anatomía de Aldebarán
            </h1>
            <span className="hidden md:block text-[10px] font-semibold text-emerald-600 truncate">
              Acetatos Translúcidos (70%) • Control de Opacidad • Etiquetas Interactivas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Botón PWA para Android / Móvil */}
          {!isAppInstalled && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg sm:rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              title="Instalar aplicación en Android / Pantalla Principal"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Instalar App</span>
              <span className="md:hidden text-[11px]">Instalar</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleSound}
            title={soundEnabledState ? 'Silenciar audio' : 'Activar audio'}
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {soundEnabledState ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-500" />}
          </button>

          {/* BOTÓN TOGGLE: MOSTRAR / OCULTAR ETIQUETAS */}
          <button
            type="button"
            onClick={handleToggleLabels}
            title="Mostrar u ocultar nombres de estructuras y órganos con pines interactivos"
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer ${
              areLabelsOn
                ? 'bg-violet-600 text-white shadow-xs ring-2 ring-violet-300'
                : 'bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{areLabelsOn ? 'Ocultar Etiquetas' : 'Mostrar Etiquetas'}</span>
            <span className="sm:hidden text-[11px]">{areLabelsOn ? 'Pines ON' : 'Pines'}</span>
          </button>

          {/* BOTÓN: ACETATOS Y OPACIDADES INDIVIDUALES */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowZIndexDrawer(true);
            }}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer"
            title="Abre el menú para regular la transparencia individual de cada acetato (default 70%) y Z-Index"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Acetatos & Opacidad</span>
            <span className="sm:hidden text-[11px]">70%</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsQuizActive(!isQuizActive);
              setIsQuizMinimized(false);
            }}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isQuizActive
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
            title="Modo Reto / Quiz Didáctico"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">Quiz</span>
          </button>

          {/* Botón Destacado: Centro de Impresión y Descarga de Acetatos */}
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

      {/* 2. ÁREA CENTRAL: VISOR FLEXIBLE Y ADAPTATIVO (CERO HUECOS, CERO SCROLL) */}
      <main className="flex-1 min-h-0 w-full overflow-hidden p-0 m-0 bg-slate-100 flex flex-col justify-between relative">
        
        {/* BANNER FLOTANTE DEL QUIZ NO BLOQUEANTE */}
        {isQuizActive && (
          <div className="absolute top-2 left-2 right-2 sm:left-auto sm:right-6 sm:w-96 z-40 animate-fadeIn">
            {isQuizMinimized ? (
              <div className="bg-amber-500 text-white p-2 sm:px-4 rounded-2xl shadow-lg flex items-center justify-between gap-2 border border-amber-600">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-extrabold flex items-center gap-1 shrink-0">
                    <Gamepad2 className="w-4 h-4" />
                    <span>Reto {quizIndex + 1}:</span>
                  </span>
                  <span className="text-xs truncate opacity-95">
                    {activeQuiz.question}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuizMinimized(false)}
                  className="px-2.5 py-1 bg-white text-amber-900 text-xs font-bold rounded-xl shadow-xs shrink-0 hover:bg-amber-50 cursor-pointer flex items-center gap-1"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Responder</span>
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
                      Reto {Math.min(quizIndex + 1, QUIZ_ITEMS.length)} de {QUIZ_ITEMS.length}
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                      {quizScore} Aciertos
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setIsQuizMinimized(true)}
                      className="px-2 py-0.5 rounded-lg text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer text-xs font-bold"
                      title="Minimizar para consultar las capas del atlas"
                    >
                      _
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsQuizActive(false)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Salir del modo juego"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                  {activeQuiz.question}
                </p>

                <p className="text-[11px] text-amber-900/90 bg-amber-50 p-2 rounded-xl border border-amber-200 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Pista:</strong> {activeQuiz.hint}</span>
                </p>

                <div className="grid grid-cols-2 gap-1.5">
                  {ANATOMY_LAYERS.map((layer) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => handleQuizAnswer(layer.id)}
                      className="p-1.5 sm:p-2 text-[11px] sm:text-xs font-bold text-left rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-800 transition-all cursor-pointer truncate"
                    >
                      {layer.id}. {layer.shortName}
                    </button>
                  ))}
                </div>

                {quizFeedback.type === 'success' && (
                  <div className="p-2 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{quizFeedback.text}</span>
                  </div>
                )}
                {quizFeedback.type === 'encouraging' && (
                  <div className="p-2 rounded-xl bg-sky-100 border border-sky-300 text-sky-900 text-xs font-semibold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{quizFeedback.text}</span>
                  </div>
                )}

                <div className="pt-0.5 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setIsQuizMinimized(true)}
                    className="w-full py-1.5 text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Explorar atlas y consultar capas antes de contestar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CONTENEDOR PRINCIPAL DEL VISOR (FLEX-1 FLUIDO, CERO HUECOS, CUERPO COMPLETO DE CABEZA A PIES) */}
        <div className="flex-1 min-h-0 w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto bg-white sm:border-x border-slate-200/90 relative overflow-hidden flex items-center justify-center">
          
          {/* ÁREA DE INTERACCIÓN: GESTOS TÁCTILES Y ARRASTRE */}
          <div
            ref={visorContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => {
              if (activeHotspotKey) setActiveHotspotKey(null);
            }}
            style={{ touchAction: 'none' }}
            className="w-full h-full relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          >
            {/* ESCENARIO ANATÓMICO TRANSFORMADO (ZOOM & PAN SINCRONIZADO CON AIRE EN CABEZA Y PIES) */}
            <div
              style={{
                height: '96%',
                width: 'auto',
                maxWidth: 'none',
                aspectRatio: '2752 / 1536',
                position: 'relative',
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomScale})`,
                transformOrigin: 'center center',
                transition: isInteracting ? 'none' : 'transform 0.15s ease-out'
              }}
              className="flex items-center justify-center"
            >
              {/* CAPA 0 (BASE FIJA): hombre.jpg */}
              <img
                src={BASE_LAYER.fileName}
                alt={BASE_LAYER.name}
                style={{
                  opacity: baseOpacity / 100,
                  zIndex: 0,
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  transition: 'opacity 0.3s ease-in-out'
                }}
                loading="eager"
              />

              {/* CAPAS 1 A 7 SUPERPUESTAS CON FONDO TRANSPARENTE PURO Y OPACIDAD INDIVIDUAL (DEFAULT 70%) */}
              {ANATOMY_LAYERS.map((layer) => {
                const isEnabled = !!activeLayersMap[layer.id];
                const stackIndex = layerStack.indexOf(layer.id);
                const zIndexValue = (stackIndex + 1) * 2;
                const currentSrc = transparentUrls[layer.id] || layer.fileName;
                const currentOpacity = (layerOpacities[layer.id] ?? 70) / 100;

                return (
                  <img
                    key={layer.id}
                    src={currentSrc}
                    alt={layer.name}
                    style={{
                      zIndex: zIndexValue,
                      opacity: isEnabled ? currentOpacity : 0,
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      transition: 'opacity 0.25s ease-in-out'
                    }}
                    loading="eager"
                  />
                );
              })}

              {/* CAPA DE ETIQUETAS ANATÓMICAS INTERACTIVAS CON PINES (HOTSPOTS) */}
              {areLabelsOn && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 25
                  }}
                  className="animate-fadeIn"
                >
                  {displayLabelLayers.map((layerId) => {
                    const labels = ANATOMY_LABELS_MAP[layerId] || [];
                    const sheetMeta = ALL_ACETATE_SHEETS.find((s) => s.id === layerId) || { color: '#6366F1', shortName: 'Atlas' };

                    return labels.map((item, idx) => {
                      const key = `${layerId}-${idx}`;
                      const isSelected = activeHotspotKey === key;

                      return (
                        <div
                          key={key}
                          className="absolute pointer-events-auto"
                          style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: isSelected ? 45 : 30
                          }}
                        >
                          {/* PUNTO INTERACTIVO / PIN LUMINOSO (HOTSPOT) */}
                          <button
                            type="button"
                            data-pin-key={key}
                            onClick={(e) => {
                              e.stopPropagation();
                              playPinSelectSound();
                              setActiveHotspotKey(isSelected ? null : key);
                            }}
                            title={`Toca para explorar: ${item.name}`}
                            className={`relative flex items-center justify-center cursor-pointer transition-all duration-200 outline-hidden ${
                              isSelected ? 'scale-125' : 'hover:scale-125 active:scale-95'
                            }`}
                            style={{ width: '22px', height: '22px' }}
                          >
                            {/* Onda concéntrica pulsante */}
                            <span
                              className="absolute w-full h-full rounded-full opacity-70 animate-ping"
                              style={{ backgroundColor: sheetMeta.color }}
                            ></span>

                            {/* Aro exterior blanco de alto contraste */}
                            <span
                              className="relative flex items-center justify-center w-4 h-4 rounded-full bg-white shadow-md border-2 transition-colors"
                              style={{ borderColor: sheetMeta.color }}
                            >
                              {/* Punto central del color del sistema */}
                              <span
                                className="w-2 h-2 rounded-full transition-transform"
                                style={{
                                  backgroundColor: sheetMeta.color,
                                  transform: isSelected ? 'scale(1.2)' : 'scale(1)'
                                }}
                              ></span>
                            </span>
                          </button>
                        </div>
                      );
                    });
                  })}
                </div>
              )}
            </div>

            {/* CONTROLES FLOTANTES DE ZOOM (HUD EN ESQUINA INFERIOR DERECHA) */}
            <div className="absolute bottom-2.5 right-2.5 z-30 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl sm:rounded-2xl shadow-md border border-slate-200">
              <button
                type="button"
                onClick={handleZoomIn}
                title="Acercar (+)"
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 active:scale-95 transition-all cursor-pointer font-bold"
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              
              <button
                type="button"
                onClick={handleResetZoom}
                title="Reiniciar vista al 100% (o doble toque en pantalla)"
                className="px-1.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 active:scale-95 transition-all cursor-pointer font-bold text-[10px] sm:text-xs whitespace-nowrap flex items-center gap-0.5"
              >
                <span>{Math.round(zoomScale * 100)}%</span>
                {zoomScale !== 1 && <RotateCcw className="w-2.5 h-2.5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleZoomOut}
                title="Alejar (-)"
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 active:scale-95 transition-all cursor-pointer font-bold"
              >
                <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* PANEL DE INFORMACIÓN EXTERNO PARA ETIQUETAS ANATÓMICAS (DESPEJA EL CUERPO AL 100%) */}
        <section className="w-full shrink-0 bg-white border-t border-slate-200/90 px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2 shadow-xs z-25 min-h-[46px] max-w-full">
          {selectedOrganData ? (
            <div className="flex items-center justify-between gap-2 w-full animate-fadeIn max-w-5xl mx-auto">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Badge distintivo del sistema */}
                <span
                  className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-lg shrink-0 flex items-center gap-1 shadow-xs"
                  style={{
                    backgroundColor: `${selectedOrganData.meta.color}15`,
                    color: selectedOrganData.meta.color,
                    border: `1px solid ${selectedOrganData.meta.color}40`
                  }}
                >
                  <span className="text-xs">{selectedOrganData.meta.emoji || '🏷️'}</span>
                  <span>{selectedOrganData.meta.shortName}</span>
                </span>

                {/* Nombre y descripción del órgano */}
                <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-2 leading-tight">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate shrink-0">
                    {selectedOrganData.item.name}:
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-600 line-clamp-1 sm:line-clamp-2 font-medium">
                    {selectedOrganData.item.info}
                  </span>
                </div>
              </div>

              {/* Botón Cerrar */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  setActiveHotspotKey(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 text-xs font-bold leading-none"
                title="Deseleccionar órgano"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full text-slate-500 text-[11px] sm:text-xs px-1 max-w-5xl mx-auto">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-amber-500 font-bold shrink-0">💡</span>
                <span className="truncate font-medium text-slate-600">
                  {areLabelsOn
                    ? 'Toca cualquier pin interactivo sobre el cuerpo para examinar el órgano.'
                    : 'Activa "🏷️ Etiquetas" para ver los puntos interactivos del atlas anatómico.'}
                </span>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-400 shrink-0 bg-slate-100 px-2 py-0.5 rounded-full">
                Vista 100% Despejada
              </span>
            </div>
          )}
        </section>
      </main>

      {/* 3. BARRA INFERIOR: SLIDER BASE Y SELECCIÓN DIRECTA BASADA EN ÍCONOS (CERO SCROLL) */}
      <footer className="h-16 sm:h-18 shrink-0 bg-white border-t border-slate-200 px-2 sm:px-4 py-1 sm:py-1.5 flex flex-col justify-center gap-1 shadow-sm z-20">
        
        {/* Fila 1: Control Deslizante de Intensidad de la Base (0% a 100%) */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span className="text-xs sm:text-sm">👤</span>
            <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
              Base:
            </span>
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

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowZIndexDrawer(true);
            }}
            className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-bold shrink-0 cursor-pointer transition-colors"
            title="Ajustar transparencias individuales de los acetatos (Default 70%)"
          >
            <Sliders className="w-3 h-3 text-indigo-600" />
            <span className="hidden sm:inline">Ajustar Acetatos (70%)</span>
            <span className="sm:hidden">70% Sliders</span>
          </button>
        </div>

        {/* Fila 2: Barra de Selección Directa Basada en Íconos (🦾🫁🫀🍽️🧠🧬🦴) */}
        <div className="flex items-center gap-1 sm:gap-1.5 justify-between overflow-x-hidden">
          {ANATOMY_LAYERS.map((layer) => {
            const isEnabled = !!activeLayersMap[layer.id];
            const currentOp = layerOpacities[layer.id] ?? 70;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => handleToggleLayer(layer.id)}
                className={`flex-1 py-1 sm:py-1.5 px-1 sm:px-1.5 rounded-lg text-center transition-all cursor-pointer truncate flex items-center justify-center gap-1 border ${
                  isEnabled
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-1 ring-slate-800'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title={`${layer.name} (${isEnabled ? `Activa al ${currentOp}%` : 'Inactiva'})`}
              >
                <span className="text-xs sm:text-sm shrink-0 leading-none">{layer.emoji}</span>
                <span className="text-[10px] sm:text-xs font-bold truncate max-w-[48px] sm:max-w-none">
                  {layer.shortName}
                </span>
                {isEnabled && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                    style={{ backgroundColor: layer.color }}
                  ></span>
                )}
              </button>
            );
          })}
        </div>
      </footer>

      {/* 4. MENÚ LATERAL COLAPSABLE (ORDEN Z-INDEX Y ACTIVACIÓN) */}
      {showZIndexDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-sm sm:max-w-md h-full flex flex-col p-4 sm:p-5 shadow-2xl border-l border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                  Acetatos: Opacidad y Z-Index
                </h3>
                <span className="text-[11px] text-slate-500">
                  Sliders independientes (Default 70%) • ▲ / ▼ Reordenar
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowZIndexDrawer(false);
                }}
                className="text-slate-400 hover:text-slate-700 p-1.5 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Presets y selección rápida */}
            <div className="py-2.5 border-b border-slate-100 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Preajustes de Acetato:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSetAllOpacities(70)}
                    className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded hover:bg-indigo-100 cursor-pointer"
                    title="Aplica 70% de opacidad a todos los sistemas"
                  >
                    Estándar 70%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllOpacities(100)}
                    className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded hover:bg-slate-200 cursor-pointer"
                    title="Aplica 100% de opacidad a todos los sistemas"
                  >
                    Opacas 100%
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Selección Rápida:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSelectAllLayers}
                    className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded hover:bg-emerald-100 cursor-pointer"
                  >
                    Activar Todas
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllLayers}
                    className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded hover:bg-slate-200 cursor-pointer"
                  >
                    Apagar Todas
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 py-2.5 pr-1">
              {[...layerStack].reverse().map((layerId) => {
                const layer = ANATOMY_LAYERS.find((l) => l.id === layerId);
                if (!layer) return null;
                const originalIndex = layerStack.indexOf(layerId);
                const isEnabled = !!activeLayersMap[layerId];
                const currentOpacity = layerOpacities[layer.id] ?? 70;

                return (
                  <div
                    key={layer.id}
                    className={`p-3 rounded-2xl border flex flex-col gap-2 transition-all ${
                      isEnabled ? 'bg-indigo-50/70 border-indigo-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    {/* Fila superior: Checkbox, Nombre, Z-Index y Botones Arriba/Abajo */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => handleToggleLayer(layer.id)}
                          className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                        />
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: layer.color }}></span>
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-800 block truncate">{layer.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Z-Index: {(originalIndex + 1) * 2}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(layer.id)}
                          disabled={originalIndex === layerStack.length - 1}
                          className={`p-1 rounded hover:bg-slate-200 text-xs text-slate-700 font-bold cursor-pointer ${
                            originalIndex === layerStack.length - 1 ? 'opacity-30 pointer-events-none' : ''
                          }`}
                          title="Mover capa hacia arriba (al frente)"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(layer.id)}
                          disabled={originalIndex === 0}
                          className={`p-1 rounded hover:bg-slate-200 text-xs text-slate-700 font-bold cursor-pointer ${
                            originalIndex === 0 ? 'opacity-30 pointer-events-none' : ''
                          }`}
                          title="Mover capa hacia abajo (al fondo)"
                        >
                          ▼
                        </button>
                      </div>
                    </div>

                    {/* Fila inferior: Slider individual de opacidad (Default: 70%) */}
                    <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-600">
                          Opacidad de Acetato:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {currentOpacity}%
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateLayerOpacity(layer.id, 70)}
                            title="Restablecer a 70% (valor por defecto)"
                            className="text-[9px] px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded cursor-pointer transition-colors"
                          >
                            70% std
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={currentOpacity}
                        onChange={(e) => handleUpdateLayerOpacity(layer.id, Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowZIndexDrawer(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800"
              >
                Cerrar Menú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SECCIÓN DEDICADA: IMPRESIÓN Y DESCARGA DE ACETATOS */}
      {showAcetateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                    🖨️
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    Impresión y Descarga de Acetatos Anatómicos
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Láminas completas con marcas de registro milimétricas en las 4 esquinas y margen de perforación.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAcetateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 font-bold rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-3 bg-indigo-50/70 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-indigo-900">
                <span className="font-bold">📦 Paquete Completo:</span>
                <span>8 láminas originales en alta definición (2752 × 1536 px)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={isZipping}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all disabled:opacity-60"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{zipStatusText}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintBatch}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Todo el Lote</span>
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-slate-700">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-sky-50/80 p-3 rounded-2xl border border-sky-200">
                  <div className="font-bold text-sky-950 text-xs mb-1 flex items-center gap-1">
                    <span>📄</span> 1. Papel Acetato
                  </div>
                  <p className="text-[11px] text-sky-900/90 leading-relaxed">
                    Imprime en láminas de acetato transparente tamaño carta o A4 para armar el atlas físico escolar.
                  </p>
                </div>
                <div className="bg-indigo-50/80 p-3 rounded-2xl border border-indigo-200">
                  <div className="font-bold text-indigo-950 text-xs mb-1 flex items-center gap-1">
                    <span>✂️</span> 2. Margen de Perforación
                  </div>
                  <p className="text-[11px] text-indigo-900/90 leading-relaxed">
                    La línea vertical punteada en el extremo izquierdo sirve de guía para anillar o perforar sin dañar el cuerpo.
                  </p>
                </div>
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200">
                  <div className="font-bold text-emerald-950 text-xs mb-1 flex items-center gap-1">
                    <span>🎯</span> 3. Cruces de Registro
                  </div>
                  <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                    Al superponer las láminas, haz coincidir exactamente las 4 marcas de cruz para un encaje milimétrico.
                  </p>
                </div>
              </div>

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
                      className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-2.5 hover:border-indigo-300 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                            {sheet.numberLabel}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            2752 × 1536 px
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {sheet.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {sheet.desc}
                        </p>

                        <div className="mt-2 w-full aspect-video rounded-xl bg-slate-50 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                          <img
                            src={sheet.fileName}
                            alt={sheet.name}
                            className="w-full h-full object-contain pointer-events-none"
                          />
                          <span className="absolute bottom-1 right-2 text-[9px] bg-slate-900/70 text-white px-1.5 py-0.5 rounded backdrop-blur-xs font-mono">
                            Con Marcas de Registro
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDownloadSingle(sheet)}
                          className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Descargar lámina JPG individual"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePrintSingle(sheet)}
                          className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Mandar a imprimir únicamente esta lámina"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Imprimir</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Tip: Al imprimir en la impresora escolar, selecciona "Ajustar al área de impresión" y escala al 100%.
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
      <div id="print-staging-area-react" className="hidden"></div>

    </div>
  );
}
