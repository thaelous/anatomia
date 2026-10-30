import React from 'react';
import { AnatomyLayer } from '../types/anatomy';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Gamepad2,
  Printer,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface LayerNavigationProps {
  layers: AnatomyLayer[];
  currentLayerIndex: number;
  onSelectLayerIndex: (index: number) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  isQuizActive: boolean;
  onToggleQuiz: () => void;
  onOpenAcetateModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReturnToMenu: () => void;
  // Modo transparencia / rayos X
  viewMode: 'single' | 'stacked' | 'peek';
  onChangeViewMode: (mode: 'single' | 'stacked' | 'peek') => void;
  stackedOpacity: number;
  onChangeStackedOpacity: (val: number) => void;
}

export const LayerNavigation: React.FC<LayerNavigationProps> = ({
  layers,
  currentLayerIndex,
  onSelectLayerIndex,
  showLabels,
  onToggleLabels,
  isQuizActive,
  onToggleQuiz,
  onOpenAcetateModal,
  soundEnabled,
  onToggleSound,
  onReturnToMenu,
  viewMode,
  onChangeViewMode,
  stackedOpacity,
  onChangeStackedOpacity
}) => {
  const currentLayer = layers[currentLayerIndex];

  const handlePrev = () => {
    if (currentLayerIndex > 0) {
      playClickSound();
      onSelectLayerIndex(currentLayerIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentLayerIndex < layers.length - 1) {
      playClickSound();
      onSelectLayerIndex(currentLayerIndex + 1);
    }
  };

  const handleSelect = (idx: number) => {
    playClickSound();
    onSelectLayerIndex(idx);
  };

  return (
    <aside className="w-full flex flex-col gap-3">
      {/* BARRA SUPERIOR DE CONTROL DE CAPA ACTUAL */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        
        {/* Encabezado y Progreso */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full inline-block shrink-0"
              style={{ backgroundColor: currentLayer.accentColor }}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Capa {currentLayer.id} de {layers.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-500" />}
            </button>
            <button
              type="button"
              onClick={onReturnToMenu}
              title="Volver a elegir personaje o vista"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cambiar</span>
            </button>
          </div>
        </div>

        {/* Título y descripción breve de la capa */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
          {currentLayer.name}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2">
          {currentLayer.description}
        </p>

        {/* BOTONES GRANDES DE NAVEGACIÓN ANTERIOR / SIGUIENTE */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentLayerIndex === 0}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
              currentLayerIndex === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-[0.98]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Capa Anterior</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentLayerIndex === layers.length - 1}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm text-white transition-all cursor-pointer ${
              currentLayerIndex === layers.length - 1
                ? 'bg-slate-300 cursor-not-allowed opacity-60'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 active:scale-[0.98]'
            }`}
          >
            <span>Siguiente Capa</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SELECTOR RÁPIDO DE TODAS LAS 8 CAPAS */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2 block">
          Índice de Capas Anatómicas
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5">
          {layers.map((layer, idx) => {
            const isActive = idx === currentLayerIndex;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-950 font-bold shadow-xs'
                    : 'border border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: layer.accentColor }}
                >
                  {layer.id}
                </span>
                <span className="truncate">{layer.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTROLES DE INTERACTIVIDAD Y MODOS */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 flex flex-col gap-2.5">
        
        {/* Toggle Etiquetas */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onToggleLabels();
          }}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            showLabels
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            {showLabels ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            <span>Etiquetas Interactivas</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${showLabels ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'}`}>
            {showLabels ? 'ACTIVADAS' : 'OCULTAS'}
          </span>
        </button>

        {/* Modo Quiz */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onToggleQuiz();
          }}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isQuizActive
              ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
              : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            <span>¡Pon a prueba lo que sabes!</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/20 font-bold">
            {isQuizActive ? 'JUGANDO' : 'MODO QUIZ'}
          </span>
        </button>

        {/* Modo Transparencia / Rayos X */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Modo Rayos X (Transparencia)</span>
            </span>
            <button
              type="button"
              onClick={() => onChangeViewMode(viewMode === 'stacked' ? 'single' : 'stacked')}
              className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
            >
              {viewMode === 'stacked' ? 'Desactivar' : 'Activar'}
            </button>
          </div>

          {viewMode === 'stacked' && (
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                <span>Capa anterior de fondo</span>
                <span>{stackedOpacity}% opacidad</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={stackedOpacity}
                onChange={(e) => onChangeStackedOpacity(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Botón Cuadernillo de Acetatos */}
        <button
          type="button"
          onClick={onOpenAcetateModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-sky-400" />
          <span>Descargar Capas para Acetato</span>
        </button>
      </div>
    </aside>
  );
};
