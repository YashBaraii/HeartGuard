import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import PredictionForm from "@/components/PredictionForm";
import PredictionResult from "@/components/PredictionResult";
import { predict, PredictionResponse } from "@/api";
import { useToast } from "@/hooks/use-toast";

const Predict = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [lastFormData, setLastFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrediction = async (formData: any) => {
    try {
      setIsLoading(true);
      const result = await predict(formData);
      setPrediction(result);
      setLastFormData(formData);
    } catch (error) {
      toast({
        title: "Prediction Error",
        description: error instanceof Error ? error.message : "Failed to get prediction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPrediction(null);
    setLastFormData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="hover:bg-blue-100 dark:hover:bg-gray-700 dark:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Heart Disease Prediction</h1>
              </div>
            </div>
            <ThemeSwitcher />
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-300">
            {!prediction ? (
              <PredictionForm onSubmit={handlePrediction} isLoading={isLoading} />
            ) : (
              <PredictionResult
                prediction={prediction}
                formData={lastFormData}
                onReset={resetForm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predict;
