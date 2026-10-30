import React from 'react';

interface RegistrationMarksProps {
  showBindingGuide?: boolean;
  sheetLabel?: string;
  genderLabel?: string;
  viewLabel?: string;
  color?: string;
}

/**
 * Marcas de registro estándar de imprenta (Registration Crosshairs)
 * en las 4 esquinas del lienzo (500x900) más margen para engargolado.
 */
export const RegistrationMarks: React.FC<RegistrationMarksProps> = ({
  showBindingGuide = true,
  sheetLabel,
  genderLabel,
  viewLabel,
  color = '#475569'
}) => {
  // Las 4 esquinas exactas:
  const marks = [
    { x: 30, y: 30 },   // Superior Izquierda
    { x: 470, y: 30 },  // Superior Derecha
    { x: 30, y: 870 },  // Inferior Izquierda
    { x: 470, y: 870 }, // Inferior Derecha
  ];

  return (
    <g id="registration_marks_layer" className="pointer-events-none select-none">
      {/* 4 Miras de Registro Cruzadas */}
      {marks.map((m, idx) => (
        <g key={idx} transform={`translate(${m.x}, ${m.y})`}>
          {/* Círculo concéntrico exterior */}
          <circle cx="0" cy="0" r="10" fill="none" stroke={color} strokeWidth="0.8" opacity="0.85" />
          {/* Círculo interior */}
          <circle cx="0" cy="0" r="4.5" fill="none" stroke={color} strokeWidth="0.6" opacity="0.85" />
          {/* Cruz vertical y horizontal */}
          <line x1="-15" y1="0" x2="15" y2="0" stroke={color} strokeWidth="0.75" />
          <line x1="0" y1="-15" x2="0" y2="15" stroke={color} strokeWidth="0.75" />
        </g>
      ))}

      {/* Margen lateral izquierdo para engargolado / perforación de hojas de acetato */}
      {showBindingGuide && (
        <g id="binding_margin_guide" opacity="0.65">
          {/* Línea sutil de margen de engargolado */}
          <line
            x1="55"
            y1="50"
            x2="55"
            y2="850"
            stroke={color}
            strokeWidth="0.6"
            strokeDasharray="4 4"
          />
          {/* 3 Guías de perforación estándar para carpeta/engargolado */}
          {[160, 450, 740].map((punchY, i) => (
            <g key={i}>
              <circle cx="42" cy={punchY} r="4" fill="none" stroke={color} strokeWidth="0.9" />
              <circle cx="42" cy={punchY} r="1" fill={color} />
            </g>
          ))}
          <text
            x="42"
            y="435"
            transform="rotate(-90 42 435)"
            fill={color}
            fontSize="8"
            fontFamily="sans-serif"
            letterSpacing="1"
            textAnchor="middle"
          >
            MARGEN DE ENGARGOLADO
          </text>
        </g>
      )}

      {/* Rótulo técnico en pie de lámina con datos de registro */}
      {(sheetLabel || genderLabel || viewLabel) && (
        <g id="sheet_metadata_footer">
          <text
            x="250"
            y="885"
            fill={color}
            fontSize="8.5"
            fontWeight="bold"
            fontFamily="sans-serif"
            textAnchor="middle"
            letterSpacing="0.5"
          >
            {sheetLabel ? `${sheetLabel} — ` : ''}
            {genderLabel ? `${genderLabel.toUpperCase()} ` : ''}
            {viewLabel ? `[VISTA ${viewLabel.toUpperCase()}]` : ''}
            {' • REGISTRO DE ACETATO MILIMÉTRICO'}
          </text>
        </g>
      )}
    </g>
  );
};
