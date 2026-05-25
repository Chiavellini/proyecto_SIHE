import { useState } from 'react';
import { Link } from 'react-router-dom';
import { asset, newsItems } from '../data/siteData.js';
import ActionButton from './ActionButton.jsx';
import MaterialIcon from './MaterialIcon.jsx';
import SectionTitle from './SectionTitle.jsx';

export default function NewsPromoSection() {
  const [index, setIndex] = useState(0);
  const news = newsItems[index];

  return (
    <section className="news-promo-section section-block">
      <div className="container news-promo-grid">
        <article className="news-column">
          <SectionTitle text="Noticias" strong="Estafeta" />
          <div className="news-card">
            <img src={news.image} alt="" />
            <div className="news-content">
              <p className="news-date">{news.date}</p>
              <h3>{news.title}</h3>
              <p>{news.text}</p>
              <ActionButton to="/blog" variant="primary">
                Leer más
              </ActionButton>
            </div>
            <div className="news-dots">
              {newsItems.map((item, itemIndex) => (
                <button
                  aria-label={item.title}
                  className={itemIndex === index ? 'active' : ''}
                  key={item.title}
                  type="button"
                  onClick={() => setIndex(itemIndex)}
                />
              ))}
            </div>
          </div>
          <Link className="inline-link all-news" to="/blog">
            Ver todas las noticias <MaterialIcon name="chevron_right" />
          </Link>
        </article>

        <article className="promo-column">
          <SectionTitle text="Promociones" />
          <Link to="/promociones">
            <img src={asset('promo-envios.webp')} alt="Promociones Estafeta" />
          </Link>
          <Link className="inline-link" to="/promociones">
            Ver todas las promociones <MaterialIcon name="chevron_right" />
          </Link>
        </article>
      </div>
    </section>
  );
}
