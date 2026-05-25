# Component Inventory

All UI components used to build the replica live in `src/components`. Content, links, and asset references live in `src/data/siteData.js` so components stay reusable.

## Layout

- `Layout.jsx`: Global page shell. Renders `Header`, the active route content, `Footer`, and the shared `ContactDrawer`.
- `Header.jsx`: Two-level Estafeta header with logo, search strip, branch link, language control, dropdown navigation, store shortcut, and account menu.
- `Footer.jsx`: App download block, social links, quick links, company links, legal links, floating WhatsApp button, and scroll-to-top control.
- `ContactDrawer.jsx`: Right-side contact form drawer reused by the home page and internal page shells.

## UI Primitives

- `MaterialIcon.jsx`: Wraps Google Material Symbols with consistent class names.
- `ActionButton.jsx`: Shared button/link component supporting internal routes, external links, icons, and click handlers.
- `SectionTitle.jsx`: Shared Estafeta-style title with lightweight text, bold segment, and red underline.

## Home Page Sections

- `HomePage.jsx`: Assembles the full landing page from reusable section components.
- `CyberAlert.jsx`: Dismissible fraud/cybersecurity banner using the downloaded Estafeta alert artwork.
- `HeroBanner.jsx`: Main recruitment hero with breadcrumb, two calls to action, red photographic background, and fleet overlay.
- `AlertStrip.jsx`: Raised alerts and notices panel below the hero.
- `ServiceOverview.jsx`: Integrador Logistico split section with service highlight rows.
- `SuccessStories.jsx`: Reusable carousel-style case study panel.
- `AdvisoryCards.jsx`: Two consultation cards for guide purchase, branch search, and advisor contact.
- `TechnologySection.jsx`: Dark video section with technology feature cards.
- `AboutSection.jsx`: Acerca de Estafeta content with sustainability card grid.
- `NewsPromoSection.jsx`: Noticias Estafeta carousel card plus promotions panel.
- `HelpSection.jsx`: Help image, support links, and advisor contact action.
- `RedeliveryPage.jsx`: Dedicated subpage for reprogramar entrega after an unsuccessful home delivery attempt.
- `RedeliveryForm.jsx`: Form used by `RedeliveryPage` to collect tracking, address, availability, and contact details.

## Route Shells

- `GenericPage.jsx`: Generates the internal pages listed in the navigation and footer. It switches between tracking, quote, branch-search, support, and general service shells based on each route's `kind`.
- `RedeliveryPage.jsx`: Bypasses the generic route shell for `kind: "redelivery"` routes. The primary route is `/reprogramar-entrega`; previous URLs redirect there.

## Data Modules

- `src/data/siteData.js`: Navigation, footer links, route metadata, home page card data, news data, and asset helper.

## Asset Location

Downloaded public assets are stored in `public/assets` and referenced with the shared `asset()` helper.
