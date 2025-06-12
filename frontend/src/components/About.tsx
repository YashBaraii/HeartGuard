
import { Shield, Brain, Clock } from "lucide-react";

const About = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How Our System Works
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Our advanced machine learning model analyzes multiple health parameters to provide 
            accurate heart disease risk predictions. Built on extensive medical research and 
            real-world data, our system offers reliable insights while maintaining complete privacy.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Advanced machine learning algorithms trained on comprehensive medical datasets 
                for accurate risk assessment.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600">
                Get immediate risk predictions based on your health parameters. 
                No waiting, no delays - just quick, reliable insights.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy & Security</h3>
              <p className="text-gray-600">
                Your data is processed locally and never stored. Complete privacy 
                and security for your sensitive health information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
