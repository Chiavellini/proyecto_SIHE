import { asset } from '../data/siteData.js';
import ActionButton from './ActionButton.jsx';

export default function HeroBanner() {
  return (
    <section className="hero-banner" style={{ backgroundImage: `url(${asset('hero-background.webp')})` }}>
      <div className="container hero-inner">
        <div className="breadcrumb-line">Inicio</div>
        <div className="hero-content">
          <h1>
            <span>¡En Estafeta,</span>
            <br />
            estamos contratando!
          </h1>
          <div className="hero-actions">
            <ActionButton icon="expand_circle_right" to="/rastrear-envio" variant="white">
              Rastrear paquete
            </ActionButton>
            <ActionButton
              href="https://uneteaestafeta.com/"
              icon="expand_circle_right"
              target="_blank"
              variant="white"
            >
              Únete a Estafeta
            </ActionButton>
          </div>
        </div>
        <img className="hero-fleet" src={asset('hero-fleet.webp')} alt="" />
      </div>
    </section>
  );
}
