import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ContactDrawer from './ContactDrawer.jsx';

export default function Layout({ children, contactOpen, onContactClose }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <ContactDrawer isOpen={contactOpen} onClose={onContactClose} />
    </>
  );
}
