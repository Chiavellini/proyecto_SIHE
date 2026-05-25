import { Link } from 'react-router-dom';
import { asset, serviceHighlights } from '../data/siteData.js';
import ActionButton from './ActionButton.jsx';
import MaterialIcon from './MaterialIcon.jsx';
import SectionTitle from './SectionTitle.jsx';

function TrackingPanel({ title }) {
  return (
    <article className="tool-card wide">
      <h3>{title}</h3>
      <div className="input-action">
        <input placeholder="Número de rastreo" type="text" />
        <ActionButton>Rastrear</ActionButton>
      </div>
    </article>
  );
}

function QuotePanel() {
  return (
    <article className="tool-card wide">
      <h3>Cotiza tu envío</h3>
      <div className="quote-grid">
        <input placeholder="Código postal origen" type="text" />
        <input placeholder="Código postal destino" type="text" />
        <input placeholder="Peso aproximado" type="text" />
        <ActionButton>Cotizar</ActionButton>
      </div>
    </article>
  );
}

function LocationPanel() {
  return (
    <article className="tool-card wide">
      <h3>Encuentra tu sucursal más cercana</h3>
      <div className="input-action">
        <input placeholder="Ciudad, estado o código postal" type="text" />
        <ActionButton>Buscar</ActionButton>
      </div>
    </article>
  );
}

function SupportPanel({ onContactOpen }) {
  const items = [
    { label: 'Preguntas frecuentes', path: '/preguntas-frecuentes' },
    { label: 'Facturación', path: '/facturacion' },
    { label: 'Indemnizaciones', path: '/indemnizaciones' },
    { label: 'Reprogramar entrega', path: '/reprogramar-entrega' },
  ];
  return (
    <div className="support-grid">
      {items.map((item) => (
        <Link className="support-tile" key={item.path} to={item.path}>
          <MaterialIcon name="chat_info" />
          {item.label}
        </Link>
      ))}
      <button className="support-tile" type="button" onClick={onContactOpen}>
        <MaterialIcon name="support_agent" />
        Contactar a asesor
      </button>
    </div>
  );
}

function DefaultContent({ onContactOpen }) {
  return (
    <>
      <div className="generic-feature-grid">
        {serviceHighlights.map((item) => (
          <article className="feature-card" key={item.title}>
            <MaterialIcon name={item.icon} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <div className="generic-cta">
        <img src={asset('advisory.webp')} alt="" />
        <div>
          <h3>Servicios a tu alcance</h3>
          <p>Compra una guía, encuentra sucursales o recibe asesoría personalizada desde la misma experiencia visual.</p>
          <ActionButton onClick={onContactOpen}>Contactar a un asesor</ActionButton>
        </div>
      </div>
    </>
  );
}

export default function GenericPage({ page, onContactOpen }) {
  const kind = page?.kind ?? 'service';
  const title = page?.label ?? 'Estafeta';

  return (
    <>
      <section className="generic-hero" style={{ backgroundImage: `url(${asset('hero-background.webp')})` }}>
        <div className="container">
          <div className="breadcrumb-line">Inicio</div>
          <h1>{title}</h1>
        </div>
      </section>
      <section className="generic-page section-block">
        <div className="container">
          <SectionTitle text={title} />
          {kind === 'tracking' ? <TrackingPanel title={title} /> : null}
          {kind === 'quote' ? <QuotePanel /> : null}
          {kind === 'location' ? <LocationPanel /> : null}
          {kind === 'support' || kind === 'billing' || kind === 'contact' ? (
            <SupportPanel onContactOpen={onContactOpen} />
          ) : null}
          {!['tracking', 'quote', 'location', 'support', 'billing', 'contact'].includes(kind) ? (
            <DefaultContent onContactOpen={onContactOpen} />
          ) : null}
        </div>
      </section>
    </>
  );
}
