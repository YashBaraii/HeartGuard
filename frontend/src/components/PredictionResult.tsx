import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, AlertTriangle, CheckCircle, RotateCcw, Download, Save } from "lucide-react";
import { generatePDF } from "@/utils/pdfGenerator";
import { saveResult } from "@/utils/localStorage";
import { useToast } from "@/hooks/use-toast";
import { PredictionResponse } from "@/api";

interface PredictionResultProps {
  prediction: PredictionResponse;
  formData?: any;
  onReset: () => void;
}

const PredictionResult = ({ prediction, formData, onReset }: PredictionResultProps) => {
  const isHighRisk = prediction.risk === 'high';
  const { toast } = useToast();

  useEffect(() => {
    // Auto-save result to local storage
    if (formData) {
      saveResult(prediction, formData);
    }
  }, [prediction, formData]);

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(prediction, formData || {});
      toast({
        title: "PDF Downloaded",
        description: "Your prediction report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveResult = () => {
    if (formData) {
      saveResult(prediction, formData);
      toast({
        title: "Result Saved",
        description: "Your prediction result has been saved to local storage.",
      });
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${isHighRisk ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'
          }`}>
          {isHighRisk ? (
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          ) : (
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          )}
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Prediction Results
      </h2>

      <Alert className={`max-w-2xl mx-auto transition-all duration-500 ${isHighRisk
        ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
        : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
        }`}>
        <Heart className={`h-5 w-5 ${isHighRisk ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} />
        <AlertDescription className={`text-lg font-semibold ${isHighRisk ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'
          }`}>
          {prediction.message}
        </AlertDescription>
      </Alert>

      <Card className="max-w-lg mx-auto dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg dark:text-white">Risk Assessment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Probability Score:</span>
            <span className={`font-bold text-lg ${isHighRisk ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
              }`}>
              {prediction.probability.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${isHighRisk ? 'bg-red-500' : 'bg-green-500'
                }`}
              style={{ width: `${prediction.probability}%` }}
            ></div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Assessment Time: {new Date(prediction.timestamp).toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {isHighRisk ? (
        <Card className="max-w-2xl mx-auto border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-300 flex items-center gap-2 justify-center">
              <AlertTriangle className="w-5 h-5" />
              Important Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-left text-orange-700 dark:text-orange-300">
            <ul className="space-y-2">
              <li>• Consult with a cardiologist as soon as possible</li>
              <li>• Consider lifestyle modifications (diet, exercise, stress management)</li>
              <li>• Monitor blood pressure and cholesterol levels regularly</li>
              <li>• Follow your healthcare provider's recommendations</li>
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl mx-auto border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2 justify-center">
              <CheckCircle className="w-5 h-5" />
              Maintain Your Health
            </CardTitle>
          </CardHeader>
          <CardContent className="text-left text-green-700 dark:text-green-300">
            <ul className="space-y-2">
              <li>• Continue maintaining a healthy lifestyle</li>
              <li>• Regular exercise and balanced diet</li>
              <li>• Annual health check-ups recommended</li>
              <li>• Monitor key health indicators regularly</li>
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-4 justify-center pt-6">
        <Button
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>

        <Button
          onClick={handleSaveResult}
          variant="outline"
          className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Result
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Test Again
        </Button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="font-semibold mb-2">Medical Disclaimer:</p>
        <p>
          This prediction is for educational purposes only and should not replace professional medical advice.
          Always consult with qualified healthcare professionals for medical diagnosis and treatment decisions.
        </p>
      </div>
    </div>
  );
};

export default PredictionResult;
