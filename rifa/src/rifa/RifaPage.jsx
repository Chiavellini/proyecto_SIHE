import { useEffect, useMemo, useState } from 'react';
import MaterialIcon from '../components/MaterialIcon.jsx';
import { createRifaAccount, loadRifaCount, loadRifaSession, signInRifa, signOutRifa } from './rifaClient.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initialForm = { email: '', password: '', confirmPassword: '' };
const productPhotos = [
  {
    src: 'https://www.apple.com/newsroom/images/2024/09/the-iphone-16-lineup-airpods-4-apple-watch-series-10-arrive-around-the-world/article/Apple-Myeongdong-Seoul-iPhone-16-lineup-240920_big.jpg.large.jpg',
    alt: 'Línea de iPhone 16 en exhibición',
  },
  {
    src: 'https://www.apple.com/newsroom/images/2024/09/introducing-apple-watch-series-10/article/Apple-Watch-Series-10-profile-240909_big.jpg.large.jpg',
    alt: 'Apple Watch Series 10',
  },
  {
    src: 'https://www.apple.com/newsroom/images/2025/09/introducing-airpods-pro-3-the-ultimate-audio-experience/article/Apple-AirPods-Pro-3-hero-250909_inline.jpg.large.jpg',
    alt: 'AirPods Pro 3',
  },
];

function formatSignupDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
}

function normalizeAuthError(error) {
  const message = error?.message ?? '';
  if (/already registered|user already exists|email exists|already has an account/i.test(message)) {
    return 'Este correo ya tiene una cuenta. Inicia sesión.';
  }
  if (/invalid login credentials|authentication failed|incorrect email or password/i.test(message)) {
    return 'Correo o contraseña incorrectos.';
  }
  if (/at least 8 characters|password must be at least 8/i.test(message)) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (/valid email/i.test(message)) {
    return 'Ingresa un correo electrónico válido.';
  }
  return message || 'Algo salió mal.';
}

export default function RifaPage() {
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState(initialForm);
  const [session, setSession] = useState(null);
  const [entrantCount, setEntrantCount] = useState(null);
  const [busy, setBusy] = useState(true);
  const [status, setStatus] = useState({ kind: 'idle', message: '' });

  const account = session?.account ?? null;
  const isSignedIn = Boolean(account);
  const panelTitle = mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta';

  const heroStat = useMemo(() => {
    if (entrantCount == null) return '...';
    return String(entrantCount).padStart(2, '0');
  }, [entrantCount]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { session: currentSession } = await loadRifaSession();
      if (!active) return;
      setSession(currentSession);
      setBusy(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session) {
        setEntrantCount(null);
        return;
      }
      const { count } = await loadRifaCount();
      if (!cancelled) setEntrantCount(count);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    if (session) {
      setMode('entered');
      setStatus({ kind: 'idle', message: '' });
    }
  }, [session]);

  const handleFieldChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const resetFeedback = () => setStatus({ kind: 'idle', message: '' });

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    resetFeedback();

    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!emailPattern.test(email)) {
      setStatus({ kind: 'error', message: 'Ingresa un correo electrónico válido.' });
      return;
    }
    if (password.length < 8) {
      setStatus({ kind: 'error', message: 'La contraseña debe tener al menos 8 caracteres.' });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ kind: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    setStatus({ kind: 'loading', message: '' });
    const { data, error } = await createRifaAccount({ email, password });
    if (error) {
      setStatus({ kind: 'error', message: normalizeAuthError(error) });
      return;
    }

    if (data?.account) {
      setSession({ token: data.sessionToken, account: data.account });
      setForm(initialForm);
      setStatus({ kind: 'success', message: 'Cuenta creada. Ya estás inscrito en la rifa.' });
      return;
    }

    setStatus({ kind: 'error', message: 'Algo salió mal.' });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    resetFeedback();

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!emailPattern.test(email)) {
      setStatus({ kind: 'error', message: 'Ingresa un correo electrónico válido.' });
      return;
    }

    setStatus({ kind: 'loading', message: '' });
    const { data, error } = await signInRifa({ email, password });
    if (error) {
      setStatus({ kind: 'error', message: normalizeAuthError(error) });
      return;
    }

    if (data?.account) {
      setSession({ token: data.sessionToken, account: data.account });
      setForm(initialForm);
      setStatus({ kind: 'success', message: 'Sesión iniciada.' });
      return;
    }

    setStatus({ kind: 'error', message: 'Correo o contraseña incorrectos.' });
  };

  const handleLogout = async () => {
    setStatus({ kind: 'loading', message: '' });
    await signOutRifa();
    setSession(null);
    setEntrantCount(null);
    setMode('signup');
    setStatus({ kind: 'idle', message: '' });
  };

  const email = account?.email ?? form.email.trim().toLowerCase();

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Rifa</p>
          <h1>Crea una cuenta para participar</h1>
          <p className="lede">
            Regístrate una vez, vuelve después e inicia sesión desde el mismo enlace para consultar tu estado en la rifa.
          </p>
          <div className="hero-chips" aria-hidden="true">
            <div className="chip">
              <MaterialIcon name="verified_user" filled />
              <span>Inicio seguro</span>
            </div>
            <div className="chip">
              <MaterialIcon name="schedule" />
              <span>Sesión persistente</span>
            </div>
            <div className="chip">
              <MaterialIcon name="group" />
              <span>{heroStat} participantes</span>
            </div>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="product-grid">
            {productPhotos.map((photo) => (
              <figure className="product-card" key={photo.alt}>
                <img src={photo.src} alt={photo.alt} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        {busy ? (
          <div className="state">
            <MaterialIcon name="progress_activity" />
            <span>Cargando tu sesión.</span>
          </div>
        ) : isSignedIn ? (
          <div className="entered">
            <div className="state-head">
              <span className="badge">
                <MaterialIcon name="check_circle" filled />
              </span>
              <div>
                <h2>¡Ya estás inscrito en la rifa!</h2>
                <p>Puedes volver más tarde e iniciar sesión con la misma cuenta.</p>
              </div>
            </div>

            <dl className="details">
              <div>
                <dt>Correo</dt>
                <dd>{email}</dd>
              </div>
              <div>
                <dt>Fecha de registro</dt>
                <dd>{formatSignupDate(account.signup_date)}</dd>
              </div>
              <div>
                <dt>Participante</dt>
                <dd>{typeof account.participant_number === 'number' || typeof account.participant_number === 'bigint' ? `#${account.participant_number}` : 'Asignado al registrarte'}</dd>
              </div>
              <div>
                <dt>Total de participantes</dt>
                <dd>{entrantCount == null ? 'No disponible por ahora' : entrantCount}</dd>
              </div>
            </dl>

            <p className="note">Cuando se haga el sorteo, podrás consultar los resultados aquí.</p>

            <button className="button secondary" type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <>
            <div className="switcher" role="tablist" aria-label="Modo de autenticación">
              <button
                aria-selected={mode === 'signup'}
                className={mode === 'signup' ? 'active' : ''}
                role="tab"
                type="button"
                onClick={() => {
                  setMode('signup');
                  resetFeedback();
                }}
              >
                Crear cuenta
              </button>
              <button
                aria-selected={mode === 'login'}
                className={mode === 'login' ? 'active' : ''}
                role="tab"
                type="button"
                onClick={() => {
                  setMode('login');
                  resetFeedback();
                }}
              >
                Iniciar sesión
              </button>
            </div>

            <div className="form-head">
              <h2>{panelTitle}</h2>
              <p>{mode === 'login' ? 'Las personas que ya participaron pueden confirmar su inscripción.' : 'Usa tu correo y contraseña para entrar a la rifa.'}</p>
            </div>

            <form className="form" onSubmit={mode === 'login' ? handleLogin : handleCreateAccount}>
              <label>
                <span>Correo electrónico</span>
                <input
                  autoComplete="email"
                  inputMode="email"
                  placeholder="nombre@correo.com"
                  type="email"
                  value={form.email}
                  onChange={handleFieldChange('email')}
                />
              </label>

              <label>
                <span>Contraseña</span>
                <input
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={8}
                  placeholder="Al menos 8 caracteres"
                  type="password"
                  value={form.password}
                  onChange={handleFieldChange('password')}
                />
              </label>

              {mode === 'signup' ? (
                <label>
                  <span>Confirmar contraseña</span>
                  <input
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="Repite la contraseña"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleFieldChange('confirmPassword')}
                  />
                </label>
              ) : null}

              {status.message ? (
                <div className={`message is-${status.kind}`} aria-live="polite">
                  <MaterialIcon
                    name={status.kind === 'error' ? 'error' : status.kind === 'success' ? 'check_circle' : 'sync'}
                    filled
                  />
                  <span>{status.message}</span>
                </div>
              ) : null}

              <button className="button" disabled={status.kind === 'loading'} type="submit">
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta y entrar a la rifa'}
              </button>
            </form>

            <div className="links">
              {mode === 'login' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    resetFeedback();
                  }}
                >
                  Crear cuenta
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    resetFeedback();
                  }}
                >
                  ¿Ya tienes cuenta? Inicia sesión
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
