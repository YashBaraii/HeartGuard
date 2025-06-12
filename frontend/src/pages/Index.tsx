
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>
      <Hero />
      <About />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
