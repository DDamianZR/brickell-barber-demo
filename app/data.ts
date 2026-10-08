export type Service = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  tag?: string;
  visual: string;
};

export type Barber = { id: string; name: string; role: string; specialty: string; initials: string; visual: string };

export const services: Service[] = [
  { id: 'signature', name: 'Signature cut', description: 'Diagnóstico, corte y acabado a tu medida.', duration: '45 min', price: '$35', tag: 'Más elegido', visual: 'visual-cut' },
  { id: 'fade-beard', name: 'Cut + beard', description: 'Fade preciso, perfilado y toalla caliente.', duration: '60 min', price: '$50', visual: 'visual-beard' },
  { id: 'design', name: 'Cut + design', description: 'Líneas limpias y diseño hecho para ti.', duration: '60 min', price: '$55', visual: 'visual-design' },
  { id: 'premium', name: 'Brickell premium', description: 'Corte, barba, facial y ritual completo.', duration: '90 min', price: '$75', tag: 'Experiencia completa', visual: 'visual-premium' },
];

export const barbers: Barber[] = [
  { id: 'alex', name: 'Alex Rivera', role: 'Founder / Master barber', specialty: 'Fades & precisión', initials: 'AR', visual: 'barber-alex' },
  { id: 'jordan', name: 'Jordan Lee', role: 'Senior barber', specialty: 'Diseño & textura', initials: 'JL', visual: 'barber-jordan' },
  { id: 'marco', name: 'Marco Santos', role: 'Barber', specialty: 'Clásicos & barba', initials: 'MS', visual: 'barber-marco' },
];

export const reviews = [
  { quote: 'Salí con el corte que tenía en la cabeza. Atención al detalle de otro nivel.', name: 'Chris M.', meta: 'Cliente desde 2022', mark: 'CM' },
  { quote: 'El ambiente, la música y el servicio hacen que volver sea parte de la rutina.', name: 'Dani R.', meta: 'Cliente verificado', mark: 'DR' },
  { quote: 'Por fin encontré un fade que se mantiene impecable toda la semana.', name: 'Luis G.', meta: 'Cliente verificado', mark: 'LG' },
];
