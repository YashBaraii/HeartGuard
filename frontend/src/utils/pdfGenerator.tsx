
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const generatePDF = async (prediction: any, formData: any): Promise<void> => {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text('Heart Disease Prediction Report', 20, 30)
  
  // Add date
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45)
  
  // Add prediction result
  doc.setFontSize(16)
  doc.setTextColor(prediction.risk === 'high' ? 200 : 50, prediction.risk === 'high' ? 50 : 150, 50)
  doc.text(`Risk Level: ${prediction.risk.toUpperCase()}`, 20, 65)
  
  doc.setFontSize(12)
  doc.setTextColor(40, 40, 40)
  doc.text(`Probability: ${prediction.probability.toFixed(1)}%`, 20, 80)
  
  // Add input parameters
  doc.setFontSize(14)
  doc.text('Input Parameters:', 20, 100)
  
  const parameters = [
    `Age: ${formData.age} years`,
    `Sex: ${formData.sex === 'M' ? 'Male' : 'Female'}`,
    `Chest Pain Type: ${formData.chestPainType}`,
    `Resting BP: ${formData.restingBP} mmHg`,
    `Cholesterol: ${formData.cholesterol} mg/dl`,
    `Fasting Blood Sugar: ${formData.fastingBS === '1' ? 'Yes' : 'No'}`,
    `Resting ECG: ${formData.restingECG}`,
    `Max Heart Rate: ${formData.maxHR} bpm`,
    `Exercise Angina: ${formData.exerciseAngina === 'Y' ? 'Yes' : 'No'}`,
    `ST Depression: ${formData.oldpeak}`,
    `ST Slope: ${formData.stSlope}`
  ]
  
  doc.setFontSize(10)
  parameters.forEach((param, index) => {
    doc.text(param, 20, 115 + (index * 10))
  })
  
  // Add disclaimer
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text('This prediction is for educational purposes only. Consult healthcare professionals for medical advice.', 20, 250)
  
  // Save the PDF
  doc.save('heart-disease-prediction.pdf')
}
