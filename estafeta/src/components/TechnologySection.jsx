import { asset, technologyCards } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function TechnologySection() {
  return (
    <section className="technology-section section-block">
      <div className="container">
        <div className="technology-heading">
          <h2>Tecnología e innovación a tu servicio</h2>
          <p>Conoce nuestras herramientas y desarrollos tecnológicos para administrar y dar seguimiento a tus envíos.</p>
        </div>
        <div className="technology-grid">
          <video controls src={asset('technology-video.mp4')}>
            Su navegador no soporta vídeos HTML5.
          </video>
          <div className="technology-list">
            {technologyCards.map((card) => (
              <article className="technology-card" key={card.title}>
                <MaterialIcon name={card.icon} />
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
