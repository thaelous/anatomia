import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types/anatomy';
import { QUIZ_QUESTIONS, POSITIVE_PRAISES, GENTLE_ENCOURAGEMENTS } from '../data/anatomyData';
import { playSuccessSound, playGentleRetrySound, playCelebrationSound } from '../utils/audio';
import { Sparkles, Trophy, HelpCircle, ArrowRight, X, HeartHandshake } from 'lucide-react';

interface QuizModeProps {
  currentLayerId: number;
  onSetHintOrganId: (organId: string | null) => void;
  onSelectLayerById: (layerId: number) => void;
  onCloseQuiz: () => void;
  lastClickedOrganId: string | null;
  lastClickedOrganName: string | null;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  currentLayerId,
  onSetHintOrganId,
  onSelectLayerById,
  onCloseQuiz,
  lastClickedOrganId,
  lastClickedOrganName
}) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'encouraging' | 'idle'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [completed, setCompleted] = useState(false);

  // Filtrar o priorizar preguntas de la capa actual si existen, o mezclar todas
  const questions: QuizQuestion[] = React.useMemo(() => {
    const layerSpecific = QUIZ_QUESTIONS.filter((q) => q.layerId === currentLayerId);
    if (layerSpecific.length >= 2) {
      return [...layerSpecific, ...QUIZ_QUESTIONS.filter((q) => q.layerId !== currentLayerId)];
    }
    return QUIZ_QUESTIONS;
  }, [currentLayerId]);

  const currentQ = questions[questionIndex % questions.length];

  // Asegurarnos de que el visor esté en la capa de la pregunta actual
  useEffect(() => {
    if (currentQ && currentQ.layerId !== currentLayerId) {
      onSelectLayerById(currentQ.layerId);
    }
  }, [currentQ, currentLayerId, onSelectLayerById]);

  // Si el usuario falla 2 veces, activamos el parpadeo de pista sutil
  useEffect(() => {
    if (attempts >= 2 && currentQ) {
      onSetHintOrganId(currentQ.targetId);
    } else {
      onSetHintOrganId(null);
    }
  }, [attempts, currentQ, onSetHintOrganId]);

  // Limpiar pista al desmontar
  useEffect(() => {
    return () => {
      onSetHintOrganId(null);
    };
  }, [onSetHintOrganId]);

  // Evaluar clics sobre órganos cuando cambia lastClickedOrganId
  useEffect(() => {
    if (!lastClickedOrganId || completed) return;

    if (lastClickedOrganId === currentQ.targetId) {
      // ¡ACIERTO!
      playSuccessSound();
      // Explosión de confeti en pantalla
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
      });

      const randomPraise = POSITIVE_PRAISES[Math.floor(Math.random() * POSITIVE_PRAISES.length)];
      setFeedback({
        type: 'success',
        message: randomPraise
      });
      setScore((prev) => prev + 1);
      onSetHintOrganId(null);

      // Pasar automáticamente al siguiente reto tras 1.8s
      const timer = setTimeout(() => {
        if (questionIndex + 1 >= 5) {
          // Ronda de 5 preguntas completada con éxito
          playCelebrationSound();
          setCompleted(true);
        } else {
          setQuestionIndex((prev) => prev + 1);
          setAttempts(0);
          setFeedback({ type: 'idle', message: '' });
        }
      }, 1800);

      return () => clearTimeout(timer);
    } else {
      // NO FUE EL ÓRGANO CORRECTO -> Retroalimentación motivadora y suave
      playGentleRetrySound();
      const randomEncouragement =
        GENTLE_ENCOURAGEMENTS[Math.floor(Math.random() * GENTLE_ENCOURAGEMENTS.length)];
      setAttempts((prev) => prev + 1);
      setFeedback({
        type: 'encouraging',
        message: randomEncouragement
      });
    }
  }, [lastClickedOrganId, currentQ, completed, questionIndex, onSetHintOrganId]);

  const handleNextQuestion = () => {
    setQuestionIndex((prev) => prev + 1);
    setAttempts(0);
    setFeedback({ type: 'idle', message: '' });
    onSetHintOrganId(null);
  };

  const handleRestartQuiz = () => {
    setQuestionIndex(0);
    setScore(0);
    setAttempts(0);
    setCompleted(false);
    setFeedback({ type: 'idle', message: '' });
    onSetHintOrganId(null);
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-amber-200 transition-all">
      {/* Barra superior del quiz */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Trophy className="w-4 h-4" />
          </span>
          <span className="font-bold text-amber-950 text-sm">
            Reto {Math.min(questionIndex + 1, 5)} de 5
          </span>
          <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
            ★ {score} Aciertos
          </span>
        </div>

        <button
          type="button"
          onClick={onCloseQuiz}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="Salir del modo juego"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {completed ? (
        /* Pantalla de felicitación final */
        <div className="py-4 text-center">
          <div className="w-14 h-14 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">¡Misión Anatómica Cumplida!</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            ¡Felicitaciones! Has completado la ronda respondiendo con entusiasmo y curiosidad científica.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={handleRestartQuiz}
              className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer transition-all shadow-sm"
            >
              Jugar de nuevo
            </button>
            <button
              type="button"
              onClick={onCloseQuiz}
              className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
            >
              Volver a exploración libre
            </button>
          </div>
        </div>
      ) : (
        /* Pregunta actual del reto */
        <div>
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3">
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentQ.systemName}</span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              ¡Señala dónde está:{' '}
              <span className="text-indigo-600 underline decoration-indigo-300 underline-offset-2">
                {currentQ.targetName}
              </span>
              !
            </h3>

            {/* Pista o curiosidad pedagógica */}
            <p className="text-xs text-slate-600 mt-1.5 flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Pista:</strong> {currentQ.hint}
              </span>
            </p>
          </div>

          {/* Banner de retroalimentación en vivo */}
          {feedback.type === 'success' && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">{feedback.message}</span>
              </div>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="text-[11px] font-bold bg-emerald-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-emerald-700 cursor-pointer"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {feedback.type === 'encouraging' && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-sky-50 border border-sky-300 text-sky-900 text-xs flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="font-bold">{feedback.message}</span>
                {attempts >= 2 && (
                  <span className="block text-[11px] text-sky-700 mt-0.5">
                    💡 ¡Mira! La parte correcta está parpadeando suavemente para ayudarte.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
