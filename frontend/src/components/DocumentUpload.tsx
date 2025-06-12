
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, X, CheckCircle, Loader2 } from "lucide-react";

interface DocumentUploadProps {
  onDocumentAnalysis: (extractedData: any) => void;
  onToggleMode: (useUpload: boolean) => void;
  isUploading: boolean;
}

const documentTypes = [
  { id: 'blood-report', label: 'Blood Report', description: 'Complete blood count, lipid profile, etc.' },
  { id: 'ecg-report', label: 'ECG Report', description: 'Electrocardiogram results' },
  { id: 'tmt-report', label: 'TMT Report', description: 'Treadmill test results' },
  { id: 'prescription', label: 'Prescription', description: 'Doctor\'s prescription with medical history' },
  { id: 'other', label: 'Other Medical Document', description: 'Any other relevant medical document' }
];

const DocumentUpload = ({ onDocumentAnalysis, onToggleMode, isUploading }: DocumentUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processDocuments = async () => {
    if (uploadedFiles.length === 0) return;

    // Simulate ML model processing
    // In real implementation, this would send files to your ML model API
    const mockExtractedData = {
      age: Math.floor(Math.random() * 50) + 30,
      sex: Math.random() > 0.5 ? 'M' : 'F',
      chestPainType: 'ATA',
      restingBP: Math.floor(Math.random() * 40) + 120,
      cholesterol: Math.floor(Math.random() * 100) + 200,
      fastingBS: Math.random() > 0.7 ? '1' : '0',
      restingECG: 'Normal',
      maxHR: Math.floor(Math.random() * 60) + 140,
      exerciseAngina: Math.random() > 0.6 ? 'Y' : 'N',
      oldpeak: (Math.random() * 3).toFixed(1),
      stSlope: 'Up'
    };

    onDocumentAnalysis(mockExtractedData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upload Medical Documents</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Upload your medical reports for automatic data extraction
        </p>
        <Button
          variant="outline"
          onClick={() => onToggleMode(false)}
          className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
        >
          Switch to Manual Entry
        </Button>
      </div>

      {/* Document Types */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Supported Documents</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Upload any of the following medical documents (PDF, JPG, PNG - Max 10MB each)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {documentTypes.map((doc) => (
              <div key={doc.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{doc.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drag and drop files here
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              or click to browse
            </p>
            <Label htmlFor="file-upload">
              <Button variant="outline" className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-700">
                Browse Files
              </Button>
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Uploaded Files ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process Button */}
      {uploadedFiles.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={processDocuments}
            disabled={isUploading}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg min-w-[200px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Documents...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Extract Data from Documents
              </>
            )}
          </Button>
        </div>
      )}

      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-400">
          Our AI will automatically extract relevant medical data from your uploaded documents. 
          Make sure the documents are clear and readable for best results.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DocumentUpload;
