export const asset = (fileName) => `/assets/${fileName}`;

export const navigation = [
  {
    label: 'Rastreo',
    items: [
      { label: 'Rastrear envío', path: '/rastrear-envio', kind: 'tracking' },
      { label: 'Rastrear carga aérea', path: '/rastrear-carga-aerea', kind: 'tracking' },
      { label: 'Soporte a rastreos', path: '/soporte-a-rastreos', kind: 'support' },
    ],
  },
  {
    label: 'Nuestra cadena de valor',
    items: [
      { label: 'Estafeta como integrador logístico', path: '/estafeta-como-integrador-logistico', kind: 'corporate' },
      { label: 'Logística especializada', path: '/logistica-especializada', kind: 'service' },
      { label: 'enBIO', path: '/enbio', kind: 'corporate' },
      { label: 'Innovación y tecnología', path: '/innovacion-y-tecnologia', kind: 'technology' },
      { label: 'PUDOS', path: '/pudos', kind: 'service' },
    ],
  },
  {
    label: 'Servicios',
    columns: [
      {
        label: 'Lo más buscado',
        path: '/lo-mas-buscado',
        items: [
          { label: 'Cotizar envío', path: '/cotizar-envio', kind: 'quote' },
          { label: 'Buscar sucursal', path: '/buscar-sucursal', kind: 'location' },
          { label: 'Frecuencia de entregas', path: '/frecuencia-de-entregas', kind: 'service' },
          { label: 'Reprogramar entrega', path: '/reprogramar-entrega', kind: 'redelivery' },
          { label: 'Cargo por Combustible', path: '/cargo-por-combustible', kind: 'service' },
          { label: 'Buscador de Zonas', path: '/buscador-de-zonas', kind: 'location' },
        ],
      },
      {
        label: 'Internacional',
        path: '/internacional',
        items: [
          { label: 'Mensajería y paquetería', path: '/servicios/internacional/mensajeria-y-paqueteria1', kind: 'service' },
          { label: 'LTL', path: '/servicios/internacional/ltl', kind: 'service' },
          { label: 'Freight Forwarding', path: '/servicios/internacional/freight-forwarding', kind: 'service' },
          { label: 'Agente aduanal', path: '/servicios/internacional/agente-aduanal', kind: 'service' },
        ],
      },
      {
        label: 'Nacional',
        path: '/nacional',
        items: [
          { label: 'Mensajería y paquetería', path: '/servicios/nacional/mensajeria-y-paqueteria', kind: 'service' },
          { label: 'Distribución (LTL/FTL)', path: '/servicios/nacional/distribucion-ltl-ftl', kind: 'service' },
          { label: 'Logística inversa', path: '/servicios/nacional/logistica-inversa', kind: 'service' },
          { label: 'Comprar guías prepagadas', path: '/comprar-guias-prepagadas', kind: 'quote' },
        ],
      },
      {
        label: 'Supply Chain',
        path: '/supply-chain',
        items: [],
      },
    ],
  },
  {
    label: 'Atención a clientes',
    items: [
      { label: 'Envíos exitosos', path: '/envios-exitosos', kind: 'support' },
      { label: 'Soporte a rastreos', path: '/soporte-a-rastreos', kind: 'support' },
      { label: 'Confirmaciones y Excepciones', path: '/confirmaciones-y-excepciones', kind: 'support' },
      { label: 'Reprogramar entrega', path: '/reprogramar-entrega', kind: 'redelivery' },
      { label: 'Facturación', path: '/facturacion', kind: 'billing' },
      { label: 'Indemnizaciones', path: '/indemnizaciones', kind: 'support' },
      { label: 'Preguntas frecuentes', path: '/preguntas-frecuentes', kind: 'support' },
    ],
  },
  {
    label: 'Ciberseguridad',
    path: '/ciberseguridad',
    kind: 'support',
  },
];

export const accountLinks = [
  { label: 'Mi Estafeta', href: 'https://mi.estafeta.com/' },
  { label: 'Aliados Estafeta', href: 'https://mi.estafeta.com/PDC/' },
  { label: 'Comando Estafeta', href: 'https://soeoe.estafeta.com/ComandoWeb/' },
];

export const footerLinks = {
  quick: [
    { label: 'Rastrear envío', path: '/rastrear-envio1', kind: 'tracking' },
    { label: 'Cotizar envío', path: '/cotizar-envio1', kind: 'quote' },
    { label: 'Buscar sucursal', path: '/buscar-sucursal1', kind: 'location' },
    { label: 'Mi Estafeta', path: '/mi-estafeta', kind: 'account' },
    { label: 'Promociones', path: '/promociones', kind: 'promotions' },
  ],
  company: [
    { label: 'Acerca de Estafeta', path: '/acerca-de-estafeta', kind: 'corporate' },
    { label: 'Sostenibilidad', path: '/sostenibilidad', kind: 'corporate' },
    { label: 'Estafeta y UPS', path: '/estafeta-y-ups', kind: 'corporate' },
    { label: 'Únete a Estafeta', path: '/unete-a-estafeta', kind: 'corporate' },
    { label: 'Sala de prensa', path: '/noticias', kind: 'news' },
    { label: 'Blog', path: '/blog', kind: 'news' },
    { label: 'Contacto', path: '/contacto', kind: 'contact' },
  ],
  legal: [
    { label: 'Términos y condiciones', path: '/terminos-y-condiciones', kind: 'legal' },
    { label: 'Aviso de privacidad', path: '/aviso-de-privacidad', kind: 'legal' },
    { label: 'Contrato de servicios', path: '/contrato-de-servicios', kind: 'legal' },
  ],
};

export const serviceHighlights = [
  {
    icon: 'package_2',
    title: 'Supply Chain',
    text: 'Revolucionamos el mercado con logística especializada por industria. Construimos soluciones flexibles y ágiles para la cadena de suministro mientras apoyamos la rentabilidad e innovación en los negocios de nuestros clientes.',
    path: '/supply-chain',
  },
  {
    icon: 'public',
    title: 'Internacional',
    text: 'Desde una pequeña caja, hasta un contenedor, nuestros servicios de importación y exportación te conectan con más de 220 países y territorios gracias a una red global de operadores y aliados internacionales para el traslado y manejo de mercancías.',
    path: '/servicios/internacional/mensajeria-y-paqueteria1',
  },
  {
    icon: 'local_shipping',
    title: 'Nacional',
    text: 'Amplia cobertura nacional en servicios de distribución, última milla y logística inversa de alta escalabilidad, que en combinación con nuestra sólida infraestructura agregan poder operativo a tu logística.',
    path: '/servicios/nacional/mensajeria-y-paqueteria',
  },
];

export const successStories = [
  {
    title: 'Automotriz',
    image: asset('case-automotive.webp'),
    quote: 'Estafeta es una empresa preparada para atender los retos de la cadena de distribución automotriz, just in time y just in secuence. La urgencia, tanto en la fabricación, como en la post venta y la demanda de refacciones, es el grito de guerra para todos.',
  },
  {
    title: 'Marketplace',
    image: asset('case-marketplace.webp'),
    quote: 'Gracias a la capacidad operativa de Estafeta, hemos logrado incrementar el alcance de nuestras ventas. La posibilidad de atender pedidos de todo el país en breves periodos suma aceptación por parte de los clientes.',
  },
  {
    title: 'Financiera',
    image: asset('case-financial.webp'),
    quote: 'Estafeta se destaca por abordar eficientemente cualquier imprevisto con decisiones adecuadas que impulsan el diálogo y la acción, con precios transparentes y visibilidad clara en cada etapa operativa.',
  },
  {
    title: 'Venta directa',
    image: asset('case-direct-sales.webp'),
    quote: 'El servicio de distribución que nuestra marca requiere debe estar enfocado en experiencias satisfactorias, tiempos de entrega y productos en buenas condiciones.',
  },
];

export const technologyCards = [
  {
    icon: 'add_to_home_screen',
    title: 'App Móvil',
    text: 'Tu logística a la mano. Sigue la ruta de tus envíos descargando nuestra app, disponible para Android y iOS.',
  },
  {
    icon: 'laptop_windows',
    title: 'Comando Estafeta',
    text: 'Esta herramienta te ayuda a generar y administrar tus guías de servicio, guardar historiales y analizar el comportamiento de tu negocio.',
  },
  {
    icon: 'account_circle',
    title: 'Beatriz',
    text: 'Programa o da seguimiento a una recolección con Bety, nuestra asistente virtual sin restricción de horarios.',
  },
];

export const sustainabilityItems = [
  'Contamos con unidades 100% eléctricas para las entregas de última milla.',
  'Nos adherimos a Supplier Ethical Data Exchange (Sedex) para alinear procesos a estándares internacionales.',
  'A través del Programa Institucional de Seguridad Vial reforzamos la cultura de prevención.',
  'Accionamos estrategias en favor del medio ambiente para minimizar nuestro impacto sin comprometer la calidad del servicio.',
];

export const newsItems = [
  {
    date: 'abril 23, 2024',
    title: 'Birth Group y Estafeta reciben el Premio AMCO 2023',
    text: 'La campaña Podemos con el Paquete Completo ha logrado transmitir al público la esencia de la oferta de valor de Estafeta.',
    image: asset('news-amco.png'),
  },
  {
    date: 'abril 23, 2024',
    title: 'Premio Acelera y Envía 2023',
    text: 'Una iniciativa para impulsar el comercio electrónico y fortalecer a las micro y pequeñas empresas.',
    image: asset('news-acelera.png'),
  },
  {
    date: 'abril 23, 2024',
    title: 'El Paquete Completo Podcast',
    text: 'Episodio 1 Ernesto Tatay, director de distrito, Estafeta.',
    image: asset('news-podcast.png'),
  },
];

export const helpLinks = [
  { label: 'Preguntas frecuentes', path: '/preguntas-frecuentes' },
  { label: 'Artículos prohibidos', path: '/articulos-prohibidos' },
  { label: 'Manual de Empaque', path: '/manual-de-empaque' },
  { label: 'Facturación', path: '/facturacion' },
];

export function flattenNavigationItems() {
  const pages = [
    { label: 'Inicio', path: '/', kind: 'home' },
    { label: 'Home', path: '/home', kind: 'home' },
    { label: 'Search', path: '/search', kind: 'search' },
  ];

  navigation.forEach((entry) => {
    if (entry.path) {
      pages.push(entry);
    }
    entry.items?.forEach((item) => pages.push(item));
    entry.columns?.forEach((column) => {
      pages.push({ label: column.label, path: column.path, kind: 'service' });
      column.items.forEach((item) => pages.push(item));
    });
  });

  Object.values(footerLinks).forEach((group) => group.forEach((item) => pages.push(item)));
  helpLinks.forEach((item) => pages.push({ ...item, kind: 'support' }));

  const seen = new Set();
  return pages.filter((page) => {
    if (!page.path || seen.has(page.path)) return false;
    seen.add(page.path);
    return true;
  });
}
