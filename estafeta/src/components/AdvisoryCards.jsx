import { asset } from '../data/siteData.js';
import ActionButton from './ActionButton.jsx';
import SectionTitle from './SectionTitle.jsx';

export default function AdvisoryCards({ onContactOpen }) {
  return (
    <section className="advisory-section section-block">
      <div className="container">
        <SectionTitle text="Consultas y" strong="asesoría personalizada" />
        <div className="advisory-grid">
          <article className="advisory-card image-card">
            <img src={asset('advisory.webp')} alt="" />
            <div>
              <p>Nuestros servicios a tu alcance, compra desde una guía en Tienda Estafeta o encuentra tu sucursal más cercana.</p>
              <ActionButton href="https://tienda.estafeta.com/" target="_blank">
                Comprar una guía
              </ActionButton>
              <ActionButton to="/buscar-sucursal">Buscar una sucursal</ActionButton>
            </div>
          </article>
          <article className="advisory-card">
            <h3>Sector PyMe &amp; Empresarial</h3>
            <p>
              Si eres un emprendedor o una gran empresa, en Estafeta tienes el aliado logístico que necesitas para hacer crecer
              tu negocio. Con un análisis detallado de tus necesidades, convertimos retos industriales en oportunidades.
            </p>
            <ActionButton onClick={onContactOpen}>Contactar a un asesor</ActionButton>
          </article>
        </div>
      </div>
    </section>
  );
}
