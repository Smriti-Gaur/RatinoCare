import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import TrustedBy from "./components/TrustedBy/TrustedBy";
import Features from "./components/Features/Features";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import AIDetection from "./components/AIDetection/AIDetection";
import WhyChooseUs from "./components/WhyChooseUs/WhyChooseUs";
import Statistics from "./components/Statistics/Statistics";
import UserPerspectives from "./components/UserPerspectives/UserPerspectives";
import FAQ from "./components/FAQ/FAQ";
import CTA from "./components/CTA/CTA";
import Footer from "./components/Footer/Footer";

import IntroAnimation from "./components/IntroAnimation/IntroAnimation";

const LandingPage = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleComplete = () => {
    setShowIntro(false);
  };

  const handleSkip = () => {
    setShowIntro(false);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-white">
        <Navbar />

         <Hero />

         <TrustedBy />

         <Features />

         <HowItWorks />

        <AIDetection />

        <WhyChooseUs />

        <Statistics />

        <UserPerspectives />

        <FAQ />

        <CTA />

        <Footer />
        
      </main>
    </>
  );
};

export default LandingPage;