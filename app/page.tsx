'use client';

import { useEffect, useMemo, useState } from 'react';
import { barbers, reviews, services, type Service } from './data';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const gallery = [
  ['Fade / 01', 'gallery-one'], ['Texture / 02', 'gallery-two'], ['Design / 03', 'gallery-three'],
  ['Detail / 04', 'gallery-four'], ['Classic / 05', 'gallery-five'],
];

function Arrow() { return <span aria-hidden="true">↗</span>; }
function Visual({ className, label }: { className: string; label: string }) { return <div className={`visual ${className}`} role="img" aria-label={label}><span className="visual-mark">BB</span></div>; }

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]);
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!bookingOpen || step !== 4) return;
    const handleConfirm = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.booking-actions .button')) return;
      const form = document.querySelector<HTMLFormElement>('.booking-form');
      if (form?.reportValidity()) setSubmitted(true);
    };
    document.addEventListener('click', handleConfirm);
    return () => document.removeEventListener('click', handleConfirm);
  }, [bookingOpen, step]);

  const openBooking = (service?: Service) => { setSelectedService(service ?? services[0]); setStep(1); setSubmitted(false); setBookingOpen(true); };
  const closeBooking = () => setBookingOpen(false);
  const next = () => setStep((current) => Math.min(4, current + 1));
  const back = () => setStep((current) => Math.max(1, current - 1));
  const submit = (event: React.FormEvent) => { event.preventDefault(); setSubmitted(true); };

  const stepLabel = useMemo(() => ['Servicio', 'Barbero', 'Fecha y hora', 'Tus datos'][step - 1], [step]);

  return (
    <main>
      <a className="skip-link" href="#contenido">Ir al contenido</a>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Brickell Barber, inicio"><img src={`${basePath}/logo.jpg`} alt="Brickell Barber" /></a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#servicios">Servicios</a><a href="#galeria">Galería</a><a href="#barberos">Barberos</a><a href="#ubicacion">Ubicación</a>
        </nav>
        <button className="header-cta" onClick={() => openBooking()}>Reservar <Arrow /></button>
      </header>

      <div className="ticker" role="note"><span>BRICKELL BARBER</span><span>PRECISIÓN SIN RUIDO</span><span>RESERVA TU MOMENTO <Arrow /></span></div>

      <div id="contenido">
        <section className="hero section-shell" id="inicio">
          <div className="hero-copy reveal">
            <p className="eyebrow"><span className="dot" /> Barbería contemporánea · Fairfax</p>
            <h1>Tu estilo,<br /><em>bien hecho.</em></h1>
            <p className="hero-lede">Cortes precisos, conversación real y un espacio pensado para salir sintiéndote mejor.</p>
            <div className="hero-actions"><button className="button button-primary" onClick={() => openBooking()}>Reservar cita <Arrow /></button><a className="text-link" href="#servicios">Ver servicios <Arrow /></a></div>
            <div className="hero-proof"><span className="proof-number">4.9</span><span className="stars">★★★★★</span><span>Más de 300 clientes satisfechos</span></div>
          </div>
          <div className="hero-art reveal reveal-delay"><div className="hero-ring ring-one" /><div className="hero-ring ring-two" /><img src={`${basePath}/logo.jpg`} alt="Logo original de Brickell Barber" /><div className="hero-coordinate">25°46′N<br />80°11′W</div><div className="hero-caption">Est. 2018<br /><span>Brickell / Fairfax</span></div></div>
        </section>

        <section className="marquee-band" aria-label="Filosofía Brickell Barber"><span>BUEN CORTE</span><span>BUEN RITMO</span><span>BUENA PRESENCIA</span><span>BUEN CORTE</span></section>

        <section className="section-shell section-block" id="servicios">
          <div className="section-heading"><div><p className="eyebrow">01 / Servicios</p><h2>Elige tu<br /><em>momento.</em></h2></div><p className="section-intro">Cada servicio empieza con una conversación y termina con una sensación clara: este corte es tuyo.</p></div>
          <div className="service-grid">{services.map((service, index) => <article className={`service-card ${index === 0 ? 'featured' : ''}`} key={service.id}><Visual className={service.visual} label={`Imagen conceptual de ${service.name}`} /><div className="service-body">{service.tag && <span className="service-tag">{service.tag}</span>}<div className="service-title"><h3>{service.name}</h3><strong>{service.price}</strong></div><p>{service.description}</p><div className="service-footer"><span>{service.duration}</span><button className="round-link" onClick={() => openBooking(service)} aria-label={`Reservar ${service.name}`}><Arrow /></button></div></div></article>)}</div>
        </section>

        <section className="statement section-shell"><p className="eyebrow">02 / La experiencia</p><div className="statement-grid"><h2>No vienes solo por un corte.<br /><em>Vienes por cómo te vas.</em></h2><div><p>Trabajamos con atención, técnica y criterio. Sin prisas, sin fórmulas repetidas. Cada visita se adapta a tu rostro, a tu rutina y a la versión de ti que quieres llevar afuera.</p><a className="text-link" href="#barberos">Conoce al equipo <Arrow /></a></div></div></section>

        <section className="section-shell section-block" id="galeria"><div className="section-heading gallery-heading"><div><p className="eyebrow">03 / Trabajo reciente</p><h2>Hecho para<br /><em>verse de cerca.</em></h2></div><p className="section-intro">Fades, textura, líneas y detalles que hablan incluso antes de decir tu nombre.</p></div><div className="gallery-grid">{gallery.map(([label, visual]) => <figure className={`gallery-item ${visual}`} key={label}><Visual className={visual} label={label} /><figcaption><span>{label}</span><span>↗</span></figcaption></figure>)}</div></section>

        <section className="team-section" id="barberos"><div className="section-shell section-block"><div className="section-heading"><div><p className="eyebrow">04 / El equipo</p><h2>Manos que<br /><em>entienden.</em></h2></div><p className="section-intro">Tres perspectivas. Una obsesión compartida: que el resultado se sienta completamente tuyo.</p></div><div className="team-grid">{barbers.map((barber) => <article className="team-card" key={barber.id}><Visual className={barber.visual} label={`Retrato de ${barber.name}`} /><div className="team-meta"><div><h3>{barber.name}</h3><p>{barber.role}</p></div><span className="initials">{barber.initials}</span></div><span className="team-specialty">{barber.specialty}</span></article>)}</div></div></section>

        <section className="reviews-section section-shell section-block"><div className="reviews-top"><div><p className="eyebrow">05 / Lo que dicen</p><h2>La mejor<br /><em>referencia.</em></h2></div><div className="review-score"><strong>4.9</strong><span>★★★★★</span><small>Google reviews</small></div></div><div className="reviews-grid">{reviews.map((review) => <blockquote key={review.name}><span className="quote-mark">“</span><p>{review.quote}</p><footer><span className="review-avatar">{review.mark}</span><span><strong>{review.name}</strong><small>{review.meta}</small></span></footer></blockquote>)}</div></section>

        <section className="location-section" id="ubicacion"><div className="section-shell location-grid"><div><p className="eyebrow">06 / Encuéntranos</p><h2>Tu próxima<br /><em>parada.</em></h2><div className="location-details"><p><strong>Brickell Barber</strong><br />123 Main Street, Fairfax, VA 22030</p><p><strong>Horario</strong><br />Mar — Sáb · 9:00 — 19:00<br />Dom — Lun · Cerrado</p><p><strong>Contacto</strong><br /><a href="tel:+17035550188">+1 703 555 0188</a><br /><a href="mailto:hello@brickellbarber.com">hello@brickellbarber.com</a></p></div><button className="button button-outline" onClick={() => alert('Aquí se abrirían las indicaciones de Google Maps.')}>Obtener indicaciones <Arrow /></button></div><div className="map-card"><div className="map-grid" /><div className="map-pin">✦<span>BRICKELL<br />BARBER</span></div><div className="map-label">FAIRFAX<br /><span>VA / USA</span></div></div></div></section>

        <section className="final-cta section-shell"><p className="eyebrow">Tu turno</p><h2>Haz espacio<br /><em>para ti.</em></h2><button className="button button-primary" onClick={() => openBooking()}>Reservar cita <Arrow /></button></section>
      </div>

      <footer className="site-footer"><div className="footer-brand"><img src={`${basePath}/logo.jpg`} alt="Brickell Barber" /><p>Precisión que se nota.</p></div><div className="footer-links"><div><span>Explora</span><a href="#servicios">Servicios</a><a href="#galeria">Galería</a><a href="#barberos">Barberos</a></div><div><span>Social</span><a href="#inicio">Instagram ↗</a><a href="#inicio">TikTok ↗</a><a href="#inicio">Google ↗</a></div><div><span>Visítanos</span><p>123 Main Street<br />Fairfax, VA 22030</p><button onClick={() => openBooking()}>Reservar <Arrow /></button></div></div><div className="footer-bottom"><span>© 2026 Brickell Barber</span><span>Demo visual · Datos de muestra</span><span>Hecho con intención.</span></div></footer>
      <button className="mobile-booking" onClick={() => openBooking()}>Reservar cita <Arrow /></button>
      {bookingOpen && <div className="booking-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeBooking(); }}><section className="booking-panel" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="close-button" onClick={closeBooking} aria-label="Cerrar reserva">×</button>{submitted ? <div className="booking-success"><span className="success-icon">✓</span><p className="eyebrow">Reserva demo confirmada</p><h2>Nos vemos<br /><em>pronto.</em></h2><p>Guardamos tu solicitud para el <strong>{selectedTime}</strong> con <strong>{selectedBarber.name}</strong>. En una integración real, aquí recibirías la confirmación.</p><button className="button button-primary" onClick={closeBooking}>Volver al sitio <Arrow /></button></div> : <><div className="booking-head"><p className="eyebrow">Reserva tu cita</p><h2 id="booking-title">Tu próximo<br /><em>corte.</em></h2><span className="step-count">0{step} / 04</span></div><div className="progress"><span style={{ width: `${step * 25}%` }} /></div><p className="booking-step-label">Paso {step}: {stepLabel}</p>{step === 1 && <div className="booking-options">{services.map((service) => <button className={`booking-option ${selectedService?.id === service.id ? 'selected' : ''}`} key={service.id} onClick={() => setSelectedService(service)}><span><strong>{service.name}</strong><small>{service.duration} · {service.price}</small></span><span className="option-check">{selectedService?.id === service.id ? '✓' : '＋'}</span></button>)}</div>}{step === 2 && <div className="booking-options">{barbers.map((barber) => <button className={`booking-option ${selectedBarber.id === barber.id ? 'selected' : ''}`} key={barber.id} onClick={() => setSelectedBarber(barber)}><span><strong>{barber.name}</strong><small>{barber.specialty}</small></span><span className="option-avatar">{barber.initials}</span></button>)}</div>}{step === 3 && <div className="time-picker"><div className="date-row">{['MAR 14', 'MIÉ 15', 'JUE 16', 'VIE 17'].map((date, index) => <button className={index === 0 ? 'date selected' : 'date'} key={date}><strong>{date.split(' ')[0]}</strong><span>{date.split(' ')[1]}</span></button>)}</div><div className="time-grid">{['09:00', '10:30', '12:00', '14:30', '16:00', '17:30'].map((time) => <button className={selectedTime === time ? 'time selected' : 'time'} onClick={() => setSelectedTime(time)} key={time}>{time}</button>)}</div></div>}{step === 4 && <form className="booking-form" onSubmit={submit}><label>Nombre completo<input required name="name" type="text" placeholder="Tu nombre" /></label><label>Correo electrónico<input required name="email" type="email" placeholder="tu@email.com" /></label><label>Teléfono<input required name="phone" type="tel" placeholder="(000) 000-0000" /></label><label className="consent"><input required type="checkbox" /> <span>Acepto recibir la confirmación de esta cita demo.</span></label></form>}<div className="booking-actions">{step > 1 && <button className="text-link" onClick={back}>← Atrás</button>}<button className="button button-primary" onClick={step === 4 ? undefined : next} type={step === 4 ? 'submit' : 'button'} form={step === 4 ? undefined : undefined}>{step === 4 ? 'Confirmar cita' : 'Continuar'} <Arrow /></button></div></>}</section></div>}
    </main>
  );
}
