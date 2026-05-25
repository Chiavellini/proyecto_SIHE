import MaterialIcon from './MaterialIcon.jsx';

export default function AlertStrip() {
  return (
    <section className="alert-strip">
      <div className="container">
        <div className="alert-box">
          <div className="alert-title">Alertas y avisos</div>
          <div className="alert-copy">
            <MaterialIcon name="warning" filled />
            <p>
              Tu seguridad es lo más importante, te recordamos que <strong>Estafeta NO solicita pagos en línea</strong>,
              ni pide tus datos bancarios por mensaje o llamada o a través de links sospechosos.
              <br />
              ¡Te queremos seguro!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
