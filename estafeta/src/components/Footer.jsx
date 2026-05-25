import { Link } from 'react-router-dom';
import { asset, footerLinks } from '../data/siteData.js';
import MaterialIcon from './MaterialIcon.jsx';

export default function Footer() {
  return (
    <>
      <a className="floating-whatsapp" href="https://wa.me/+525552708300?text=Hola," target="_blank" rel="noreferrer">
        <img src={asset('whatsapp.png')} alt="WhatsApp" />
      </a>
      <footer className="site-footer">
        <button className="scroll-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <MaterialIcon name="arrow_upward" title="Subir" />
        </button>
        <div className="container footer-grid">
          <div className="footer-apps">
            <p className="footer-title">Descarga la App</p>
            <div className="store-badges">
              <a href="https://itunes.apple.com/mx/app/estafeta-movil/id586035594?mt=8" target="_blank" rel="noreferrer">
                <img src={asset('app-ios.svg')} alt="App Store" />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.estafeta.estafetamovilv1" target="_blank" rel="noreferrer">
                <img src={asset('app-android.svg')} alt="Google Play" />
              </a>
            </div>
            <p className="footer-title follow-title">Síguenos</p>
            <div className="social-links">
              <a href="https://www.facebook.com/estafetamx?ref=hl" target="_blank" rel="noreferrer">
                <img src={asset('facebook.svg')} alt="Facebook" />
              </a>
              <a href="https://www.youtube.com/user/estafetamx" target="_blank" rel="noreferrer">
                <img src={asset('youtube.svg')} alt="YouTube" />
              </a>
              <a href="https://www.instagram.com/estafetamx/" target="_blank" rel="noreferrer">
                <img src={asset('instagram.svg')} alt="Instagram" />
              </a>
              <a href="https://www.linkedin.com/company/estafeta-mexicana" target="_blank" rel="noreferrer">
                <img src={asset('linkedin.svg')} alt="LinkedIn" />
              </a>
              <a href="https://twitter.com/estafeta" target="_blank" rel="noreferrer">
                <img src={asset('x.svg')} alt="X" />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <p className="footer-title">Enlaces rápidos</p>
            {footerLinks.quick.map((link) => (
              <Link key={link.path} to={link.path}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="footer-links">
            <p className="footer-title">Información de la empresa</p>
            {footerLinks.company.map((link) => (
              <Link key={link.path} to={link.path}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="footer-image">
            <img src={asset('footer-van.png')} alt="Camioneta Estafeta" />
          </div>
        </div>
        <div className="container legal-row">
          {footerLinks.legal.map((link) => (
            <Link key={link.path} to={link.path}>
              {link.label}
            </Link>
          ))}
        </div>
      </footer>
    </>
  );
}
