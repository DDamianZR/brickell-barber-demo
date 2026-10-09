'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { barbers, services, type Barber, type Service } from './data';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const whatsappNumber = '525521818886';
const bookingWindowDays = 30;
const slotStep = 30;
const steps = ['Servicio', 'Barbero', 'Horario', 'Tus datos'] as const;
const weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

type Slot = { label: string; minutes: number };

const startOfDay = (date: Date) => { const copy = new Date(date); copy.setHours(0, 0, 0, 0); return copy; };
const addDays = (date: Date, days: number) => { const copy = new Date(date); copy.setDate(copy.getDate() + days); return copy; };
const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && a.toDateString() === b.toDateString();
const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const toLabel = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
const durationOf = (service: Service) => parseInt(service.duration, 10);
const format = (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('es-MX', options).format(date).replace('.', '');
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// Deterministic pseudo-occupancy so the demo feels like a real agenda.
function isBusy(key: string, barberId: string, minutes: number) {
  let hash = 2166136261;
  for (const char of `${key}|${barberId}|${minutes}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return (hash >>> 0) % 100 < 30;
}

function getSlots(date: Date, service: Service, barber: Barber | null, now: Date): Slot[] {
  const close = (date.getDay() === 0 ? 16 : 21) * 60;
  const earliest = sameDay(date, now) ? now.getHours() * 60 + now.getMinutes() + 30 : 0;
  const key = dayKey(date);
  const slots: Slot[] = [];
  for (let minutes = 10 * 60; minutes + durationOf(service) <= close; minutes += slotStep) {
    if (minutes < earliest) continue;
    const busy = barber ? isBusy(key, barber.id, minutes) : barbers.every((b) => isBusy(key, b.id, minutes));
    if (!busy) slots.push({ label: toLabel(minutes), minutes });
  }
  return slots;
}

function useNow() {
  const [now] = useState(() => new Date());
  return now;
}

export default function Booking({ initialService, onClose }: { initialService?: Service; onClose: () => void }) {
  const now = useNow();
  const today = useMemo(() => startOfDay(now), [now]);
  const lastDay = useMemo(() => addDays(today, bookingWindowDays), [today]);

  const [step, setStep] = useState(initialService ? 1 : 0);
  const [service, setService] = useState<Service>(initialService ?? services[0]);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [barberChosen, setBarberChosen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Slot | null>(null);
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [focusDate, setFocusDate] = useState<Date | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [touched, setTouched] = useState(false);
  const [confirmed, setConfirmed] = useState<{ barber: Barber } | null>(null);

  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timesRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<number>();

  const slotsFor = (day: Date) => getSlots(day, service, barber, now);
  const inWindow = (day: Date) => day >= today && day <= lastDay;
  const slots = date ? slotsFor(date) : [];
  const nextAvailable = useMemo(() => {
    for (let offset = 0; offset <= bookingWindowDays; offset++) {
      const day = addDays(today, offset);
      const daySlots = getSlots(day, service, barber, now);
      if (daySlots.length) return { day, slot: daySlots[0] };
    }
    return null;
  }, [today, service, barber, now]);

  // Lock page scroll and close on Escape while the dialog is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, textarea, [tabindex="0"]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); window.clearTimeout(advanceTimer.current); };
  }, [onClose]);

  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); bodyRef.current?.scrollTo({ top: 0 }); }, [step, confirmed]);

  // Pre-select the first available day when reaching the schedule step.
  useEffect(() => {
    if (step === 2 && !date && nextAvailable) { setDate(nextAvailable.day); setViewMonth(new Date(nextAvailable.day.getFullYear(), nextAvailable.day.getMonth(), 1)); }
  }, [step, date, nextAvailable]);

  // Drop a chosen time that no longer fits after changing service or barber.
  useEffect(() => {
    if (time && date && !slotsFor(date).some((slot) => slot.minutes === time.minutes)) setTime(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, barber]);

  useEffect(() => {
    if (!focusDate) return;
    panelRef.current?.querySelector<HTMLButtonElement>(`[data-day="${dayKey(focusDate)}"]`)?.focus();
  }, [focusDate, viewMonth]);

  const advance = () => { window.clearTimeout(advanceTimer.current); advanceTimer.current = window.setTimeout(() => setStep((current) => current + 1), 260); };
  const chooseService = (next: Service) => { setService(next); advance(); };
  const chooseBarber = (next: Barber | null) => { setBarber(next); setBarberChosen(true); advance(); };
  const chooseDate = (day: Date) => {
    setDate(day); setTime(null);
    if (window.matchMedia('(max-width: 899px)').matches) window.setTimeout(() => timesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };
  const jumpToNextAvailable = () => {
    if (!nextAvailable) return;
    setDate(nextAvailable.day); setTime(nextAvailable.slot);
    setViewMonth(new Date(nextAvailable.day.getFullYear(), nextAvailable.day.getMonth(), 1));
  };

  const phoneValid = form.phone.replace(/\D/g, '').length >= 10;
  const emailValid = !form.email || /^\S+@\S+\.\S+$/.test(form.email);
  const formValid = form.name.trim().length > 1 && phoneValid && emailValid;
  const canContinue = [true, barberChosen, !!time, formValid][step];
  const maxReachable = !barberChosen ? 1 : !time ? 2 : 3;

  const assignedBarber = () => barber ?? barbers.find((b) => date && time && !isBusy(dayKey(date), b.id, time.minutes)) ?? barbers[0];
  const goNext = () => {
    if (step < 3) { if (canContinue) setStep(step + 1); return; }
    setTouched(true);
    if (formValid) setConfirmed({ barber: assignedBarber() });
  };

  const dateLong = date ? capitalize(format(date, { weekday: 'long', day: 'numeric', month: 'long' })) : '';
  const dateShort = date ? capitalize(format(date, { weekday: 'short', day: 'numeric', month: 'short' })) : '';

  const whatsappUrl = () => {
    const message = `Hola, quiero confirmar mi cita en Brickell Barber:\n• ${service.name} (${service.duration}, ${service.price})\n• Barbero: ${confirmed?.barber.name}\n• ${dateLong} a las ${time?.label}\n• A nombre de: ${form.name}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };
  const downloadCalendar = () => {
    if (!date || !time) return;
    const stamp = (minutes: number) => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}T${toLabel(minutes).replace(':', '')}00`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Brickell Barber//Reserva//ES', 'BEGIN:VEVENT', `UID:${Date.now()}@brickell-barber`, `DTSTART:${stamp(time.minutes)}`, `DTEND:${stamp(time.minutes + durationOf(service))}`, `SUMMARY:${service.name} · Brickell Barber`, `DESCRIPTION:Con ${confirmed?.barber.name}`, 'LOCATION:Brickell Barber', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    link.download = 'cita-brickell-barber.ics';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const monthDays = useMemo(() => {
    const first = new Date(viewMonth);
    const leading = (first.getDay() + 6) % 7;
    const total = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    return [...Array<null>(leading).fill(null), ...Array.from({ length: total }, (_, index) => new Date(first.getFullYear(), first.getMonth(), index + 1))];
  }, [viewMonth]);
  const canPrevMonth = viewMonth > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNextMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1) <= lastDay;
  const shiftMonth = (delta: number) => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1));

  const onCalendarKey = (event: React.KeyboardEvent, day: Date) => {
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const target = addDays(day, moves[event.key]);
    if (!inWindow(target)) return;
    if (target.getMonth() !== viewMonth.getMonth()) setViewMonth(new Date(target.getFullYear(), target.getMonth(), 1));
    setFocusDate(target);
  };

  const periods = [
    { name: 'Mañana', slots: slots.filter((slot) => slot.minutes < 12 * 60) },
    { name: 'Tarde', slots: slots.filter((slot) => slot.minutes >= 12 * 60 && slot.minutes < 17 * 60) },
    { name: 'Noche', slots: slots.filter((slot) => slot.minutes >= 17 * 60) },
  ].filter((period) => period.slots.length);

  const summaryRows = [
    { label: 'Servicio', value: service.name, detail: `${service.duration} · ${service.price}`, step: 0 },
    { label: 'Barbero', value: barberChosen ? barber?.name ?? 'Primero disponible' : null, step: 1 },
    { label: 'Fecha y hora', value: time ? `${dateShort} · ${time.label}` : null, step: 2 },
  ];

  return (
    <div className="bk-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="bk-panel" role="dialog" aria-modal="true" aria-labelledby="bk-title" ref={panelRef}>
        <aside className="bk-aside" aria-label="Resumen de tu reserva">
          <div className="bk-aside-photo"><img src={`${basePath}${service.image}`} alt="" /></div>
          <p className="eyebrow">Tu reserva</p>
          <dl className="bk-summary">
            {summaryRows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value ? <button type="button" onClick={() => !confirmed && setStep(row.step)} disabled={!!confirmed}><span>{row.value}</span>{row.detail && <small>{row.detail}</small>}</button> : <span className="bk-pending">Por elegir</span>}</dd>
              </div>
            ))}
          </dl>
          <div className="bk-total"><span>Total</span><strong>{service.price}</strong></div>
          <p className="bk-note">Pagas en la barbería. Puedes cancelar sin costo hasta 2 h antes.</p>
        </aside>

        <div className="bk-main">
          <header className="bk-top">
            {!confirmed && <ol className="bk-steps">
              {steps.map((label, index) => (
                <li key={label} className={index === step ? 'current' : index < step ? 'done' : ''}>
                  <button type="button" onClick={() => setStep(index)} disabled={index > maxReachable || index === step} aria-current={index === step ? 'step' : undefined}>
                    <span className="bk-step-dot">{index < step ? '✓' : index + 1}</span><span className="bk-step-label">{label}</span>
                  </button>
                </li>
              ))}
            </ol>}
            <button className="bk-close" type="button" onClick={onClose} aria-label="Cerrar reserva">×</button>
          </header>

          <div className="bk-body" ref={bodyRef}>
            {confirmed ? (
              <div className="bk-success">
                <span className="bk-success-icon" aria-hidden="true">✓</span>
                <p className="eyebrow">Solicitud lista</p>
                <h2 id="bk-title" ref={headingRef} tabIndex={-1}>Nos vemos<br /><em>pronto, {form.name.trim().split(' ')[0]}.</em></h2>
                <div className="bk-ticket">
                  <div><span>Servicio</span><strong>{service.name}</strong></div>
                  <div><span>Barbero</span><strong>{confirmed.barber.name}</strong></div>
                  <div><span>Fecha</span><strong>{dateLong}</strong></div>
                  <div><span>Hora</span><strong>{time?.label} · {service.duration}</strong></div>
                </div>
                <p className="bk-hint">Envíanos tu reserva por WhatsApp para confirmarla al instante.</p>
                <div className="bk-success-actions">
                  <a className="button button-primary" href={whatsappUrl()} target="_blank" rel="noreferrer">Confirmar por WhatsApp <span aria-hidden="true">↗</span></a>
                  <button type="button" className="button button-outline" onClick={downloadCalendar}>Añadir al calendario</button>
                </div>
                <button type="button" className="text-link bk-back-site" onClick={onClose}>Volver al sitio</button>
              </div>
            ) : <>
              <div className="bk-heading">
                <p className="eyebrow">Paso {step + 1} de 4</p>
                <h2 id="bk-title" ref={headingRef} tabIndex={-1}>{['¿Qué te hacemos hoy?', '¿Con quién te atiendes?', '¿Cuándo te queda mejor?', 'Último paso.'][step]}</h2>
              </div>

              {step === 0 && <div className="bk-cards" role="radiogroup" aria-label="Servicios">
                {services.map((item) => (
                  <button type="button" role="radio" aria-checked={service.id === item.id} key={item.id} className={`bk-card ${service.id === item.id ? 'selected' : ''}`} onClick={() => chooseService(item)}>
                    <img src={`${basePath}${item.image}`} alt="" />
                    <span className="bk-card-text"><strong>{item.name}</strong><small>{item.description}</small><span className="bk-card-meta">{item.duration}{item.tag && <em>{item.tag}</em>}</span></span>
                    <span className="bk-card-price">{item.price}</span>
                  </button>
                ))}
              </div>}

              {step === 1 && <div className="bk-cards" role="radiogroup" aria-label="Barberos">
                <button type="button" role="radio" aria-checked={barberChosen && !barber} className={`bk-card ${barberChosen && !barber ? 'selected' : ''}`} onClick={() => chooseBarber(null)}>
                  <span className="bk-any" aria-hidden="true">✦</span>
                  <span className="bk-card-text"><strong>Primero disponible</strong><small>Más horarios para elegir</small></span>
                  <span className="bk-badge">Recomendado</span>
                </button>
                {barbers.map((item) => (
                  <button type="button" role="radio" aria-checked={barber?.id === item.id} key={item.id} className={`bk-card ${barber?.id === item.id ? 'selected' : ''}`} onClick={() => chooseBarber(item)}>
                    <img className="bk-avatar" src={`${basePath}${item.image}`} alt="" />
                    <span className="bk-card-text"><strong>{item.name}</strong><small>{item.specialty}</small></span>
                  </button>
                ))}
              </div>}

              {step === 2 && <div className="bk-schedule">
                <div className="bk-calendar">
                  {nextAvailable && !(sameDay(date, nextAvailable.day) && time?.minutes === nextAvailable.slot.minutes) && (
                    <button type="button" className="bk-quick" onClick={jumpToNextAvailable}>
                      <span>Lo antes posible</span>
                      <strong>{sameDay(nextAvailable.day, today) ? 'Hoy' : sameDay(nextAvailable.day, addDays(today, 1)) ? 'Mañana' : capitalize(format(nextAvailable.day, { weekday: 'short', day: 'numeric' }))} · {nextAvailable.slot.label}</strong>
                    </button>
                  )}
                  <div className="bk-month">
                    <button type="button" onClick={() => shiftMonth(-1)} disabled={!canPrevMonth} aria-label="Mes anterior">‹</button>
                    <strong aria-live="polite">{capitalize(format(viewMonth, { month: 'long', year: 'numeric' }))}</strong>
                    <button type="button" onClick={() => shiftMonth(1)} disabled={!canNextMonth} aria-label="Mes siguiente">›</button>
                  </div>
                  <div className="bk-grid" role="grid" aria-label="Calendario">
                    {weekdays.map((day, index) => <span className="bk-weekday" key={index} aria-hidden="true">{day}</span>)}
                    {monthDays.map((day, index) => {
                      if (!day) return <span key={`blank-${index}`} />;
                      const available = inWindow(day) ? slotsFor(day).length : 0;
                      const selected = sameDay(day, date);
                      const tabbable = selected || (!date && sameDay(day, today));
                      const status = !inWindow(day) ? '' : available === 0 ? 'full' : available <= 4 ? 'few' : 'open';
                      return (
                        <button type="button" key={dayKey(day)} data-day={dayKey(day)} tabIndex={tabbable ? 0 : -1}
                          className={`bk-day ${status} ${selected ? 'selected' : ''} ${sameDay(day, today) ? 'today' : ''}`}
                          disabled={!available} aria-pressed={selected}
                          aria-label={`${format(day, { weekday: 'long', day: 'numeric', month: 'long' })}${!inWindow(day) ? '' : available ? `, ${available} horarios` : ', sin horarios'}`}
                          onClick={() => chooseDate(day)} onKeyDown={(event) => onCalendarKey(event, day)}>
                          {day.getDate()}
                        </button>
                      );
                    })}
                  </div>
                  <div className="bk-legend" aria-hidden="true"><span className="open">Disponible</span><span className="few">Pocos lugares</span><span className="full">Lleno</span></div>
                </div>

                <div className="bk-times" ref={timesRef}>
                  <p className="bk-times-title">{date ? dateLong : 'Elige un día'}<small>{date && (date.getDay() === 0 ? 'Domingo · 10:00 — 16:00' : 'Abierto 10:00 — 21:00')}</small></p>
                  {date && !slots.length && <div className="bk-empty"><p>Ya no quedan horarios este día.</p>{nextAvailable && <button type="button" className="text-link" onClick={jumpToNextAvailable}>Ver el siguiente disponible →</button>}</div>}
                  {periods.map((period) => (
                    <div className="bk-period" key={period.name}>
                      <span className="bk-period-name">{period.name}<small>{period.slots.length} libres</small></span>
                      <div className="bk-slots" role="radiogroup" aria-label={`Horarios de la ${period.name.toLowerCase()}`}>
                        {period.slots.map((slot) => (
                          <button type="button" role="radio" aria-checked={time?.minutes === slot.minutes} key={slot.minutes} className={`bk-slot ${time?.minutes === slot.minutes ? 'selected' : ''}`} onClick={() => setTime(slot)}>{slot.label}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>}

              {step === 3 && <form id="bk-form" className="bk-form" noValidate onSubmit={(event) => { event.preventDefault(); goNext(); }}>
                <label className={touched && form.name.trim().length < 2 ? 'invalid' : ''}>Nombre<input name="name" autoComplete="name" placeholder="¿Cómo te llamamos?" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><small>Escribe tu nombre.</small></label>
                <label className={touched && !phoneValid ? 'invalid' : ''}>WhatsApp / teléfono<input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="55 1234 5678" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /><small>Necesitamos 10 dígitos para confirmarte.</small></label>
                <label className={touched && !emailValid ? 'invalid' : ''}>Correo <span className="bk-optional">opcional</span><input name="email" type="email" autoComplete="email" placeholder="tu@email.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><small>Revisa el formato del correo.</small></label>
                <label>Notas para tu barbero <span className="bk-optional">opcional</span><textarea name="notes" rows={2} placeholder="Ej. fade bajo, mantener largo arriba" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
              </form>}
            </>}
          </div>

          {!confirmed && <footer className="bk-foot">
            <div className="bk-foot-summary" aria-live="polite">
              <strong>{service.name} · {service.price}</strong>
              <span>{time ? `${dateShort} · ${time.label}` : barberChosen ? barber?.name ?? 'Primero disponible' : service.duration}</span>
            </div>
            <div className="bk-foot-actions">
              {step > 0 && <button type="button" className="bk-back" onClick={() => setStep(step - 1)} aria-label="Paso anterior">←</button>}
              <button type="button" className="button button-primary" onClick={goNext} disabled={!canContinue && step < 3}>
                {step === 3 ? 'Confirmar cita' : step === 2 && !time ? 'Elige una hora' : 'Continuar'} <span aria-hidden="true">→</span>
              </button>
            </div>
          </footer>}
        </div>
      </section>
    </div>
  );
}
