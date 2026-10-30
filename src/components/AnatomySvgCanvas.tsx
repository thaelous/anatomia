import React from 'react';
import { CharacterGender, BodyView, AnatomyLayer, OrganItem } from '../types/anatomy';
import {
  BodyGhostSilhouette,
  Layer1Skin,
  Layer2Muscular,
  Layer3Respiratory,
  Layer4Circulatory,
  Layer5Digestive,
  Layer6Nervous,
  Layer7Reproductive,
  Layer8Skeleton
} from './svgLayers/AnatomyLayers';
import { RegistrationMarks } from './RegistrationMarks';

interface AnatomySvgCanvasProps {
  gender: CharacterGender;
  view: BodyView;
  activeLayer: AnatomyLayer;
  layers: AnatomyLayer[];
  selectedOrganId: string | null;
  hintOrganId: string | null;
  onSelectOrgan: (organId: string, organName: string) => void;
  showLabels: boolean;
  showGhostSilhouette?: boolean;
  showRegistrationMarks?: boolean;
  // Modo de visualización: solo capa activa o superposición con opacidad
  viewMode?: 'single' | 'stacked' | 'peek';
  peekLayerId?: number | null;
  stackedOpacity?: number; // 0 a 100
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

export const AnatomySvgCanvas: React.FC<AnatomySvgCanvasProps> = ({
  gender,
  view,
  activeLayer,
  layers,
  selectedOrganId,
  hintOrganId,
  onSelectOrgan,
  showLabels,
  showGhostSilhouette = true,
  showRegistrationMarks = false,
  viewMode = 'single',
  peekLayerId = null,
  stackedOpacity = 40,
  svgRef
}) => {
  // Función auxiliar para renderizar el contenido de una capa específica
  const renderLayerContent = (layerId: number, isCurrentActive: boolean) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return null;

    // Soporte para imágenes externas configuradas por el usuario:
    if (layer.customImageUrl) {
      return (
        <image
          href={layer.customImageUrl}
          x="0"
          y="0"
          width="500"
          height="900"
          preserveAspectRatio="xMidYMid meet"
          className="transition-opacity duration-500"
        />
      );
    }

    const commonProps = {
      gender,
      view,
      selectedOrganId,
      hintOrganId,
      onSelectOrgan,
      showLabels
    };

    switch (layerId) {
      case 1:
        return <Layer1Skin {...commonProps} />;
      case 2:
        return <Layer2Muscular {...commonProps} />;
      case 3:
        return <Layer3Respiratory {...commonProps} />;
      case 4:
        return <Layer4Circulatory {...commonProps} />;
      case 5:
        return <Layer5Digestive {...commonProps} />;
      case 6:
        return <Layer6Nervous {...commonProps} />;
      case 7:
        return <Layer7Reproductive {...commonProps} />;
      case 8:
        return <Layer8Skeleton {...commonProps} />;
      default:
        return null;
    }
  };

  // Encontrar el órgano seleccionado o resaltado
  const activeOrgans = activeLayer.organs;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 select-none">
      <svg
        ref={svgRef}
        viewBox="0 0 500 900"
        className="w-full h-full max-h-[85vh] drop-shadow-md overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Fondo sutil del lienzo con filtro de sombreado suave */}
        <defs>
          <filter id="organGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#3B82F6" floodOpacity="0.8" />
          </filter>
          <filter id="hintGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#EF4444" floodOpacity="0.9" />
          </filter>
        </defs>

        {/* Silueta guía fantasma para referencia espacial constante */}
        {showGhostSilhouette && <BodyGhostSilhouette gender={gender} view={view} />}

        {/* MODO CAPA ANTERIOR / SUPERPUESTA (PEEK O STACKED) */}
        {viewMode === 'peek' && peekLayerId && peekLayerId !== activeLayer.id && (
          <g opacity="0.35" className="transition-opacity duration-500 pointer-events-none">
            {renderLayerContent(peekLayerId, false)}
          </g>
        )}

        {viewMode === 'stacked' && activeLayer.id > 1 && (
          <g opacity={stackedOpacity / 100} className="transition-opacity duration-500 pointer-events-none">
            {/* Capa base o esqueleto en modo transparencia */}
            {renderLayerContent(activeLayer.id - 1, false)}
          </g>
        )}

        {/* CAPA ACTIVA PRINCIPAL (Con disolvencia suave de 0.5s) */}
        <g id={`active_layer_${activeLayer.id}`} className="layer-crossfade">
          {renderLayerContent(activeLayer.id, true)}
        </g>

        {/* ETIQUETAS Y LÍNEAS INDICADORAS (CALLOUTS) */}
        {showLabels && (
          <g id="callouts_group" className="transition-all duration-300">
            {activeOrgans.map((organ) => {
              const isLeft = organ.calloutSide === 'left';
              const targetX = organ.calloutPos.x;
              const targetY = organ.calloutPos.y;
              // Extremos de las etiquetas hacia los márgenes laterales limpios
              const labelAnchorX = isLeft ? 68 : 432;
              const labelBoxX = isLeft ? 15 : 340;
              const isHighlighted = selectedOrganId === organ.id || hintOrganId === organ.id;

              return (
                <g
                  key={organ.id}
                  className="cursor-pointer group"
                  onClick={() => onSelectOrgan(organ.id, organ.name)}
                >
                  {/* Punto de anclaje sobre el órgano */}
                  <circle
                    cx={targetX}
                    cy={targetY}
                    r={isHighlighted ? 4.5 : 3}
                    fill={isHighlighted ? '#EF4444' : activeLayer.accentColor}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="transition-transform duration-200 group-hover:scale-125"
                  />

                  {/* Línea conectora (callout) con quiebre estético a 45 grados */}
                  <polyline
                    points={`${targetX},${targetY} ${isLeft ? targetX - 22 : targetX + 22},${targetY} ${labelAnchorX},${targetY}`}
                    fill="none"
                    stroke={isHighlighted ? '#DC2626' : '#94A3B8'}
                    strokeWidth={isHighlighted ? '1.8' : '1.2'}
                    strokeDasharray={isHighlighted ? 'none' : '2 2'}
                    opacity={isHighlighted ? 1 : 0.85}
                  />

                  {/* Caja de la etiqueta flotante */}
                  <rect
                    x={labelBoxX}
                    y={targetY - 14}
                    width="145"
                    height="28"
                    rx="6"
                    fill={isHighlighted ? '#1E293B' : '#FFFFFF'}
                    stroke={isHighlighted ? '#EF4444' : '#CBD5E1'}
                    strokeWidth={isHighlighted ? '1.6' : '1'}
                    className="shadow-sm transition-all duration-200 group-hover:stroke-indigo-500"
                  />

                  {/* Texto del nombre del órgano */}
                  <text
                    x={labelBoxX + 10}
                    y={targetY + 4}
                    fill={isHighlighted ? '#FFFFFF' : '#1E293B'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="system-ui, sans-serif"
                    className="select-none pointer-events-none"
                  >
                    {organ.name.length > 20 ? `${organ.name.slice(0, 18)}...` : organ.name}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* MARCAS DE REGISTRO PARA ACETATOS */}
        {showRegistrationMarks && (
          <RegistrationMarks
            showBindingGuide={true}
            sheetLabel={`Capa ${activeLayer.id} de ${layers.length}: ${activeLayer.shortTitle}`}
            genderLabel={gender === 'hombre' ? 'Hombre' : 'Mujer'}
            viewLabel={view === 'frente' ? 'Frente' : 'Espalda'}
            color="#475569"
          />
        )}
      </svg>
    </div>
  );
};
