export type CharacterGender = 'hombre' | 'mujer';
export type BodyView = 'frente' | 'espalda';

export interface OrganItem {
  id: string;
  name: string;
  latinName?: string;
  system: string;
  shortDesc: string; // Explicación de 1 línea para niños de primaria
  funFact: string; // ¿Sabías que...?
  calloutPos: { x: number; y: number }; // Coordenadas para la etiqueta
  calloutSide: 'left' | 'right';
  badgeColor?: string;
}

export interface AnatomyLayer {
  id: number;
  slug: string;
  name: string;
  shortTitle: string;
  systemName: string;
  color: string;
  accentColor: string;
  iconName: string;
  description: string;
  organs: OrganItem[];
  customImageUrl?: string; // Modular: permite reemplazar SVG por imagen externa en el futuro
}

export interface QuizQuestion {
  targetId: string;
  targetName: string;
  systemName: string;
  layerId: number;
  hint: string;
  educationalFact: string;
}
