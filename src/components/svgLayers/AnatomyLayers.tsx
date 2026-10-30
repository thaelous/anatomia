import React from 'react';
import { CharacterGender, BodyView, OrganItem } from '../../types/anatomy';

interface LayerProps {
  gender: CharacterGender;
  view: BodyView;
  selectedOrganId?: string | null;
  hintOrganId?: string | null;
  onSelectOrgan?: (organId: string, organName: string) => void;
  showLabels?: boolean;
}

// -------------------------------------------------------------
// CONSTANTES DE REGISTRO ANATÓMICO ESTÁNDAR (viewBox 0 0 500 900)
// Todas las capas se anclan rigurosamente a estas mismas coordenadas
// -------------------------------------------------------------
export const ANATOMY_COORDINATES = {
  head: { cx: 250, cy: 112, rx: 34, ry: 48 },
  neck: { yTop: 158, yBottom: 195, width: 32 },
  shoulders: { y: 205, leftX: 172, rightX: 328 },
  chest: { yTop: 195, yBottom: 330, width: 132 },
  waist: { yTop: 330, yBottom: 420, width: 114 },
  pelvis: { yTop: 420, yBottom: 505, width: 136 },
  arms: {
    left: {
      shoulder: { x: 170, y: 215 },
      elbow: { x: 148, y: 340 },
      wrist: { x: 132, y: 450 },
      palm: { x: 125, y: 510 },
      thumb: { x: 116, y: 480 } // Palma al frente -> pulgar hacia afuera
    },
    right: {
      shoulder: { x: 330, y: 215 },
      elbow: { x: 352, y: 340 },
      wrist: { x: 368, y: 450 },
      palm: { x: 375, y: 510 },
      thumb: { x: 384, y: 480 } // Palma al frente -> pulgar hacia afuera
    }
  },
  legs: {
    left: {
      hip: { x: 215, y: 505 },
      knee: { x: 215, y: 665 },
      ankle: { x: 210, y: 795 },
      foot: { x: 205, y: 855 }
    },
    right: {
      hip: { x: 285, y: 505 },
      knee: { x: 285, y: 665 },
      ankle: { x: 290, y: 795 },
      foot: { x: 295, y: 855 }
    }
  }
};

/**
 * Silueta guía base transparente / fantasma para verificar registro anatómico
 */
export const BodyGhostSilhouette: React.FC<{ gender: CharacterGender; view: BodyView }> = ({ gender, view }) => {
  return (
    <g id="body_ghost_silhouette" opacity="0.12" className="pointer-events-none">
      <path
        d="M250,64 C225,64 212,85 212,112 C212,142 226,160 234,166 L234,196 C190,202 166,218 166,238 L144,345 L128,455 L120,518 C116,522 120,530 126,526 L138,465 L156,360 L174,270 C174,340 186,430 182,505 L196,665 L192,795 L182,855 C182,862 225,862 224,855 L228,795 L232,665 L242,525 C246,525 254,525 258,525 L268,665 L272,795 L276,855 C275,862 318,862 318,855 L308,795 L304,665 L318,505 C314,430 326,340 326,270 L344,360 L362,465 L374,526 C380,530 384,522 380,518 L372,455 L356,345 L334,238 C334,218 310,202 266,196 L266,166 C274,160 288,142 288,112 C288,85 275,64 250,64 Z"
        fill="none"
        stroke="#64748B"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
    </g>
  );
};

// =============================================================
// CAPA 1: CUERPO COMPLETO (PIEL / EXTERIOR)
// =============================================================
export const Layer1Skin: React.FC<LayerProps> = ({
  gender,
  view,
  selectedOrganId,
  hintOrganId,
  onSelectOrgan
}) => {
  const isSelected = (id: string) => selectedOrganId === id;
  const isHinted = (id: string) => hintOrganId === id;

  const skinColor = '#FAD9C1';
  const skinShadow = '#E8B999';
  const skinStroke = '#C89372';
  const hairColor = '#3D2817';
  const clothingColor = gender === 'hombre' ? '#3B82F6' : '#EC4899';

  return (
    <g id="layer_1_skin" className="transition-opacity duration-500">
      <defs>
        <radialGradient id="skinGrad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFF2E7" />
          <stop offset="60%" stopColor={skinColor} />
          <stop offset="100%" stopColor={skinShadow} />
        </radialGradient>
        <linearGradient id="clothingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={clothingColor} />
          <stop offset="100%" stopColor={gender === 'hombre' ? '#1D4ED8' : '#BE185D'} />
        </linearGradient>
      </defs>

      {/* BRAZOS (PALMAS HACIA EL FRENTE) */}
      <g
        id="piel_brazos"
        data-name="Brazos y Manos"
        className={`interactive-organ ${isSelected('piel_brazos') ? 'is-selected' : ''} ${isHinted('piel_brazos') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('piel_brazos', 'Brazos y Manos')}
      >
        {/* Brazo Izquierdo (hombro -> codo -> muñeca -> mano con palma al frente) */}
        <path
          d="M174,215 C160,225 150,280 148,340 C146,395 138,445 132,455 C124,468 112,482 116,495 C120,500 125,492 128,485 L124,528 C128,534 135,532 136,525 L138,472 L148,375 L162,280 L176,235 Z"
          fill="url(#skinGrad)"
          stroke={skinStroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Brazo Derecho */}
        <path
          d="M326,215 C340,225 350,280 352,340 C354,395 362,445 368,455 C376,468 388,482 384,495 C380,500 375,492 372,485 L376,528 C372,534 365,532 364,525 L362,472 L352,375 L338,280 L324,235 Z"
          fill="url(#skinGrad)"
          stroke={skinStroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Pliegues de codos y muñecas */}
        {view === 'frente' ? (
          <>
            <path d="M145,340 Q150,344 156,339" stroke={skinStroke} strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M355,340 Q350,344 344,339" stroke={skinStroke} strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M130,455 Q135,458 139,455" stroke={skinStroke} strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M370,455 Q365,458 361,455" stroke={skinStroke} strokeWidth="0.8" fill="none" opacity="0.6" />
          </>
        ) : (
          <>
            <path d="M146,340 Q150,336 154,340" stroke={skinStroke} strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M354,340 Q350,336 346,340" stroke={skinStroke} strokeWidth="1" fill="none" opacity="0.6" />
          </>
        )}
      </g>

      {/* PIERNAS Y PIES */}
      <g
        id="piel_piernas"
        data-name="Piernas y Pies"
        className={`interactive-organ ${isSelected('piel_piernas') ? 'is-selected' : ''} ${isHinted('piel_piernas') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('piel_piernas', 'Piernas y Pies')}
      >
        {/* Pierna Izquierda */}
        <path
          d="M185,500 C182,550 190,620 194,665 C196,715 190,770 190,795 C190,810 182,845 180,855 C180,865 224,865 224,855 C224,845 226,810 226,795 C226,765 230,715 232,665 C236,610 242,545 244,520 L230,500 Z"
          fill="url(#skinGrad)"
          stroke={skinStroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Pierna Derecha */}
        <path
          d="M315,500 C318,550 310,620 306,665 C304,715 310,770 310,795 C310,810 318,845 320,855 C320,865 276,865 276,855 C276,845 274,810 274,795 C274,765 270,715 268,665 C264,610 258,545 256,520 L270,500 Z"
          fill="url(#skinGrad)"
          stroke={skinStroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Detalles rodillas y tobillos */}
        {view === 'frente' && (
          <>
            <ellipse cx="213" cy="668" rx="8" ry="6" fill="none" stroke={skinStroke} strokeWidth="0.8" opacity="0.6" />
            <ellipse cx="287" cy="668" rx="8" ry="6" fill="none" stroke={skinStroke} strokeWidth="0.8" opacity="0.6" />
            <path d="M190,800 Q194,803 198,800" stroke={skinStroke} strokeWidth="0.8" fill="none" opacity="0.6" />
            <path d="M310,800 Q306,803 302,800" stroke={skinStroke} strokeWidth="0.8" fill="none" opacity="0.6" />
          </>
        )}
      </g>

      {/* TORSO Y CUELLO */}
      <g
        id="piel_torso"
        data-name="Tórax y Abdomen"
        className={`interactive-organ ${isSelected('piel_torso') ? 'is-selected' : ''} ${isHinted('piel_torso') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('piel_torso', 'Tórax y Abdomen')}
      >
        {/* Cuello y Torso Silueta */}
        <path
          d="M234,166 L234,196 C195,202 174,222 174,270 C174,340 184,420 182,505 L244,520 L256,520 L318,505 C316,420 326,340 326,270 C326,222 305,202 266,196 L266,166 Z"
          fill="url(#skinGrad)"
          stroke={skinStroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Ropa interior pedagógica adaptada a niños */}
        {gender === 'hombre' ? (
          <path
            d="M188,445 C190,480 186,505 186,505 L236,515 L264,515 L314,505 C314,505 310,480 312,445 C275,450 225,450 188,445 Z"
            fill="url(#clothingGrad)"
            stroke={clothingColor}
            strokeWidth="1"
          />
        ) : (
          <>
            {/* Top y short infantil */}
            <path
              d="M180,265 C180,310 215,315 250,315 C285,315 320,310 320,265 C305,250 275,255 250,255 C225,255 195,250 180,265 Z"
              fill="url(#clothingGrad)"
              stroke={clothingColor}
              strokeWidth="1"
            />
            <path
              d="M188,445 C190,480 186,505 186,505 L236,515 L264,515 L314,505 C314,505 310,480 312,445 C275,450 225,450 188,445 Z"
              fill="url(#clothingGrad)"
              stroke={clothingColor}
              strokeWidth="1"
            />
          </>
        )}

        {/* Detalles frontales vs espalda */}
        {view === 'frente' ? (
          <>
            {/* Clavículas */}
            <path d="M210,210 Q235,215 248,220" stroke={skinStroke} strokeWidth="1" fill="none" opacity="0.6" />
            <path d="M290,210 Q265,215 252,220" stroke={skinStroke} strokeWidth="1" fill="none" opacity="0.6" />
            {/* Ombligo */}
            <circle cx="250" cy="390" r="2.2" fill={skinStroke} opacity="0.7" />
          </>
        ) : (
          <>
            {/* Línea suave de columna y escápulas */}
            <line x1="250" y1="200" x2="250" y2="440" stroke={skinStroke} strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
            <path d="M205,235 Q220,240 225,270" stroke={skinStroke} strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M295,235 Q280,240 275,270" stroke={skinStroke} strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M235,465 Q250,475 265,465" stroke={skinStroke} strokeWidth="1.2" fill="none" opacity="0.6" />
          </>
        )}
      </g>

      {/* CABEZA Y ROSTRO */}
      <g
        id="piel_cabeza"
        data-name="Cabeza y Rostro"
        className={`interactive-organ ${isSelected('piel_cabeza') ? 'is-selected' : ''} ${isHinted('piel_cabeza') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('piel_cabeza', 'Cabeza y Rostro')}
      >
        {/* Contorno cráneo */}
        <ellipse cx="250" cy="112" rx="36" ry="46" fill="url(#skinGrad)" stroke={skinStroke} strokeWidth="1.5" />
        
        {/* Orejas */}
        <ellipse cx="213" cy="115" rx="5" ry="10" fill={skinColor} stroke={skinStroke} strokeWidth="1" />
        <ellipse cx="287" cy="115" rx="5" ry="10" fill={skinColor} stroke={skinStroke} strokeWidth="1" />

        {view === 'frente' ? (
          <>
            {/* Cabello frente */}
            {gender === 'hombre' ? (
              <path
                d="M214,105 C214,75 230,66 250,66 C270,66 286,75 286,105 C282,90 268,84 250,86 C232,84 218,90 214,105 Z"
                fill={hairColor}
              />
            ) : (
              <path
                d="M212,112 C212,75 228,64 250,64 C272,64 288,75 288,112 C285,88 275,80 250,80 C225,80 215,88 212,112 Z"
                fill={hairColor}
              />
            )}
            {/* Ojos serios/neutros pedagógicos */}
            <ellipse cx="236" cy="110" rx="3.5" ry="2.2" fill="#2D3748" />
            <ellipse cx="264" cy="110" rx="3.5" ry="2.2" fill="#2D3748" />
            <circle cx="237" cy="109" r="0.8" fill="#FFF" />
            <circle cx="265" cy="109" r="0.8" fill="#FFF" />
            {/* Cejas neutras */}
            <path d="M228,103 Q236,101 243,103" stroke={hairColor} strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M257,103 Q264,101 272,103" stroke={hairColor} strokeWidth="1.4" fill="none" strokeLinecap="round" />
            {/* Nariz */}
            <path d="M250,110 L248,124 L252,124" stroke={skinStroke} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* Boca expresión neutra y serena */}
            <path d="M242,138 Q250,139 258,138" stroke="#B91C1C" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.75" />
          </>
        ) : (
          /* Vista trasera (cabello occipital) */
          <path
            d="M214,120 C212,70 230,64 250,64 C270,64 288,70 286,120 C280,140 268,155 250,155 C232,155 220,140 214,120 Z"
            fill={hairColor}
          />
        )}
      </g>
    </g>
  );
};

// =============================================================
// CAPA 2: SISTEMA MUSCULAR
// =============================================================
export const Layer2Muscular: React.FC<LayerProps> = ({
  selectedOrganId,
  hintOrganId,
  onSelectOrgan,
  view
}) => {
  const isSelected = (id: string) => selectedOrganId === id;
  const isHinted = (id: string) => hintOrganId === id;

  const muscleColor = '#DC2626';
  const muscleFiber = '#EF4444';
  const tendonColor = '#E2E8F0';

  return (
    <g id="layer_2_muscular" className="transition-opacity duration-500">
      {/* Base muscular de cabeza y cuello */}
      <g opacity="0.85">
        <ellipse cx="250" cy="112" rx="34" ry="44" fill="#B91C1C" opacity="0.5" />
        {/* Esternocleidomastoideo */}
        <path d="M236,166 L242,196 L248,196 L240,166 Z" fill={muscleColor} />
        <path d="M264,166 L258,196 L252,196 L260,166 Z" fill={muscleColor} />
      </g>

      {/* DELTOIDES (HOMBROS) */}
      <g
        id="musculo_deltoides"
        data-name="Deltoides"
        className={`interactive-organ ${isSelected('musculo_deltoides') ? 'is-selected' : ''} ${isHinted('musculo_deltoides') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('musculo_deltoides', 'Deltoides (Hombros)')}
      >
        <path d="M174,212 C162,225 158,255 168,270 C172,260 176,235 186,220 Z" fill={muscleColor} stroke="#991B1B" strokeWidth="1" />
        <path d="M326,212 C338,225 342,255 332,270 C328,260 324,235 314,220 Z" fill={muscleColor} stroke="#991B1B" strokeWidth="1" />
      </g>

      {/* PECTORALES / TRAPECIO (SEGÚN VISTA) */}
      <g
        id="musculo_pectoral"
        data-name="Pectorales"
        className={`interactive-organ ${isSelected('musculo_pectoral') ? 'is-selected' : ''} ${isHinted('musculo_pectoral') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('musculo_pectoral', view === 'frente' ? 'Músculos Pectorales' : 'Músculo Dorsal y Trapecio')}
      >
        {view === 'frente' ? (
          <>
            {/* Pectoral Mayor Izquierdo */}
            <path
              d="M186,222 C196,220 246,220 247,235 C247,275 220,290 180,280 C175,260 176,240 186,222 Z"
              fill={muscleFiber}
              stroke="#B91C1C"
              strokeWidth="1.2"
            />
            {/* Pectoral Mayor Derecho */}
            <path
              d="M314,222 C304,220 254,220 253,235 C253,275 280,290 320,280 C325,260 324,240 314,222 Z"
              fill={muscleFiber}
              stroke="#B91C1C"
              strokeWidth="1.2"
            />
            {/* Líneas de fibra pectoral */}
            <path d="M190,235 Q220,240 240,242" stroke="#FCA5A5" strokeWidth="0.8" fill="none" opacity="0.7" />
            <path d="M185,255 Q215,258 238,260" stroke="#FCA5A5" strokeWidth="0.8" fill="none" opacity="0.7" />
            <path d="M310,235 Q280,240 260,242" stroke="#FCA5A5" strokeWidth="0.8" fill="none" opacity="0.7" />
            <path d="M315,255 Q285,258 262,260" stroke="#FCA5A5" strokeWidth="0.8" fill="none" opacity="0.7" />
          </>
        ) : (
          /* Vista posterior: Dorsales y Trapecio */
          <>
            <path
              d="M234,196 L250,230 L266,196 C290,210 320,225 315,280 C290,295 270,330 250,335 C230,330 210,295 185,280 C180,225 210,210 234,196 Z"
              fill={muscleColor}
              stroke="#991B1B"
              strokeWidth="1.2"
            />
          </>
        )}
      </g>

      {/* BÍCEPS BRAQUIAL */}
      <g
        id="musculo_biceps"
        data-name="Bíceps"
        className={`interactive-organ ${isSelected('musculo_biceps') ? 'is-selected' : ''} ${isHinted('musculo_biceps') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('musculo_biceps', 'Bíceps Braquial')}
      >
        <path d="M168,272 C158,285 152,320 150,345 C154,345 166,325 174,295 Z" fill={muscleColor} stroke="#991B1B" strokeWidth="1" />
        <path d="M332,272 C342,285 348,320 350,345 C346,345 334,325 326,295 Z" fill={muscleColor} stroke="#991B1B" strokeWidth="1" />
        {/* Antebrazo y tendones */}
        <path d="M150,350 C144,385 138,435 134,450 C138,450 148,410 156,365 Z" fill={muscleFiber} opacity="0.9" />
        <path d="M350,350 C356,385 362,435 366,450 C362,450 352,410 344,365 Z" fill={muscleFiber} opacity="0.9" />
      </g>

      {/* RECTO ABDOMINAL (SIX PACK) Y OBLICUOS */}
      <g
        id="musculo_abdominales"
        data-name="Recto Abdominal"
        className={`interactive-organ ${isSelected('musculo_abdominales') ? 'is-selected' : ''} ${isHinted('musculo_abdominales') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('musculo_abdominales', 'Recto Abdominal')}
      >
        {view === 'frente' ? (
          <>
            {/* Cuadrículas simétricas de abdominales */}
            {[
              { y: 295, h: 26 },
              { y: 326, h: 28 },
              { y: 358, h: 30 },
              { y: 392, h: 34 }
            ].map((row, idx) => (
              <g key={idx}>
                {/* Abdominal izquierdo */}
                <rect x="226" y={row.y} width="21" height={row.h} rx="4" fill={muscleFiber} stroke="#991B1B" strokeWidth="0.8" />
                {/* Abdominal derecho */}
                <rect x="253" y={row.y} width="21" height={row.h} rx="4" fill={muscleFiber} stroke="#991B1B" strokeWidth="0.8" />
              </g>
            ))}
            {/* Línea alba central (tendón blanco fibroso) */}
            <line x1="250" y1="290" x2="250" y2="435" stroke={tendonColor} strokeWidth="1.5" opacity="0.85" />
            {/* Oblicuos laterales */}
            <path d="M192,305 C192,360 200,410 218,435 L224,430 C208,405 204,360 206,310 Z" fill={muscleColor} opacity="0.85" />
            <path d="M308,305 C308,360 300,410 282,435 L276,430 C292,405 296,360 294,310 Z" fill={muscleColor} opacity="0.85" />
          </>
        ) : (
          /* Músculos lumbares y glúteos en vista posterior */
          <>
            <path d="M228,340 L248,340 L248,435 L224,430 Z" fill={muscleColor} opacity="0.9" />
            <path d="M272,340 L252,340 L252,435 L276,430 Z" fill={muscleColor} opacity="0.9" />
            {/* Glúteos mayores */}
            <path d="M190,445 C190,505 240,515 248,485 C248,445 220,440 190,445 Z" fill={muscleFiber} stroke="#991B1B" strokeWidth="1" />
            <path d="M310,445 C310,505 260,515 252,485 C252,445 280,440 310,445 Z" fill={muscleFiber} stroke="#991B1B" strokeWidth="1" />
          </>
        )}
      </g>

      {/* CUÁDRICEPS FEMORAL */}
      <g
        id="musculo_cuadriceps"
        data-name="Cuádriceps"
        className={`interactive-organ ${isSelected('musculo_cuadriceps') ? 'is-selected' : ''} ${isHinted('musculo_cuadriceps') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('musculo_cuadriceps', 'Cuádriceps Femoral')}
      >
        {/* Muslo Izquierdo */}
        <path
          d="M190,505 C186,550 196,620 205,655 C215,655 228,645 235,620 C242,570 244,535 242,510 Z"
          fill={muscleFiber}
          stroke="#991B1B"
          strokeWidth="1.2"
        />
        {/* Recto femoral central izquierdo */}
        <path d="M208,515 C205,560 210,615 215,650 C220,615 224,560 222,515 Z" fill="#EF4444" opacity="0.95" />

        {/* Muslo Derecho */}
        <path
          d="M310,505 C314,550 304,620 295,655 C285,655 272,645 265,620 C258,570 256,535 258,510 Z"
          fill={muscleFiber}
          stroke="#991B1B"
          strokeWidth="1.2"
        />
        {/* Recto femoral central derecho */}
        <path d="M292,515 C295,560 290,615 285,650 C280,615 276,560 278,515 Z" fill="#EF4444" opacity="0.95" />

        {/* Tendón rotuliano blanco */}
        <rect x="209" y="658" width="12" height="10" rx="3" fill={tendonColor} stroke="#94A3B8" strokeWidth="0.8" />
        <rect x="279" y="658" width="12" height="10" rx="3" fill={tendonColor} stroke="#94A3B8" strokeWidth="0.8" />
      </g>

      {/* GEMELOS (GASTROCNEMIOS) Y TIBIAL */}
      <g
        id="musculo_gemelos"
        data-name="Gemelos"
        className={`interactive-organ ${isSelected('musculo_gemelos') ? 'is-selected' : ''} ${isHinted('musculo_gemelos') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('musculo_gemelos', 'Gemelos (Gastrocnemios)')}
      >
        {/* Pantorrilla Izquierda */}
        <path
          d="M198,675 C192,710 194,760 205,790 C214,790 224,760 224,710 C224,685 215,675 198,675 Z"
          fill={muscleFiber}
          stroke="#991B1B"
          strokeWidth="1"
        />
        {/* Pantorrilla Derecha */}
        <path
          d="M302,675 C308,710 306,760 295,790 C286,790 276,760 276,710 C276,685 285,675 302,675 Z"
          fill={muscleFiber}
          stroke="#991B1B"
          strokeWidth="1"
        />
        {/* Tendón de Aquiles hacia el talón */}
        <rect x="206" y="792" width="8" height="24" rx="2" fill={tendonColor} stroke="#94A3B8" strokeWidth="0.7" />
        <rect x="286" y="792" width="8" height="24" rx="2" fill={tendonColor} stroke="#94A3B8" strokeWidth="0.7" />
      </g>
    </g>
  );
};

// =============================================================
// CAPA 3: APARATO RESPIRATORIO
// =============================================================
export const Layer3Respiratory: React.FC<LayerProps> = ({
  selectedOrganId,
  hintOrganId,
  onSelectOrgan
}) => {
  const isSelected = (id: string) => selectedOrganId === id;
  const isHinted = (id: string) => hintOrganId === id;

  const lungLeftColor = '#38BDF8';
  const lungRightColor = '#0EA5E9';
  const tracheaColor = '#E0F2FE';
  const tracheaBorder = '#0284C7';

  return (
    <g id="layer_3_respiratory" className="transition-opacity duration-500">
      {/* Vías aéreas superiores (nariz, laringe, tráquea) */}
      <g
        id="resp_nariz_traquea"
        data-name="Tráquea y Laringe"
        className={`interactive-organ ${isSelected('resp_nariz_traquea') ? 'is-selected' : ''} ${isHinted('resp_nariz_traquea') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('resp_nariz_traquea', 'Tráquea y Laringe')}
      >
        {/* Laringe */}
        <path d="M243,165 L257,165 L255,185 L245,185 Z" fill="#BAE6FD" stroke={tracheaBorder} strokeWidth="1.2" />
        {/* Tráquea con anillos cartilaginosos */}
        <rect x="245" y="185" width="10" height="50" rx="3" fill={tracheaColor} stroke={tracheaBorder} strokeWidth="1.2" />
        {[192, 198, 204, 210, 216, 222, 228].map((y, i) => (
          <line key={i} x1="245" y1={y} x2="255" y2={y} stroke={tracheaBorder} strokeWidth="1.2" />
        ))}
      </g>

      {/* ÁRBOL BRONQUIAL (RAMIFICACIONES) */}
      <g
        id="resp_bronquios"
        data-name="Árbol Bronquial"
        className={`interactive-organ ${isSelected('resp_bronquios') ? 'is-selected' : ''} ${isHinted('resp_bronquios') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('resp_bronquios', 'Árbol Bronquial')}
      >
        {/* Bronquio principal derecho e izquierdo */}
        <path d="M250,235 L228,252 L215,268" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M250,235 L272,252 L285,268" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Ramas secundarias */}
        <path d="M228,252 L220,285" stroke="#0284C7" strokeWidth="1.8" fill="none" />
        <path d="M228,252 L234,280" stroke="#0284C7" strokeWidth="1.5" fill="none" />
        <path d="M215,268 L206,290" stroke="#0284C7" strokeWidth="1.2" fill="none" />
        <path d="M272,252 L280,285" stroke="#0284C7" strokeWidth="1.8" fill="none" />
        <path d="M272,252 L266,280" stroke="#0284C7" strokeWidth="1.5" fill="none" />
        <path d="M285,268 L294,290" stroke="#0284C7" strokeWidth="1.2" fill="none" />
      </g>

      {/* PULMÓN DERECHO (3 LÓBULOS) */}
      <g
        id="resp_pulmon_derecho"
        data-name="Pulmón Derecho"
        className={`interactive-organ ${isSelected('resp_pulmon_derecho') ? 'is-selected' : ''} ${isHinted('resp_pulmon_derecho') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('resp_pulmon_derecho', 'Pulmón Derecho (3 Lóbulos)')}
      >
        <path
          d="M242,236 C238,220 215,225 204,242 C192,260 190,305 194,325 C202,332 232,330 240,320 C244,300 245,260 242,236 Z"
          fill={lungRightColor}
          stroke="#0369A1"
          strokeWidth="1.4"
          fillOpacity="0.88"
        />
        {/* Fisuras de los 3 lóbulos */}
        <path d="M193,275 Q215,280 243,272" stroke="#0369A1" strokeWidth="1" fill="none" strokeDasharray="2 2" />
        <path d="M198,302 Q220,305 241,300" stroke="#0369A1" strokeWidth="1" fill="none" strokeDasharray="2 2" />
      </g>

      {/* PULMÓN IZQUIERDO (2 LÓBULOS CON ESCOTADURA CARDÍACA) */}
      <g
        id="resp_pulmon_izquierdo"
        data-name="Pulmón Izquierdo"
        className={`interactive-organ ${isSelected('resp_pulmon_izquierdo') ? 'is-selected' : ''} ${isHinted('resp_pulmon_izquierdo') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('resp_pulmon_izquierdo', 'Pulmón Izquierdo (2 Lóbulos)')}
      >
        {/* Hueco para el corazón (escotadura cardíaca) */}
        <path
          d="M258,236 C262,220 285,225 296,242 C308,260 310,305 306,325 C298,332 272,330 266,320 C262,305 252,295 252,275 C252,260 256,245 258,236 Z"
          fill={lungLeftColor}
          stroke="#0284C7"
          strokeWidth="1.4"
          fillOpacity="0.88"
        />
        {/* Fisura oblicua (2 lóbulos) */}
        <path d="M296,268 Q280,285 264,312" stroke="#0284C7" strokeWidth="1" fill="none" strokeDasharray="2 2" />
      </g>

      {/* MÚSCULO DIAFRAGMA */}
      <g
        id="resp_diafragma"
        data-name="Diafragma"
        className={`interactive-organ ${isSelected('resp_diafragma') ? 'is-selected' : ''} ${isHinted('resp_diafragma') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('resp_diafragma', 'Músculo Diafragma')}
      >
        <path
          d="M188,335 C205,320 235,322 250,326 C265,322 295,320 312,335 C305,346 270,344 250,346 C230,344 195,346 188,335 Z"
          fill="#38BDF8"
          stroke="#0284C7"
          strokeWidth="1.5"
        />
        <text x="250" y="340" fill="#0C4A6E" fontSize="7" fontWeight="bold" textAnchor="middle">
          DIAFRAGMA
        </text>
      </g>
    </g>
  );
};

// =============================================================
// CAPA 4: SISTEMA CIRCULATORIO
// =============================================================
export const Layer4Circulatory: React.FC<LayerProps> = ({
  selectedOrganId,
  hintOrganId,
  onSelectOrgan
}) => {
  const isSelected = (id: string) => selectedOrganId === id;
  const isHinted = (id: string) => hintOrganId === id;

  const redArtery = '#DC2626';
  const blueVein = '#2563EB';

  return (
    <g id="layer_4_circulatory" className="transition-opacity duration-500">
      {/* RED VASCULAR COMPLETA (ARTERIAS EN ROJO, VENAS EN AZUL) */}
      
      {/* Vasos de Cabeza y Cuello (Carótidas y Yugulares) */}
      <g>
        {/* Arterias Carótidas (Rojas) */}
        <path d="M246,230 L242,160 L238,105" stroke={redArtery} strokeWidth="2.4" fill="none" />
        <path d="M254,230 L258,160 L262,105" stroke={redArtery} strokeWidth="2.4" fill="none" />
        {/* Venas Yugulares (Azules) */}
        <path d="M236,230 L234,160 L230,105" stroke={blueVein} strokeWidth="2.4" fill="none" />
        <path d="M264,230 L266,160 L270,105" stroke={blueVein} strokeWidth="2.4" fill="none" />
      </g>

      {/* VASOS DE LOS BRAZOS */}
      <g
        id="circ_vasos_brazos"
        data-name="Vasos de Brazos"
        className={`interactive-organ ${isSelected('circ_vasos_brazos') ? 'is-selected' : ''} ${isHinted('circ_vasos_brazos') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('circ_vasos_brazos', 'Vasos Braquiales')}
      >
        {/* Brazo Izquierdo */}
        <path d="M236,235 C205,235 170,245 155,340 C146,395 138,445 132,490" stroke={redArtery} strokeWidth="2.2" fill="none" />
        <path d="M234,242 C205,242 165,252 150,340 C142,395 134,445 128,490" stroke={blueVein} strokeWidth="2.2" fill="none" />
        {/* Brazo Derecho */}
        <path d="M264,235 C295,235 330,245 345,340 C354,395 362,445 368,490" stroke={redArtery} strokeWidth="2.2" fill="none" />
        <path d="M266,242 C295,242 335,252 350,340 C358,395 366,445 372,490" stroke={blueVein} strokeWidth="2.2" fill="none" />
      </g>

      {/* VASOS CENTRALES: AORTA ABDOMINAL Y VENA CAVA INFERIOR */}
      <g
        id="circ_aorta"
        data-name="Arteria Aorta"
        className={`interactive-organ ${isSelected('circ_aorta') ? 'is-selected' : ''} ${isHinted('circ_aorta') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('circ_aorta', 'Arteria Aorta')}
      >
        {/* Cayado de la aorta */}
        <path d="M252,255 C252,230 238,230 244,245 L244,445" stroke={redArtery} strokeWidth="4.2" fill="none" strokeLinecap="round" />
      </g>

      <g
        id="circ_venas"
        data-name="Venas Cavas"
        className={`interactive-organ ${isSelected('circ_venas') ? 'is-selected' : ''} ${isHinted('circ_venas') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('circ_venas', 'Venas Cavas')}
      >
        <path d="M256,220 L256,255 L256,445" stroke={blueVein} strokeWidth="4.2" fill="none" strokeLinecap="round" />
      </g>

      {/* EL CORAZÓN */}
      <g
        id="circ_corazon"
        data-name="El Corazón"
        className={`interactive-organ ${isSelected('circ_corazon') ? 'is-selected' : ''} ${isHinted('circ_corazon') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('circ_corazon', 'El Corazón')}
      >
        {/* Sombra / base del corazón */}
        <path
          d="M245,252 C240,245 230,248 230,260 C230,278 245,295 258,305 C270,292 280,275 278,260 C276,245 264,245 258,252 Z"
          fill="#991B1B"
        />
        {/* Músculo cardíaco principal con ventrículos */}
        <path
          d="M246,254 C238,248 232,255 232,266 C232,284 248,298 258,304 C268,296 276,282 276,266 C276,252 266,248 258,256 C255,252 248,248 246,254 Z"
          fill="#E11D48"
          stroke="#881337"
          strokeWidth="1.4"
        />
        {/* Aurículas superiores */}
        <ellipse cx="242" cy="254" rx="7" ry="5" fill="#BE123C" />
        <ellipse cx="266" cy="254" rx="7" ry="5" fill="#1D4ED8" />
        {/* Pulsación o brillo */}
        <circle cx="250" cy="270" r="3" fill="#FDA4AF" opacity="0.6" />
      </g>

      {/* VASOS DE LAS PIERNAS (FEMORALES Y TIBIALES) */}
      <g
        id="circ_vasos_piernas"
        data-name="Vasos Femorales"
        className={`interactive-organ ${isSelected('circ_vasos_piernas') ? 'is-selected' : ''} ${isHinted('circ_vasos_piernas') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('circ_vasos_piernas', 'Vasos Femorales')}
      >
        {/* Pierna Izquierda */}
        <path d="M244,445 L220,510 L212,665 L210,795 L204,850" stroke={redArtery} strokeWidth="2.5" fill="none" />
        <path d="M254,445 L228,510 L218,665 L216,795 L210,850" stroke={blueVein} strokeWidth="2.5" fill="none" />
        {/* Pierna Derecha */}
        <path d="M244,445 L280,510 L288,665 L290,795 L296,850" stroke={redArtery} strokeWidth="2.5" fill="none" />
        <path d="M256,445 L272,510 L282,665 L284,795 L290,850" stroke={blueVein} strokeWidth="2.5" fill="none" />
      </g>
    </g>
  );
};

// =============================================================
// CAPA 5: APARATO DIGESTIVO
// =============================================================
export const Layer5Digestive: React.FC<LayerProps> = ({
  selectedOrganId,
  hintOrganId,
  onSelectOrgan
}) => {
  const isSelected = (id: string) => selectedOrganId === id;
  const isHinted = (id: string) => hintOrganId === id;

  return (
    <g id="layer_5_digestive" className="transition-opacity duration-500">
      {/* ESÓFAGO */}
      <g
        id="dig_esofago"
        data-name="Esófago"
        className={`interactive-organ ${isSelected('dig_esofago') ? 'is-selected' : ''} ${isHinted('dig_esofago') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('dig_esofago', 'Esófago')}
      >
        <path d="M250,140 L250,270" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
        <path d="M250,140 L250,270" stroke="#B45309" strokeWidth="1" strokeDasharray="3 3" fill="none" />
      </g>

      {/* HÍGADO (LADO DERECHO DEL CUERPO / IZQUIERDO DEL VISOR) */}
      <g
        id="dig_higado"
        data-name="Hígado"
        className={`interactive-organ ${isSelected('dig_higado') ? 'is-selected' : ''} ${isHinted('dig_higado') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('dig_higado', 'Hígado')}
      >
        <path
          d="M205,285 C205,270 248,272 260,285 C264,305 258,335 240,338 C215,340 205,320 205,285 Z"
          fill="#B45309"
          stroke="#78350F"
          strokeWidth="1.4"
        />
        {/* Vesícula Biliar verde */}
        <ellipse cx="236" cy="334" rx="4" ry="6" fill="#15803D" stroke="#166534" strokeWidth="0.8" />
      </g>

      {/* ESTÓMAGO (EN FORMA DE J) */}
      <g
        id="dig_estomago"
        data-name="Estómago"
        className={`interactive-organ ${isSelected('dig_estomago') ? 'is-selected' : ''} ${isHinted('dig_estomago') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('dig_estomago', 'Estómago')}
      >
        <path
          d="M252,270 C270,270 290,285 290,310 C290,335 272,345 255,340 C242,336 244,310 248,295 C250,280 248,272 252,270 Z"
          fill="#F59E0B"
          stroke="#B45309"
          strokeWidth="1.4"
        />
        {/* Pliegues rugosos gástricos */}
        <path d="M260,290 Q275,305 270,325" stroke="#D97706" strokeWidth="1" fill="none" opacity="0.6" />
      </g>

      {/* PÁNCREAS */}
      <g
        id="dig_pancreas"
        data-name="Páncreas"
        className={`interactive-organ ${isSelected('dig_pancreas') ? 'is-selected' : ''} ${isHinted('dig_pancreas') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('dig_pancreas', 'Páncreas')}
      >
        <path
          d="M238,336 C255,332 280,334 286,346 C280,352 255,350 238,344 Z"
          fill="#FDE047"
          stroke="#CA8A04"
          strokeWidth="1.2"
        />
      </g>

      {/* INTESTINO GRUESO (COLON ASCENDENTE, TRANSVERSO, DESCENDENTE) */}
      <g
        id="dig_intestino_grueso"
        data-name="Intestino Grueso"
        className={`interactive-organ ${isSelected('dig_intestino_grueso') ? 'is-selected' : ''} ${isHinted('dig_intestino_grueso') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('dig_intestino_grueso', 'Intestino Grueso (Colon)')}
      >
        {/* Colon marco perimetral con abolladuras haustras */}
        <path
          d="M214,440 L214,352 C214,342 225,338 235,338 L265,338 C275,338 286,342 286,352 L286,445 C286,455 272,465 264,465 L260,490 L250,490 L250,465"
          fill="none"
          stroke="#D97706"
          strokeWidth="12"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Textura interior de haustras */}
        <path
          d="M214,440 L214,352 C214,342 225,338 235,338 L265,338 C275,338 286,342 286,352 L286,445 C286,455 272,465 264,465 L260,490 L250,490 L250,465"
          fill="none"
          stroke="#92400E"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        {/* Apéndice vermiforme */}
        <path d="M214,442 C212,452 216,458 218,462" stroke="#B45309" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>

      {/* INTESTINO DELGADO (ENROLLADO CENTRAL) */}
      <g
        id="dig_intestino_delgado"
        data-name="Intestino Delgado"
        className={`interactive-organ ${isSelected('dig_intestino_delgado') ? 'is-selected' : ''} ${isHinted('dig_intestino_delgado') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('dig_intestino_delgado', 'Intestino Delgado (6 Metros)')}
      >
        <path
          d="M232,360 C245,355 255,365 268,360 C272,375 260,385 240,382 C230,395 265,395 270,410 C265,425 245,418 235,430 C250,438 265,435 255,448 C245,455 235,445 230,440"
          fill="none"
          stroke="#FCD34D"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M232,360 C245,355 255,365 268,360 C272,375 260,385 240,382 C230,395 265,395 270,410 C265,425 245,418 235,430 C250,438 265,435 255,448 C245,455 235,445 230,440"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1"
        />
      </g>
    </g>
  );
};

// =============================================================
// CAPA 6: SISTEMA NERVIOSO
// =============================================================
export const Layer6Nervous: React.FC<LayerProps> = ({
  selectedOrganId,
  hintOrganId,
  onSelectOrgan
}) => {
  const isSelected = (id: string) => selectedOrganId === id;
  const isHinted = (id: string) => hintOrganId === id;

  const brainColor = '#A855F7';
  const nerveColor = '#C084FC';

  return (
    <g id="layer_6_nervous" className="transition-opacity duration-500">
      {/* CEREBELO */}
      <g
        id="nerv_cerebelo"
        data-name="Cerebelo"
        className={`interactive-organ ${isSelected('nerv_cerebelo') ? 'is-selected' : ''} ${isHinted('nerv_cerebelo') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('nerv_cerebelo', 'Cerebelo (Equilibrio)')}
      >
        <ellipse cx="250" cy="142" rx="16" ry="9" fill="#7E22CE" stroke="#6B21A8" strokeWidth="1" />
        <line x1="240" y1="142" x2="260" y2="142" stroke="#E9D5FF" strokeWidth="0.8" />
      </g>

      {/* CEREBRO (ENCÉFALO) */}
      <g
        id="nerv_cerebro"
        data-name="Cerebro"
        className={`interactive-organ ${isSelected('nerv_cerebro') ? 'is-selected' : ''} ${isHinted('nerv_cerebro') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('nerv_cerebro', 'Cerebro (Encéfalo)')}
      >
        {/* Hemisferios cerebrales con circunvoluciones */}
        <path
          d="M250,75 C232,75 222,88 222,108 C222,128 235,138 250,138 C265,138 278,128 278,108 C278,88 268,75 250,75 Z"
          fill={brainColor}
          stroke="#6B21A8"
          strokeWidth="1.5"
        />
        {/* Fisura interhemisférica */}
        <line x1="250" y1="76" x2="250" y2="137" stroke="#6B21A8" strokeWidth="1.4" />
        {/* Circunvoluciones anatómicas (surcos cerebrales) */}
        <path d="M230,90 Q240,95 235,105 Q245,115 230,122" stroke="#E9D5FF" strokeWidth="1.2" fill="none" opacity="0.85" />
        <path d="M270,90 Q260,95 265,105 Q255,115 270,122" stroke="#E9D5FF" strokeWidth="1.2" fill="none" opacity="0.85" />
      </g>

      {/* MÉDULA ESPINAL */}
      <g
        id="nerv_medula_espinal"
        data-name="Médula Espinal"
        className={`interactive-organ ${isSelected('nerv_medula_espinal') ? 'is-selected' : ''} ${isHinted('nerv_medula_espinal') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('nerv_medula_espinal', 'Médula Espinal')}
      >
        {/* Cordón nervioso central */}
        <line x1="250" y1="145" x2="250" y2="480" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
        <line x1="250" y1="145" x2="250" y2="480" stroke="#7C3AED" strokeWidth="1.5" />
      </g>

      {/* NERVIOS DE LOS BRAZOS (RADIAL, MEDIANO, CUBITAL) */}
      <g
        id="nerv_nervios_brazos"
        data-name="Nervios de Brazos"
        className={`interactive-organ ${isSelected('nerv_nervios_brazos') ? 'is-selected' : ''} ${isHinted('nerv_nervios_brazos') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('nerv_nervios_brazos', 'Nervios Periféricos (Brazos)')}
      >
        {/* Brazo Izquierdo */}
        <path d="M250,210 C210,220 170,240 152,340 C144,395 136,445 130,500" stroke={nerveColor} strokeWidth="1.8" fill="none" />
        <path d="M152,340 L138,500" stroke={nerveColor} strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
        {/* Brazo Derecho */}
        <path d="M250,210 C290,220 330,240 348,340 C356,395 364,445 370,500" stroke={nerveColor} strokeWidth="1.8" fill="none" />
        <path d="M348,340 L362,500" stroke={nerveColor} strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
        {/* Nervios intercostales (tórax) */}
        {[240, 265, 290, 315, 340].map((y, idx) => (
          <g key={idx}>
            <path d={`M250,${y} Q225,${y + 4} 205,${y + 12}`} stroke={nerveColor} strokeWidth="1" fill="none" opacity="0.8" />
            <path d={`M250,${y} Q275,${y + 4} 295,${y + 12}`} stroke={nerveColor} strokeWidth="1" fill="none" opacity="0.8" />
          </g>
        ))}
      </g>

      {/* NERVIO CIÁTICO Y DE LAS PIERNAS */}
      <g
        id="nerv_nervio_ciatico"
        data-name="Nervio Ciático"
        className={`interactive-organ ${isSelected('nerv_nervio_ciatico') ? 'is-selected' : ''} ${isHinted('nerv_nervio_ciatico') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('nerv_nervio_ciatico', 'Nervio Ciático (Piernas)')}
      >
        {/* Plexo sacro y ciático izquierdo */}
        <path d="M250,470 C235,490 225,540 216,665 C212,720 210,795 206,850" stroke={nerveColor} strokeWidth="2.5" fill="none" />
        <path d="M216,665 C222,720 224,795 220,845" stroke={nerveColor} strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
        {/* Ciático derecho */}
        <path d="M250,470 C265,490 275,540 284,665 C288,720 290,795 294,850" stroke={nerveColor} strokeWidth="2.5" fill="none" />
        <path d="M284,665 C278,720 276,795 280,845" stroke={nerveColor} strokeWidth="1.2" fill="none" strokeDasharray="3 2" />
      </g>
    </g>
  );
};

// =============================================================
// CAPA 7: SISTEMA REPRODUCTOR (ADAPTADO A PRIMARIA)
// =============================================================
export const Layer7Reproductive: React.FC<LayerProps> = ({
  gender,
  selectedOrganId,
  hintOrganId,
  onSelectOrgan
}) => {
  const isSelected = (id: string) => selectedOrganId === id;
  const isHinted = (id: string) => hintOrganId === id;

  const repColor = gender === 'hombre' ? '#3B82F6' : '#EC4899';

  return (
    <g id="layer_7_reproductive" className="transition-opacity duration-500">
      {/* VEJIGA URINARIA PÉLVICA */}
      <g
        id="rep_vejiga"
        data-name="Vejiga Urinaria"
        className={`interactive-organ ${isSelected('rep_vejiga') ? 'is-selected' : ''} ${isHinted('rep_vejiga') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('rep_vejiga', 'Vejiga Urinaria')}
      >
        <ellipse cx="250" cy="460" rx="18" ry="14" fill="#FBBF24" stroke="#D97706" strokeWidth="1.4" opacity="0.9" />
        {/* Uréteres llegando desde arriba */}
        <path d="M236,420 L242,450" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
        <path d="M264,420 L258,450" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
        <text x="250" y="463" fill="#78350F" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          VEJIGA
        </text>
      </g>

      {/* ÓRGANOS REPRODUCTORES SEGÚN GÉNERO (CIENTÍFICOS Y ADAPTADOS A PRIMARIA) */}
      {gender === 'hombre' ? (
        <g
          id="rep_organo_principal"
          data-name="Aparato Reproductor Masculino"
          className={`interactive-organ ${isSelected('rep_organo_principal') ? 'is-selected' : ''} ${isHinted('rep_organo_principal') ? 'quiz-hint-pulse' : ''}`}
          onClick={() => onSelectOrgan?.('rep_organo_principal', 'Aparato Reproductor Masculino')}
        >
          {/* Próstata */}
          <ellipse cx="250" cy="482" rx="10" ry="7" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.2" />
          {/* Conductos deferentes */}
          <path d="M242,505 C236,480 240,470 246,480" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
          <path d="M258,505 C264,480 260,470 254,480" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
          {/* Testículos protegidos didácticamente */}
          <ellipse cx="242" cy="512" rx="7" ry="9" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
          <ellipse cx="258" cy="512" rx="7" ry="9" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
        </g>
      ) : (
        <g
          id="rep_organo_principal"
          data-name="Aparato Reproductor Femenino"
          className={`interactive-organ ${isSelected('rep_organo_principal') ? 'is-selected' : ''} ${isHinted('rep_organo_principal') ? 'quiz-hint-pulse' : ''}`}
          onClick={() => onSelectOrgan?.('rep_organo_principal', 'Aparato Reproductor Femenino')}
        >
          {/* Trompas de Falopio */}
          <path d="M250,480 C242,468 226,465 222,475" stroke="#F472B6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M250,480 C258,468 274,465 278,475" stroke="#F472B6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Ovarios */}
          <ellipse cx="220" cy="477" rx="6" ry="4.5" fill="#F472B6" stroke="#BE185D" strokeWidth="1.2" />
          <ellipse cx="280" cy="477" rx="6" ry="4.5" fill="#F472B6" stroke="#BE185D" strokeWidth="1.2" />
          {/* Útero (Matriz) */}
          <path
            d="M242,478 C242,474 258,474 258,478 L255,498 C255,504 245,504 245,498 Z"
            fill="#FB7185"
            stroke="#9F1239"
            strokeWidth="1.4"
          />
        </g>
      )}

      {/* GLÁNDULAS Y PROTECCIÓN PÉLVICA */}
      <g
        id="rep_glandulas"
        data-name="Conductos Pélvicos"
        className={`interactive-organ ${isSelected('rep_glandulas') ? 'is-selected' : ''} ${isHinted('rep_glandulas') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('rep_glandulas', 'Glándulas y Conductos')}
      >
        <path d="M250,498 L250,522" stroke={repColor} strokeWidth="2" strokeDasharray="2 2" fill="none" />
      </g>
    </g>
  );
};

// =============================================================
// CAPA 8: SISTEMA ÓSEO (ESQUELETO COMPLETO)
// =============================================================
export const Layer8Skeleton: React.FC<LayerProps> = ({
  selectedOrganId,
  hintOrganId,
  onSelectOrgan,
  view
}) => {
  const isSelected = (id: string) => selectedOrganId === id;
  const isHinted = (id: string) => hintOrganId === id;

  const boneColor = '#F8FAFC';
  const boneShadow = '#E2E8F0';
  const boneStroke = '#475569';

  return (
    <g id="layer_8_skeleton" className="transition-opacity duration-500">
      {/* CRÁNEO Y MANDÍBULA */}
      <g
        id="oseo_craneo"
        data-name="Cráneo"
        className={`interactive-organ ${isSelected('oseo_craneo') ? 'is-selected' : ''} ${isHinted('oseo_craneo') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('oseo_craneo', 'Cráneo')}
      >
        {/* Neurocráneo / Bóveda craneal */}
        <ellipse cx="250" cy="106" rx="30" ry="34" fill={boneColor} stroke={boneStroke} strokeWidth="1.4" />
        
        {view === 'frente' ? (
          <>
            {/* Cuencas oculares (órbitas) */}
            <ellipse cx="237" cy="112" rx="7" ry="8" fill="#334155" stroke={boneStroke} strokeWidth="1" />
            <ellipse cx="263" cy="112" rx="7" ry="8" fill="#334155" stroke={boneStroke} strokeWidth="1" />
            {/* Abertura nasal */}
            <polygon points="250,120 246,128 254,128" fill="#334155" />
            {/* Maxilar y mandíbula con dientes */}
            <path d="M236,132 L264,132 L260,146 L240,146 Z" fill={boneShadow} stroke={boneStroke} strokeWidth="1.2" />
            <line x1="240" y1="138" x2="260" y2="138" stroke={boneStroke} strokeWidth="0.8" />
          </>
        ) : (
          /* Hueso occipital posterior */
          <path d="M230,120 Q250,135 270,120" stroke={boneStroke} strokeWidth="1" fill="none" opacity="0.6" />
        )}
      </g>

      {/* CLAVÍCULAS */}
      <path d="M250,202 L200,206 L174,212" stroke={boneStroke} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M250,202 L300,206 L326,212" stroke={boneStroke} strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* COLUMNA VERTEBRAL */}
      <g
        id="oseo_columna"
        data-name="Columna Vertebral"
        className={`interactive-organ ${isSelected('oseo_columna') ? 'is-selected' : ''} ${isHinted('oseo_columna') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('oseo_columna', 'Columna Vertebral (33 Vértebras)')}
      >
        {/* Vértebras cervicales, torácicas y lumbares */}
        {[
          156, 166, 176, 186, 196, 206, 218, 230, 242, 254, 266, 278, 290, 302, 314, 326, 340, 356, 372, 390, 408, 426
        ].map((y, i) => (
          <rect key={i} x="244" y={y} width="12" height="7" rx="2" fill={boneColor} stroke={boneStroke} strokeWidth="0.9" />
        ))}
      </g>

      {/* COSTILLAS Y ESTERNÓN */}
      <g
        id="oseo_costillas"
        data-name="Costillas"
        className={`interactive-organ ${isSelected('oseo_costillas') ? 'is-selected' : ''} ${isHinted('oseo_costillas') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('oseo_costillas', 'Costillas y Esternón')}
      >
        {/* Esternón frontal */}
        {view === 'frente' && (
          <path d="M246,210 L254,210 L253,285 L247,285 Z" fill="#F1F5F9" stroke={boneStroke} strokeWidth="1.4" />
        )}

        {/* 8 Pares de Costillas Curvadas */}
        {[
          { y: 222, rx: 36, ry: 10 },
          { y: 236, rx: 44, ry: 12 },
          { y: 250, rx: 48, ry: 14 },
          { y: 266, rx: 50, ry: 16 },
          { y: 284, rx: 48, ry: 17 },
          { y: 302, rx: 44, ry: 16 },
          { y: 320, rx: 38, ry: 15 }
        ].map((rib, idx) => (
          <g key={idx}>
            {/* Costilla izquierda */}
            <path
              d={`M246,${rib.y - 4} C${246 - rib.rx * 0.7},${rib.y - 4} ${250 - rib.rx},${rib.y + 4} ${246 - rib.rx * 0.8},${rib.y + rib.ry} L246,${rib.y + rib.ry}`}
              stroke={boneStroke}
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Costilla derecha */}
            <path
              d={`M254,${rib.y - 4} C${254 + rib.rx * 0.7},${rib.y - 4} ${250 + rib.rx},${rib.y + 4} ${254 + rib.rx * 0.8},${rib.y + rib.ry} L254,${rib.y + rib.ry}`}
              stroke={boneStroke}
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>

      {/* PELVIS / CADERA */}
      <g
        id="oseo_pelvis"
        data-name="Pelvis"
        className={`interactive-organ ${isSelected('oseo_pelvis') ? 'is-selected' : ''} ${isHinted('oseo_pelvis') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('oseo_pelvis', 'Pelvis (Cadera)')}
      >
        {/* Ilion izquierdo y derecho con foramen obturador y sacro */}
        <path
          d="M250,436 C230,432 200,438 194,460 C188,485 204,505 218,505 C230,505 240,490 250,495 C260,490 270,505 282,505 C296,505 312,485 306,460 C300,438 270,432 250,436 Z"
          fill={boneColor}
          stroke={boneStroke}
          strokeWidth="1.5"
        />
        {/* Forámenes pélvicos */}
        <ellipse cx="225" cy="488" rx="8" ry="6" fill="#334155" />
        <ellipse cx="275" cy="488" rx="8" ry="6" fill="#334155" />
        {/* Sacro central triangular */}
        <polygon points="250,442 242,478 258,478" fill={boneShadow} stroke={boneStroke} strokeWidth="1" />
      </g>

      {/* HUESOS DE LOS BRAZOS (HÚMERO, CÚBITO, RADIO, MANO) */}
      <g
        id="oseo_humero"
        data-name="Húmero y Brazos"
        className={`interactive-organ ${isSelected('oseo_humero') ? 'is-selected' : ''} ${isHinted('oseo_humero') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('oseo_humero', 'Húmero, Cúbito y Radio')}
      >
        {/* Húmero Izquierdo */}
        <path d="M174,215 L150,338" stroke={boneColor} strokeWidth="7" strokeLinecap="round" />
        <path d="M174,215 L150,338" stroke={boneStroke} strokeWidth="1.2" fill="none" />
        {/* Cúbito y Radio Izquierdo */}
        <path d="M148,344 L132,450" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M154,346 L138,452" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
        {/* Mano izquierda (palma al frente, carpianos, metacarpianos y falanges) */}
        <circle cx="134" cy="458" r="4" fill={boneColor} stroke={boneStroke} strokeWidth="0.8" />
        <line x1="130" y1="462" x2="118" y2="480" stroke={boneStroke} strokeWidth="1.5" strokeLinecap="round" /> {/* Pulgar */}
        <line x1="132" y1="464" x2="124" y2="520" stroke={boneStroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="134" y1="464" x2="128" y2="524" stroke={boneStroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="136" y1="464" x2="132" y2="522" stroke={boneStroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="138" y1="464" x2="136" y2="514" stroke={boneStroke} strokeWidth="1.2" strokeLinecap="round" />

        {/* Húmero Derecho */}
        <path d="M326,215 L350,338" stroke={boneColor} strokeWidth="7" strokeLinecap="round" />
        <path d="M326,215 L350,338" stroke={boneStroke} strokeWidth="1.2" fill="none" />
        {/* Cúbito y Radio Derecho */}
        <path d="M352,344 L368,450" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M346,346 L362,452" stroke={boneColor} strokeWidth="3.5" strokeLinecap="round" />
        {/* Mano derecha */}
        <circle cx="366" cy="458" r="4" fill={boneColor} stroke={boneStroke} strokeWidth="0.8" />
        <line x1="370" y1="462" x2="382" y2="480" stroke={boneStroke} strokeWidth="1.5" strokeLinecap="round" /> {/* Pulgar */}
        <line x1="368" y1="464" x2="376" y2="520" stroke={boneStroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="366" y1="464" x2="372" y2="524" stroke={boneStroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="364" y1="464" x2="368" y2="522" stroke={boneStroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="362" y1="464" x2="364" y2="514" stroke={boneStroke} strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* FÉMUR (HUESO DEL MUSLO) */}
      <g
        id="oseo_femur"
        data-name="Fémur"
        className={`interactive-organ ${isSelected('oseo_femur') ? 'is-selected' : ''} ${isHinted('oseo_femur') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('oseo_femur', 'Fémur (Hueso Más Fuerte)')}
      >
        {/* Fémur Izquierdo */}
        <path d="M216,505 L212,655" stroke={boneColor} strokeWidth="9" strokeLinecap="round" />
        <path d="M216,505 L212,655" stroke={boneStroke} strokeWidth="1.2" fill="none" />
        {/* Rótula / Patela */}
        <circle cx="212" cy="664" r="5.5" fill="#F1F5F9" stroke={boneStroke} strokeWidth="1" />

        {/* Fémur Derecho */}
        <path d="M284,505 L288,655" stroke={boneColor} strokeWidth="9" strokeLinecap="round" />
        <path d="M284,505 L288,655" stroke={boneStroke} strokeWidth="1.2" fill="none" />
        {/* Rótula / Patela */}
        <circle cx="288" cy="664" r="5.5" fill="#F1F5F9" stroke={boneStroke} strokeWidth="1" />
      </g>

      {/* TIBIA, PERONÉ Y HUESOS DEL PIE */}
      <g
        id="oseo_tibia"
        data-name="Tibia y Peroné"
        className={`interactive-organ ${isSelected('oseo_tibia') ? 'is-selected' : ''} ${isHinted('oseo_tibia') ? 'quiz-hint-pulse' : ''}`}
        onClick={() => onSelectOrgan?.('oseo_tibia', 'Tibia y Peroné')}
      >
        {/* Pierna Izquierda */}
        <path d="M210,672 L208,795" stroke={boneColor} strokeWidth="6" strokeLinecap="round" /> {/* Tibia */}
        <path d="M218,674 L216,792" stroke={boneColor} strokeWidth="2.8" strokeLinecap="round" /> {/* Peroné */}
        {/* Pie izquierdo */}
        <ellipse cx="204" cy="808" rx="8" ry="5" fill={boneColor} stroke={boneStroke} strokeWidth="1" />
        <path d="M196,812 L184,852 L220,852 L212,812 Z" fill={boneColor} stroke={boneStroke} strokeWidth="1" />

        {/* Pierna Derecha */}
        <path d="M290,672 L292,795" stroke={boneColor} strokeWidth="6" strokeLinecap="round" /> {/* Tibia */}
        <path d="M282,674 L284,792" stroke={boneColor} strokeWidth="2.8" strokeLinecap="round" /> {/* Peroné */}
        {/* Pie derecho */}
        <ellipse cx="296" cy="808" rx="8" ry="5" fill={boneColor} stroke={boneStroke} strokeWidth="1" />
        <path d="M304,812 L316,852 L280,852 L288,812 Z" fill={boneColor} stroke={boneStroke} strokeWidth="1" />
      </g>
    </g>
  );
};
