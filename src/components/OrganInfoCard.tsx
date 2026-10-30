import React from 'react';
import { OrganItem } from '../types/anatomy';
import { Info, Volume2, Sparkles, X } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface OrganInfoCardProps {
  organ: OrganItem | null;
  onClose: () => void;
  onStartQuizWithOrgan?: (organId: string) => void;
}

export const OrganInfoCard: React.FC<OrganInfoCardProps> = ({
  organ,
  onClose,
  onStartQuizWithOrgan
}) => {
  if (!organ) return null;

  const handleSpeak = () => {
    playClickSound();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `${organ.name}. ${organ.shortDesc} ¿Sabías que? ${organ.funFact}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-md border border-slate-200 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            {organ.system}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
            {organ.name}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleSpeak}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            title="Escuchar explicación en voz alta"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Explicación de 1 línea para primaria */}
      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        {organ.shortDesc}
      </p>

      {/* ¿Sabías que...? */}
      <div className="mt-2.5 flex items-start gap-2 text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-amber-950">¿Sabías que? </strong>
          <span>{organ.funFact}</span>
        </div>
      </div>
    </div>
  );
};
