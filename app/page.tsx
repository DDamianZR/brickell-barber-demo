'use client';

import { useState } from 'react';
import Booking from './Booking';
import { barbers, reviews, services, type Service } from './data';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const mapUrl = 'https://maps.app.goo.gl/jW3EXxGgbH3eEsGg8';

const gallery = [
  { label: 'Fade / 01', className: 'gallery-one', image: '/fotos/Fade01.jpg' },
  { label: 'Texture / 02', className: 'gallery-two', image: '/fotos/Texture%20%2002.jpg' },
  { label: 'Design / 03', className: 'gallery-three', image: '/fotos/Desibng.jpg' },
  { label: 'Detail / 04', className: 'gallery-four', image: '/fotos/Detail.jpg' },
  { label: 'Classic / 05', className: 'gallery-five', image: '/fotos/classic.jpg' },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }
function Visual({ className, label, src }: { className: string; label: string; src: string }) {
  return <div className={`visual ${className}`}><img src={`${basePath}${src}`} alt={label} /><span className="visual-mark" aria-hidden="true">BB</span></div>;
}

export default function Home() {
  const [booking, setBooking] = useState<{ service?: Service } | null>(null);
  const openBooking = (service?: Service) => setBooking({ service });

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
            <p className="eyebrow"><span className="dot" /> Barbería contemporánea · atención personalizada</p>
            <h1>Tu estilo,<br /><em>bien hecho.</em></h1>
            <p className="hero-lede">Cortes precisos, conversación real y un espacio pensado para salir sintiéndote mejor.</p>
            <div className="hero-actions"><button className="button button-primary" onClick={() => openBooking()}>Reservar cita <Arrow /></button><a className="text-link" href="#servicios">Ver servicios <Arrow /></a></div>
            <div className="hero-proof"><span className="proof-number">4.9</span><span className="stars">★★★★★</span><span>31 reseñas en Google</span></div>
          </div>
          <div className="hero-art reveal reveal-delay"><div className="hero-ring ring-one" /><div className="hero-ring ring-two" /><img src={`${basePath}/fotos/Brickell%20premium.jpg`} alt="Corte Brickell premium" /><div className="hero-caption">BRICKELL<br /><span>BARBER</span></div></div>
        </section>

        <section className="marquee-band" aria-label="Filosofía Brickell Barber"><span>BUEN CORTE</span><span>BUEN RITMO</span><span>BUENA PRESENCIA</span><span>BUEN CORTE</span></section>

        <section className="section-shell section-block" id="servicios">
          <div className="section-heading"><div><p className="eyebrow">01 / Servicios</p><h2>Elige tu<br /><em>momento.</em></h2></div><p className="section-intro">Cada servicio empieza con una conversación y termina con una sensación clara: este corte es tuyo.</p></div>
          <div className="service-grid">{services.map((service, index) => <article className={`service-card ${index === 0 ? 'featured' : ''}`} key={service.id}><Visual className="service-photo" label={`${service.name} realizado en Brickell Barber`} src={service.image} /><div className="service-body">{service.tag && <span className="service-tag">{service.tag}</span>}<div className="service-title"><h3>{service.name}</h3><strong>{service.price}</strong></div><p>{service.description}</p><div className="service-footer"><span>{service.duration}</span><button className="round-link" onClick={() => openBooking(service)} aria-label={`Reservar ${service.name}`}><Arrow /></button></div></div></article>)}</div>
        </section>

        <section className="statement section-shell"><p className="eyebrow">02 / La experiencia</p><div className="statement-grid"><h2>No vienes solo por un corte.<br /><em>Vienes por cómo te vas.</em></h2><div><p>Trabajamos con atención, técnica y criterio. Sin prisas, sin fórmulas repetidas. Cada visita se adapta a tu rostro, a tu rutina y a la versión de ti que quieres llevar afuera.</p><a className="text-link" href="#barberos">Conoce al equipo <Arrow /></a></div></div></section>

        <section className="section-shell section-block" id="galeria"><div className="section-heading gallery-heading"><div><p className="eyebrow">03 / Trabajo reciente</p><h2>Hecho para<br /><em>verse de cerca.</em></h2></div><p className="section-intro">Fades, textura, líneas y detalles que hablan incluso antes de decir tu nombre.</p></div><div className="gallery-grid">{gallery.map((item) => <figure className={`gallery-item ${item.className}`} key={item.label}><Visual className={item.className} label={item.label} src={item.image} /><figcaption><span>{item.label}</span><span aria-hidden="true">↗</span></figcaption></figure>)}</div></section>

        <section className="team-section" id="barberos"><div className="section-shell section-block"><div className="section-heading"><div><p className="eyebrow">04 / El equipo</p><h2>Manos que<br /><em>entienden.</em></h2></div><p className="section-intro">Tres perspectivas. Una obsesión compartida: que el resultado se sienta completamente tuyo.</p></div><div className="team-grid">{barbers.map((barber) => <article className="team-card" key={barber.id}><Visual className="barber-photo" label={`Retrato de ${barber.name}`} src={barber.image} /><div className="team-meta"><div><h3>{barber.name}</h3><p>{barber.role}</p></div><span className="initials">{barber.initials}</span></div><span className="team-specialty">{barber.specialty}</span></article>)}</div></div></section>

        <section className="reviews-section section-shell section-block"><div className="reviews-top"><div><p className="eyebrow">05 / Lo que dicen</p><h2>La mejor<br /><em>referencia.</em></h2></div><div className="review-score"><strong>4.9</strong><span>★★★★★</span><small>31 reseñas en Google</small></div></div><div className="reviews-grid">{reviews.map((review) => <blockquote key={review.name}><span className="quote-mark">“</span><p>{review.quote}</p><footer><span className="review-avatar">{review.mark}</span><span><strong>{review.name}</strong><small>{review.meta}</small></span></footer></blockquote>)}</div></section>

        <section className="location-section" id="ubicacion"><div className="section-shell location-grid"><div><p className="eyebrow">06 / Encuéntranos</p><h2>Tu próxima<br /><em>parada.</em></h2><div className="location-details"><p><strong>Brickell Barber</strong><br /><a href={mapUrl} target="_blank" rel="noreferrer">Ver ubicación en Google Maps</a></p><p><strong>Horario</strong><br />Lun — Sáb · 10:00 — 21:00<br />Dom · 10:00 — 16:00</p><p><strong>Contacto</strong><br /><a href="tel:+525521818886">+52 55 2181 8886</a></p></div><a className="button button-outline" href={mapUrl} target="_blank" rel="noreferrer">Obtener indicaciones <Arrow /></a></div><a className="map-card" href={mapUrl} target="_blank" rel="noreferrer" aria-label="Abrir la ubicación de Brickell Barber en Google Maps"><div className="map-grid" /><div className="map-pin" aria-hidden="true">✦<span>BRICKELL<br />BARBER</span></div><div className="map-label">UBICACIÓN<br /><span>GOOGLE MAPS ↗</span></div></a></div></section>

        <section className="final-cta section-shell"><p className="eyebrow">Tu turno</p><h2>Haz espacio<br /><em>para ti.</em></h2><button className="button button-primary" onClick={() => openBooking()}>Reservar cita <Arrow /></button></section>
      </div>

      <footer className="site-footer"><div className="footer-brand"><img src={`${basePath}/logo.jpg`} alt="Brickell Barber" /><p>Precisión que se nota.</p></div><div className="footer-links"><div><span>Explora</span><a href="#servicios">Servicios</a><a href="#galeria">Galería</a><a href="#barberos">Barberos</a></div><div><span>Social</span><a href="https://www.facebook.com/profile.php?id=61557382316980" target="_blank" rel="noreferrer">Facebook ↗</a><a href="https://www.instagram.com/brickell_barbers" target="_blank" rel="noreferrer">Instagram ↗</a><a href={mapUrl} target="_blank" rel="noreferrer">Google Maps ↗</a></div><div><span>Contacto</span><a href="tel:+525521818886">+52 55 2181 8886</a><a href={mapUrl} target="_blank" rel="noreferrer">Cómo llegar ↗</a><button onClick={() => openBooking()}>Reservar <Arrow /></button></div></div><div className="footer-bottom"><span>© 2026 Brickell Barber</span><span>4.9 ★ · 31 reseñas</span><span>Hecho con intención.</span></div></footer>
      <button className="mobile-booking" onClick={() => openBooking()}>Reservar cita <Arrow /></button>
      {booking && <Booking initialService={booking.service} onClose={() => setBooking(null)} />}
    </main>
  );
}
