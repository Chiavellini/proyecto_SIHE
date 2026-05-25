import ActionButton from './ActionButton.jsx';
import MaterialIcon from './MaterialIcon.jsx';

export default function ContactDrawer({ isOpen, onClose }) {
  return (
    <div className={`drawer-layer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <button className="drawer-backdrop" type="button" onClick={onClose} tabIndex={isOpen ? 0 : -1} />
      <aside className="contact-drawer" aria-label="Contacto">
        <button className="drawer-close" type="button" onClick={onClose}>
          <MaterialIcon name="cancel" title="Cerrar" />
        </button>
        <h2>Contacto</h2>
        <p>Si deseas conocer más información sobre nuestros productos y servicios, llena los siguientes campos.</p>
        <form className="contact-form">
          <div className="form-row">
            <label>
              Nombre
              <input type="text" />
            </label>
            <label>
              Apellidos
              <input type="text" />
            </label>
          </div>
          <label>
            Correo electrónico
            <input type="email" />
          </label>
          <label>
            Telefono
            <input type="tel" />
          </label>
          <label>
            Comentarios
            <textarea rows="5" />
          </label>
          <label className="checkbox-row">
            <input type="checkbox" />
            <span>Acepto aviso de privacidad</span>
          </label>
          <ActionButton onClick={(event) => event.preventDefault()}>Enviar</ActionButton>
        </form>
      </aside>
    </div>
  );
}
