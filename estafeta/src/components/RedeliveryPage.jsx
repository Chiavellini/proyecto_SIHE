import { asset } from '../data/siteData.js';
import RedeliveryForm from './RedeliveryForm.jsx';

export default function RedeliveryPage() {
  return (
    <section className="redelivery-hero">
      <div className="container redelivery-hero-grid">
        <div className="redelivery-hero-copy">
          <div className="breadcrumb-line">Inicio</div>
          <h1>Reprogramar entrega</h1>
          <p>
            Si visitamos tu domicilio y no había nadie para recibir el paquete, puedes solicitar un nuevo intento de
            entrega con tus datos de rastreo.
          </p>
          <img className="redelivery-hero-fleet" src={asset('hero-fleet.webp')} alt="" />
        </div>
        <div className="redelivery-primary-form" id="solicitud-reprogramar-entrega">
          <RedeliveryForm />
        </div>
      </div>
    </section>
  );
}
