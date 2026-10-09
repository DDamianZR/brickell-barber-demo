export type Service = {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  tag?: string;
  image: string;
};

export type Barber = { id: string; name: string; role: string; specialty: string; initials: string; image: string };

export const services: Service[] = [
  { id: 'signature', name: 'Signature cut', description: 'Diagnóstico, corte y acabado a tu medida.', duration: '45 min', price: '$35', tag: 'Más elegido', image: '/fotos/Signature%20cut.jpg' },
  { id: 'fade-beard', name: 'Cut + beard', description: 'Fade preciso, perfilado y toalla caliente.', duration: '60 min', price: '$50', image: '/fotos/Cut%20%2B%20beard.jpg' },
  { id: 'design', name: 'Cut + design', description: 'Líneas limpias y diseño hecho para ti.', duration: '60 min', price: '$55', image: '/fotos/Cut%20%2B%20design.jpg' },
  { id: 'premium', name: 'Brickell premium', description: 'Corte, barba, facial y ritual completo.', duration: '90 min', price: '$75', tag: 'Experiencia completa', image: '/fotos/Brickell%20premium.jpg' },
];

export const barbers: Barber[] = [
  { id: 'jordan-1', name: 'Jordan', role: 'Barbero', specialty: 'Cortes & precisión', initials: 'J', image: '/fotos/barbero%20JORDAN.jpg' },
  { id: 'jordan-2', name: 'Jordan 2', role: 'Barbero', specialty: 'Diseño & textura', initials: 'J2', image: '/fotos/barbero%20JORDAN%202.jpg' },
  { id: 'jordan-3', name: 'Jordan 3', role: 'Barbero', specialty: 'Clásicos & barba', initials: 'J3', image: '/fotos/barbero%20JORDAN%203.jpg' },
];

export const reviews = [
  { quote: 'Excelente servicio y atención al cliente. El ambiente se percibe profesional, ordenado y agradable.', name: 'Isaac Zuñiga', meta: 'Reseña de Google', mark: 'IZ' },
  { quote: 'Todo muy limpio, trabajo perfecto y una atención muy buena. Te dejan de 10.', name: 'Tonatiuh Escalante', meta: 'Reseña de Google', mark: 'TE' },
  { quote: 'Jordan sin duda es el mejor barber de la zona: un lugar agradable, limpio y con gran trato.', name: 'Soy Patán', meta: 'Reseña de Google', mark: 'SP' },
];
