import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Activity, ShieldCheck, BarChart3, Clock } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-24 px-6 sm:px-10 lg:px-16 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="container mx-auto text-center relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <Activity className="w-8 h-8 text-blue-500 absolute -top-3 -right-3 animate-pulse" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
          Heart Disease{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-red-500">
            Prediction
          </span>{" "}
          System
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Empower your health with instant AI-driven risk analysis.
          Get clear, personalized predictions based on trusted medical data.
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={() => navigate("/predict")}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200"
        >
          Get Started
          <Heart className="w-5 h-5 ml-2" />
        </Button>

        {/* Features Section */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-4">
            <ShieldCheck className="text-green-500 w-6 h-6 mt-1" />
            <div>
              <h4 className="font-semibold text-lg">Privacy First</h4>
              <p className="text-sm">
                All predictions run locally or securely in the cloud with encryption.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <BarChart3 className="text-blue-500 w-6 h-6 mt-1" />
            <div>
              <h4 className="font-semibold text-lg">Data-Driven Accuracy</h4>
              <p className="text-sm">
                Trained on thousands of real-world medical records for reliable results.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Clock className="text-yellow-500 w-6 h-6 mt-1" />
            <div>
              <h4 className="font-semibold text-lg">Instant Results</h4>
              <p className="text-sm">
                No waiting—just enter your data and get a prediction in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/2 right-20 w-20 h-20 bg-red-200 dark:bg-red-700 rounded-full opacity-20 animate-ping delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-blue-300 dark:bg-blue-700 rounded-full opacity-20 animate-ping delay-2000"></div>
      </div>
    </section>
  );
};

export default Hero;
