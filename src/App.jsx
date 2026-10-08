import HeroSection from "./sections/HeroSection";
import IntroSection from "./sections/IntroSection";
import ProgramsSection from "./sections/ProgramsSection";
import TrainingFieldsSection from "./sections/TrainingFieldsSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import RegisterSection from "./sections/RegisterSection";
import NewsSection from "./sections/NewsSection";
import PartnersSection from "./sections/PartnersSection";
import { Seo } from "./components/Seo";
import { staticPageMeta } from "./seo/pageMeta";

function App() {
  const seoMeta = staticPageMeta("/");
  return (
    <>
      <Seo meta={seoMeta} />
      <main className="gradient-page">
        <HeroSection />
        <IntroSection />
        <TrainingFieldsSection />
        <ProgramsSection />
        <TestimonialsSection />
        <RegisterSection />
        <NewsSection />
        <PartnersSection />
      </main>
    </>
  );
}

export default App;
