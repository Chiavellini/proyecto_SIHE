import { useState } from 'react';
import { asset } from '../data/siteData.js';

export default function CyberAlert() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <section className="cyber-alert" style={{ backgroundImage: `url(${asset('cyber-alert.webp')})` }}>
      <button type="button" onClick={() => setVisible(false)}>
        Cerrar
      </button>
    </section>
  );
}
