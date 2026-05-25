import { Link } from 'react-router-dom';
import { asset, helpLinks } from '../data/siteData.js';
import ActionButton from './ActionButton.jsx';
import MaterialIcon from './MaterialIcon.jsx';
import SectionTitle from './SectionTitle.jsx';

export default function HelpSection({ onContactOpen }) {
  return (
    <section className="help-section section-block">
      <div className="container help-grid">
        <img src={asset('help-character.webp')} alt="" />
        <div className="help-copy">
          <SectionTitle text="" strong="¿Necesitas ayuda?" />
          <div className="help-links">
            {helpLinks.map((link) => (
              <Link to={link.path} key={link.path}>
                <MaterialIcon name="chat_info" />
                {link.label}
              </Link>
            ))}
          </div>
          <ActionButton onClick={onContactOpen}>Contactar a asesor</ActionButton>
        </div>
      </div>
    </section>
  );
}
