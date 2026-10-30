import React, { useState } from 'react';
import { CharacterGender, BodyView, AnatomyLayer } from '../types/anatomy';
import { AnatomySvgCanvas } from './AnatomySvgCanvas';
import {
  Printer,
  Download,
  X,
  FileCode,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface AcetateModalProps {
  gender: CharacterGender;
  view: BodyView;
  layers: AnatomyLayer[];
  initialLayerIndex: number;
  onClose: () => void;
}

export const AcetateModal: React.FC<AcetateModalProps> = ({
  gender,
  view,
  layers,
  initialLayerIndex,
  onClose
}) => {
  const [selectedSheetIndex, setSelectedSheetIndex] = useState(initialLayerIndex);
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const currentLayer = layers[selectedSheetIndex];

  // Imprimir mediante diálogo nativo del navegador con hojas de estilo para acetatos
  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  // Exportar SVG vectorial directo con fondo transparente y marcas de registro
  const handleDownloadSvg = () => {
    playClickSound();
    const svgElem = document.getElementById('acetate-preview-svg')?.querySelector('svg');
    if (!svgElem) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElem);

    // Asegurarse de tener el namespace XML
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Acetato_Capa_${currentLayer.id}_${currentLayer.slug}_${gender}_${view}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`¡Lámina ${currentLayer.id} (${currentLayer.shortTitle}) exportada en formato SVG!`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Exportar PNG de alta resolución con fondo 100% transparente para acetato
  const handleDownloadPng = async (layerIdx = selectedSheetIndex) => {
    playClickSound();
    setIsExporting(true);
    const targetLayer = layers[layerIdx];
    const svgElem = document.getElementById('acetate-preview-svg')?.querySelector('svg');

    if (!svgElem) {
      setIsExporting(false);
      return;
    }

    try {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElem);
      if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const URLObj = window.URL || window.webkitURL || window;
      const blobURL = URLObj.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        // Lienzo en alta resolución 1500 x 2700 para impresión nítida en acetato
        const canvas = document.createElement('canvas');
        canvas.width = 1500;
        canvas.height = 2700;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // Fondo 100% transparente (sin fillRect)
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            if (blob) {
              const pngUrl = URLObj.createObjectURL(blob);
              const downloadLink = document.createElement('a');
              downloadLink.href = pngUrl;
              downloadLink.download = `Acetato_Capa_${targetLayer.id}_${targetLayer.slug}_${gender}_${view}.png`;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              URLObj.revokeObjectURL(pngUrl);
            }
            setIsExporting(false);
            setExportNotice(`¡Lámina ${targetLayer.id} descargada en PNG transparente (1500x2700 px)!`);
            setTimeout(() => setExportNotice(null), 3500);
          }, 'image/png');
        } else {
          setIsExporting(false);
        }
        URLObj.revokeObjectURL(blobURL);
      };

      image.onerror = () => {
        setIsExporting(false);
        URLObj.revokeObjectURL(blobURL);
      };

      image.src = blobURL;
    } catch {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Cabecera del Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                <Printer className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Cuadernillo de Acetatos Transparentes
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Imprime o descarga cada capa con fondo transparente y 4 marcas de registro para armar tu libro físico milimétricamente.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificación de descarga */}
        {exportNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Cuerpo del Modal: 2 Columnas (Selector y opciones a la izquierda, visor de acetato a la derecha) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Columna Izquierda: Controles y Guía de Armado Físico */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Selector de Lámina */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Selecciona la Lámina a Exportar (1 a 8)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {layers.map((l, idx) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedSheetIndex(idx);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                      selectedSheetIndex === idx
                        ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                      style={{ backgroundColor: l.accentColor }}
                    >
                      {l.id}
                    </span>
                    <span className="truncate">{l.shortTitle}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ficha técnica de la lámina actual */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                <span>Lámina {currentLayer.id}: {currentLayer.name}</span>
                <span className="text-sky-600">Registro 1:1</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                {currentLayer.description}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-200/80 flex flex-wrap gap-2 text-[10px] text-slate-500">
                <span>Personaje: <strong>{gender === 'hombre' ? 'Hombre' : 'Mujer'}</strong></span>
                <span>•</span>
                <span>Vista: <strong>{view === 'frente' ? 'Frente' : 'Espalda'}</strong></span>
                <span>•</span>
                <span>Fondo: <strong>100% Transparente</strong></span>
              </div>
            </div>

            {/* BOTONES DE EXPORTACIÓN */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleDownloadPng(selectedSheetIndex)}
                disabled={isExporting}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isExporting ? 'Procesando Lámina...' : `Descargar Lámina ${currentLayer.id} en PNG Transparente`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSvg}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-indigo-600" />
                <span>Descargar en Formato Vectorial (SVG)</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Imprimir Lámina en Acetato (Escala 100%)</span>
              </button>
            </div>

            {/* GUÍA DE ARMADO FÍSICO PARA MAESTROS Y NIÑOS */}
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-amber-950 text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Instrucciones para el Cuadernillo Físico:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900 leading-relaxed">
                <li>Imprime cada capa en una hoja de <strong>acetato transparente</strong>.</li>
                <li>Perfora las hojas siguiendo los <strong>3 círculos guía del margen izquierdo</strong>.</li>
                <li>Superpón las láminas en orden (1 piel hasta 8 esqueleto) haciendo coincidir las <strong>4 cruces de registro en las esquinas</strong>.</li>
                <li>Une el cuadernillo con un espiral plástico o broche para crear tu atlas anatómico transparente.</li>
              </ol>
            </div>
          </div>

          {/* Columna Derecha: Vista Previa en Lienzo de Acetato (Con cuadrícula de transparencia y marcas de registro) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <span className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
              Vista Previa de Impresión en Acetato (4 Marcas de Registro + Margen Izquierdo)
            </span>

            {/* Cuadrícula de tablero de ajedrez sutil que representa transparencia */}
            <div
              id="acetate-preview-svg"
              className="relative w-full max-w-[420px] aspect-[5/9] rounded-2xl border-2 border-slate-300 shadow-lg bg-white overflow-hidden p-2 flex items-center justify-center"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
              }}
            >
              <AnatomySvgCanvas
                gender={gender}
                view={view}
                activeLayer={currentLayer}
                layers={layers}
                selectedOrganId={null}
                hintOrganId={null}
                onSelectOrgan={() => {}}
                showLabels={true}
                showGhostSilhouette={false}
                showRegistrationMarks={true}
              />
            </div>
          </div>
        </div>

        {/* Pie del modal */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Cruces de alineación en esquinas idénticas y registro milimétrico para cuadernillo escolar.
        </div>
      </div>
    </div>
  );
};
