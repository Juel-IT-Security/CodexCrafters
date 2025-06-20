import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";
import ExamplesGallery from "@/components/examples-gallery";
import VideoGuides from "@/components/video-guides";
import BestPractices from "@/components/best-practices";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      
      {/* Powered By Section */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-6">Proudly built and hosted on</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="flex items-center">
                <i className="fas fa-code text-2xl text-gray-700 mr-2"></i>
                <span className="text-lg font-semibold text-gray-700">Replit</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-robot text-2xl text-brand-600 mr-2"></i>
                <span className="text-lg font-semibold text-gray-700">OpenAI GPT</span>
              </div>
              <div className="flex items-center">
                <i className="fab fa-github text-2xl text-gray-700 mr-2"></i>
                <span className="text-lg font-semibold text-gray-700">Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <ExamplesGallery />
      <VideoGuides />
      <BestPractices />
      <CTASection />
      <Footer />
    </div>
  );
}
