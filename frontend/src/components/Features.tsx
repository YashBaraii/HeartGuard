
import { CheckCircle, Zap, Database, UserCheck } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Prediction",
      description: "State-of-the-art machine learning algorithms provide accurate heart disease risk assessment."
    },
    {
      icon: CheckCircle,
      title: "Instant Results",
      description: "Get immediate predictions without any waiting time or complex procedures."
    },
    {
      icon: Database,
      title: "Based on Real Medical Data",
      description: "Our model is trained on extensive, validated medical datasets for reliable predictions."
    },
    {
      icon: UserCheck,
      title: "User-Friendly Interface",
      description: "Simple, intuitive design that makes health assessment accessible to everyone."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our System?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our heart disease prediction system combines cutting-edge technology with 
              medical expertise to provide you with accurate, actionable health insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
