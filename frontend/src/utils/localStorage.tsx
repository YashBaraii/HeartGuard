
export interface SavedResult {
  id: string
  timestamp: string
  prediction: {
    risk: 'low' | 'high'
    probability: number
  }
  formData: any
}

export const saveResult = (prediction: any, formData: any): void => {
  const savedResults = getSavedResults()
  const newResult: SavedResult = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    prediction,
    formData
  }
  
  const updatedResults = [newResult, ...savedResults.slice(0, 9)] // Keep only last 10 results
  localStorage.setItem('heartDiseaseResults', JSON.stringify(updatedResults))
}

export const getSavedResults = (): SavedResult[] => {
  try {
    const results = localStorage.getItem('heartDiseaseResults')
    return results ? JSON.parse(results) : []
  } catch {
    return []
  }
}

export const clearSavedResults = (): void => {
  localStorage.removeItem('heartDiseaseResults')
}
