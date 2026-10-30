import React from 'react';
import { CharacterGender, BodyView } from '../types/anatomy';
import { User, Compass, ArrowRight, Sparkles, BookOpen, Layers } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface InitialMenuProps {
  gender: CharacterGender;
  view: BodyView;
  onSelectGender: (gender: CharacterGender) => void;
  onSelectView: (view: BodyView) => void;
  onStartExploration: () => void;
}

export const InitialMenu: React.FC<InitialMenuProps> = ({
  gender,
  view,
  onSelectGender,
  onSelectView,
  onStartExploration
}) => {
  const handleGenderChange = (newGender: CharacterGender) => {
    playClickSound();
    onSelectGender(newGender);
  };

  const handleViewChange = (newView: BodyView) => {
    playClickSound();
    onSelectView(newView);
  };

  const handleStart = () => {
    playClickSound();
    onStartExploration();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50/40 to-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Encabezado Superior */}
      <header className="max-w-4xl mx-auto w-full text-center pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold tracking-wide mb-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Aprende Ciencias Naturales de Primaria</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
          Anatomía Humana por Capas
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto text-balance">
          Descubre los 8 sistemas del cuerpo humano desde la piel hasta el esqueleto en posición anatómica de estudio exacto.
        </p>
      </header>

      {/* Contenedor Principal de Elección */}
      <main className="max-w-3xl mx-auto w-full my-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
        
        {/* PASO 1: ELECCIÓN DE PERSONAJE */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">1</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Elige tu Personaje Anatómico</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tarjeta Hombre */}
            <button
              type="button"
              onClick={() => handleGenderChange('hombre')}
              className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                gender === 'hombre'
                  ? 'border-blue-500 bg-blue-50/80 ring-4 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-16 h-20 rounded-xl bg-blue-100 border border-blue-200 flex flex-col items-center justify-center shrink-0">
                <User className="w-9 h-9 text-blue-600 mb-1" />
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Niño</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Hombre
                  {gender === 'hombre' && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">Seleccionado</span>
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Muestra la anatomía y el aparato reproductor masculino adaptado a ciencias de primaria.
                </p>
              </div>
            </button>

            {/* Tarjeta Mujer */}
            <button
              type="button"
              onClick={() => handleGenderChange('mujer')}
              className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                gender === 'mujer'
                  ? 'border-pink-500 bg-pink-50/80 ring-4 ring-pink-500/20 shadow-md'
                  : 'border-slate-200 hover:border-pink-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-16 h-20 rounded-xl bg-pink-100 border border-pink-200 flex flex-col items-center justify-center shrink-0">
                <User className="w-9 h-9 text-pink-600 mb-1" />
                <span className="text-[10px] font-bold text-pink-800 uppercase tracking-wider">Niña</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Mujer
                  {gender === 'mujer' && (
                    <span className="text-xs bg-pink-600 text-white px-2 py-0.5 rounded-full font-medium">Seleccionada</span>
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Muestra la anatomía y el aparato reproductor femenino adaptado didácticamente.
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* PASO 2: ELECCIÓN DE VISTA */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center">2</span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Elige la Perspectiva Visual</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vista Frente */}
            <button
              type="button"
              onClick={() => handleViewChange('frente')}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                view === 'frente'
                  ? 'border-indigo-500 bg-indigo-50/80 ring-4 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Vista de Frente (Anterior)</h3>
                <p className="text-xs text-slate-600">Rostro, tórax, corazón, órganos digestivos y palmas hacia adelante.</p>
              </div>
            </button>

            {/* Vista Espalda */}
            <button
              type="button"
              onClick={() => handleViewChange('espalda')}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                view === 'espalda'
                  ? 'border-indigo-500 bg-indigo-50/80 ring-4 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Vista de Espaldas (Posterior)</h3>
                <p className="text-xs text-slate-600">Nuca, columna vertebral, omóplatos, glúteos y nervio ciático.</p>
              </div>
            </button>
          </div>
        </section>

        {/* Resumen de las 8 capas antes de entrar */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-slate-800">8 Capas de aprendizaje:</span>
          </div>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">1. Piel</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">2. Músculos</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">3. Respiratorio</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">4. Circulatorio</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">5. Digestivo</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">6. Nervioso</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">7. Reproductor</span>
          <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">8. Esqueleto</span>
        </div>

        {/* BOTÓN COMENZAR EXPLORACIÓN */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <span>Comenzar Exploración</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </main>

      {/* Pie de página pedagógico */}
      <footer className="text-center text-xs text-slate-500 pb-4">
        Posición Anatómica Estándar y Registro para Cuadernillo de Acetatos • Diseñado para Estudiantes y Maestros
      </footer>
    </div>
  );
};
