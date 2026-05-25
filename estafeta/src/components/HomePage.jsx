import AboutSection from './AboutSection.jsx';
import AdvisoryCards from './AdvisoryCards.jsx';
import AlertStrip from './AlertStrip.jsx';
import CyberAlert from './CyberAlert.jsx';
import HelpSection from './HelpSection.jsx';
import HeroBanner from './HeroBanner.jsx';
import NewsPromoSection from './NewsPromoSection.jsx';
import ServiceOverview from './ServiceOverview.jsx';
import SuccessStories from './SuccessStories.jsx';
import TechnologySection from './TechnologySection.jsx';

export default function HomePage({ onContactOpen }) {
  return (
    <>
      <CyberAlert />
      <HeroBanner />
      <AlertStrip />
      <ServiceOverview />
      <SuccessStories />
      <AdvisoryCards onContactOpen={onContactOpen} />
      <TechnologySection />
      <AboutSection />
      <NewsPromoSection />
      <HelpSection onContactOpen={onContactOpen} />
    </>
  );
}
