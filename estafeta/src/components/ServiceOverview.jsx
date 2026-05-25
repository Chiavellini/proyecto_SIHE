import { Link } from 'react-router-dom';
import { asset, serviceHighlights } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';
import SectionTitle from './SectionTitle.jsx';

export default function ServiceOverview() {
  return (
    <section className="service-overview section-block">
      <div className="container">
        <SectionTitle text="Integrador" strong="Logístico" />
        <div className="service-grid">
          <div className="service-image-wrap">
            <img src={asset('logistics-solutions.webp')} alt="Soluciones logísticas Estafeta" />
          </div>
          <div className="service-list">
            {serviceHighlights.map((item) => (
              <article className="service-item" key={item.title}>
                <MaterialIcon name={item.icon} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link className="inline-link" to={item.path}>
                    Leer más <MaterialIcon name="chevron_right" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
