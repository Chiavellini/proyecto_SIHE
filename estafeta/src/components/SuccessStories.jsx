import { useState } from 'react';
import { successStories } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';
import SectionTitle from './SectionTitle.jsx';

export default function SuccessStories() {
  const [index, setIndex] = useState(0);
  const story = successStories[index];

  const move = (step) => {
    setIndex((current) => (current + step + successStories.length) % successStories.length);
  };

  return (
    <section className="success-section section-block">
      <div className="container success-card">
        <SectionTitle text="Casos de éxito" />
        <div className="success-body">
          <div className="success-title">
            <h3>{story.title}</h3>
            <div className="vertical-rule" />
            <div className="carousel-buttons">
              <button type="button" onClick={() => move(-1)}>
                <MaterialIcon name="arrow_circle_left" title="Anterior" />
              </button>
              <button type="button" onClick={() => move(1)}>
                <MaterialIcon name="arrow_circle_right" title="Siguiente" />
              </button>
            </div>
          </div>
          <p className="success-quote">“{story.quote}”</p>
          <img src={story.image} alt={story.title} />
        </div>
      </div>
    </section>
  );
}
