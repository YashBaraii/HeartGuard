import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Heart, AlertTriangle, Upload } from "lucide-react";
import { ModelTooltip } from "./ModelTooltip";
import DocumentUpload from "./DocumentUpload";

interface PredictionFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const modelExplanations = {
  age: "Age is a significant risk factor for heart disease. Risk increases with age due to wear and tear on the cardiovascular system.",
  sex: "Males generally have higher risk of heart disease, especially at younger ages. The risk evens out after menopause in females.",
  chestPainType: "Different types of chest pain indicate varying levels of heart disease risk. Typical angina suggests higher risk.",
  restingBP: "Resting blood pressure measures the force of blood against artery walls. Higher values indicate increased cardiovascular stress.",
  cholesterol: "High cholesterol levels can lead to plaque buildup in arteries, increasing heart disease risk significantly.",
  fastingBS: "Elevated fasting blood sugar indicates diabetes, which significantly increases heart disease risk due to blood vessel damage.",
  restingECG: "Electrocardiogram abnormalities can indicate existing heart problems or increased risk of developing heart disease.",
  maxHR: "Maximum heart rate achieved during exercise. Lower values may indicate poor cardiovascular fitness or underlying issues.",
  exerciseAngina: "Chest pain during exercise suggests the heart muscle isn't getting enough oxygen, indicating potential blockages.",
  oldpeak: "ST depression indicates how much the heart struggles during exercise compared to rest, suggesting coronary artery issues.",
  stSlope: "The slope pattern during peak exercise reveals how well the heart responds to increased demand for oxygen."
};

const PredictionForm = ({ onSubmit, isLoading: externalLoading }: PredictionFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [useDocumentUpload, setUseDocumentUpload] = useState(false);
  const [restingBP, setRestingBP] = useState([120]);
  const [maxHR, setMaxHR] = useState([150]);
  const [formError, setFormError] = useState("");

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      age: "",
      sex: '',
      chestPainType: '',
      restingBP: 120,
      cholesterol: "",
      fastingBS: '',
      restingECG: '',
      maxHR: 150,
      exerciseAngina: '',
      oldpeak: "",
      stSlope: ''
    }
  });

  const handleDocumentAnalysis = async (extractedData: any) => {
    setIsLoading(true);

    // Populate form with extracted data
    Object.keys(extractedData).forEach(key => {
      setValue(key as any, extractedData[key]);
    });

    if (extractedData.restingBP) {
      setRestingBP([extractedData.restingBP]);
    }
    if (extractedData.maxHR) {
      setMaxHR([extractedData.maxHR]);
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsLoading(false);

    // Automatically submit the form with extracted data
    onSubmit(extractedData);
  };

  const onFormSubmit = async (data: any) => {
    setFormError("");

    // Map frontend field to backend expected field
    const mappedData = {
      ...data,
      restECG: data.restingECG,
    };
    delete mappedData.restingECG;

    // Validate required fields
    const requiredFields = ['age', 'sex', 'chestPainType', 'cholesterol', 'fastingBS', 'restECG', 'exerciseAngina', 'oldpeak', 'stSlope'];
    const emptyFields = requiredFields.filter(field => !mappedData[field] || mappedData[field] === '');

    if (emptyFields.length > 0) {
      setFormError("Please fill in all required fields before submitting.");
      return;
    }

    // Validate numeric ranges
    if (mappedData.age < 1 || mappedData.age > 120) {
      setFormError("Please enter a valid age between 1 and 120 years.");
      return;
    }

    if (mappedData.cholesterol < 0 || mappedData.cholesterol > 1000) {
      setFormError("Please enter a valid cholesterol level between 0 and 1000 mg/dl.");
      return;
    }

    if (mappedData.oldpeak < 0 || mappedData.oldpeak > 10) {
      setFormError("Please enter a valid oldpeak value between 0 and 10.");
      return;
    }

    setIsLoading(true);
    onSubmit(mappedData);
  };

  const isFormLoading = externalLoading || isLoading;

  if (useDocumentUpload) {
    return (
      <DocumentUpload
        onDocumentAnalysis={handleDocumentAnalysis}
        onToggleMode={setUseDocumentUpload}
        isUploading={isFormLoading}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Health Assessment Form</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Please fill in your health parameters for accurate prediction</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setUseDocumentUpload(true)}
          className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents Instead
        </Button>
      </div>

      {formError && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-400">
            {formError}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Age */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              Age
              <ModelTooltip content={modelExplanations.age} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Your current age in years</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              {...register("age", { required: "Age is required", min: 1, max: 120 })}
              className="text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your age"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
          </CardContent>
        </Card>

        {/* ... keep existing code (all other form fields) */}

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              Sex
              <ModelTooltip content={modelExplanations.sex} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Biological sex</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setValue("sex", value)}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              Chest Pain Type
              <ModelTooltip content={modelExplanations.chestPainType} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Type of chest pain experienced</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setValue("chestPainType", value)}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select chest pain type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="TA">Typical Angina</SelectItem>
                <SelectItem value="ATA">Atypical Angina</SelectItem>
                <SelectItem value="NAP">Non-Anginal Pain</SelectItem>
                <SelectItem value="ASY">Asymptomatic</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              Resting Blood Pressure
              <ModelTooltip content={modelExplanations.restingBP} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Systolic BP in mmHg: {restingBP[0]}</CardDescription>
          </CardHeader>
          <CardContent>
            <Slider
              value={restingBP}
              onValueChange={(value) => {
                setRestingBP(value);
                setValue("restingBP", value[0]);
              }}
              max={200}
              min={80}
              step={1}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              Cholesterol
              <ModelTooltip content={modelExplanations.cholesterol} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Serum cholesterol level in mg/dl</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              {...register("cholesterol", { required: "Cholesterol is required" })}
              placeholder="Enter cholesterol level"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              Fasting Blood Sugar
              <ModelTooltip content={modelExplanations.fastingBS} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Is fasting blood sugar greater than 120 mg/dl?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={(value) => setValue("fastingBS", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="fbs-yes" />
                <Label htmlFor="fbs-yes" className="dark:text-white">Yes (greater than 120 mg/dl)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="fbs-no" />
                <Label htmlFor="fbs-no" className="dark:text-white">No (120 mg/dl or less)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              Resting ECG
              <ModelTooltip content={modelExplanations.restingECG} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Resting electrocardiogram results</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setValue("restingECG", value)}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select ECG result" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="ST">ST-T wave abnormality</SelectItem>
                <SelectItem value="LVH">Left ventricular hypertrophy</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              Maximum Heart Rate
              <ModelTooltip content={modelExplanations.maxHR} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Maximum heart rate achieved: {maxHR[0]} bpm</CardDescription>
          </CardHeader>
          <CardContent>
            <Slider
              value={maxHR}
              onValueChange={(value) => {
                setMaxHR(value);
                setValue("maxHR", value[0]);
              }}
              max={220}
              min={60}
              step={1}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              Exercise Induced Angina
              <ModelTooltip content={modelExplanations.exerciseAngina} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Do you experience chest pain during exercise?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={(value) => setValue("exerciseAngina", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Y" id="angina-yes" />
                <Label htmlFor="angina-yes" className="dark:text-white">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="N" id="angina-no" />
                <Label htmlFor="angina-no" className="dark:text-white">No</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              ST Depression (Oldpeak)
              <ModelTooltip content={modelExplanations.oldpeak} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">ST depression induced by exercise</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="0.1"
              {...register("oldpeak", { required: "Oldpeak value is required" })}
              placeholder="Enter oldpeak value"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center dark:text-white">
              ST Slope
              <ModelTooltip content={modelExplanations.stSlope} />
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Slope of peak exercise ST segment</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setValue("stSlope", value)}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select ST slope" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="Up">Upsloping</SelectItem>
                <SelectItem value="Flat">Flat</SelectItem>
                <SelectItem value="Down">Downsloping</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-6">
        <Button
          type="submit"
          disabled={isFormLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg min-w-[200px] transition-all duration-300"
        >
          {isFormLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 mr-2" />
              Predict Now
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PredictionForm;