import { Link } from 'react-router-dom';
import { asset, sustainabilityItems } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';
import SectionTitle from './SectionTitle.jsx';

export default function AboutSection() {
  return (
    <section className="about-section section-block">
      <div className="container">
        <SectionTitle text="Acerca de" strong="Estafeta" />
        <p className="about-intro">
          Somos el integrador logístico, cuyo modelo de operación se basa en la sostenibilidad ambiental, social y financiera.
          La oferta logística integrada de Estafeta da soporte a la dinámica de los negocios en México y el mundo.
        </p>
        <div className="about-grid">
          <img src={asset('about-truck.webp')} alt="Trailer Estafeta" />
          <div className="sustainability-grid">
            {sustainabilityItems.map((item) => (
              <article className="sustainability-card" key={item}>
                <MaterialIcon name="eco" />
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
        <Link className="inline-link about-link" to="/sostenibilidad">
          Leer más <MaterialIcon name="chevron_right" />
        </Link>
      </div>
    </section>
  );
}
