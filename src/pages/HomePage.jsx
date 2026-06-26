import HeroCarousel from '../components/HeroCarousel';
import AboutSection from '../components/AboutSection';
import TargetsSection from '../components/TargetsSection';
import WhyGermanySection from '../components/WhyGermanySection';
import CampaignDisplay from '../components/marketing/CampaignDisplay';

const HomePage = () => {
    return (
        <>
            <HeroCarousel />
            <AboutSection />
            <CampaignDisplay placement="horizontal_middle" />
            <TargetsSection />
            <WhyGermanySection />
        </>
    );
};

export default HomePage;
