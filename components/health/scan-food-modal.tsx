'use client';

import { useState, useRef } from 'react';
import { X, Camera, Upload, Sparkles, Loader2 } from 'lucide-react';
import { createNutritionLog } from '@/lib/actions/nutrition';

interface ScanFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock AI Analysis (preparado para integración real)
async function mockAnalyzeFood(imageFile: File): Promise<{
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
}> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response (en producción, aquí iría la llamada a OpenAI Vision/Gemini)
  const mockFoods = [
    { food_name: 'Pollo con Arroz y Vegetales', calories: 520, protein_g: 45, carbs_g: 55, fats_g: 12 },
    { food_name: 'Ensalada César con Pollo', calories: 380, protein_g: 32, carbs_g: 18, fats_g: 22 },
    { food_name: 'Pasta Carbonara', calories: 680, protein_g: 28, carbs_g: 75, fats_g: 28 },
    { food_name: 'Sándwich de Atún', calories: 420, protein_g: 35, carbs_g: 42, fats_g: 14 },
    { food_name: 'Bowl de Quinoa y Vegetales', calories: 450, protein_g: 18, carbs_g: 62, fats_g: 15 },
  ];
  
  return mockFoods[Math.floor(Math.random() * mockFoods.length)];
}

export function ScanFoodModal({ isOpen, onClose }: ScanFoodModalProps) {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'confirm'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<any>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    
    setStep('analyzing');
    setError('');
    
    try {
      // Aquí iría la llamada real a OpenAI Vision/Gemini
      // const result = await analyzeFood(imageFile);
      const result = await mockAnalyzeFood(imageFile);
      
      setAiResult(result);
      setStep('confirm');
    } catch (err: any) {
      setError('Error al analizar la imagen');
      setStep('upload');
    }
  };

  const handleConfirm = async () => {
    if (!aiResult) return;
    
    setLoading(true);
    setError('');
    
    try {
      await createNutritionLog({
        meal_type: mealType,
        food_name: aiResult.food_name,
        calories: aiResult.calories,
        protein_g: aiResult.protein_g,
        carbs_g: aiResult.carbs_g,
        fats_g: aiResult.fats_g,
        ai_provider: 'mock',
        ai_analysis_json: aiResult,
        image_url: imagePreview || undefined,
      });
      
      // Reset
      setStep('upload');
      setImageFile(null);
      setImagePreview(null);
      setAiResult(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el registro');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setImageFile(null);
    setImagePreview(null);
    setAiResult(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={20} />
            <h2 className="text-xl font-semibold">Titan Fuel AI</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Comida</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="w-full px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="breakfast">Desayuno</option>
                  <option value="lunch">Almuerzo</option>
                  <option value="dinner">Cena</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-border"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload size={18} />
                      Cambiar Foto
                    </button>
                    <button
                      onClick={handleAnalyze}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles size={18} />
                      Analizar con IA
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-64 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-4 bg-background/50"
                >
                  <Camera size={48} className="text-muted-foreground" />
                  <div className="text-center">
                    <p className="font-medium">Tomar o Subir Foto</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      La IA analizará tu comida automáticamente
                    </p>
                  </div>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Step 2: Analyzing */}
          {step === 'analyzing' && (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <Loader2 size={48} className="text-primary animate-spin" />
              <div className="text-center">
                <p className="font-medium">Analizando con IA...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Identificando alimentos y calculando macros
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 'confirm' && aiResult && (
            <div className="space-y-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Food"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
              )}

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-primary" size={18} />
                  <p className="font-medium text-primary">Análisis de IA</p>
                </div>
                <p className="text-lg font-semibold mb-3">{aiResult.food_name}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Calorías</p>
                    <p className="text-xl font-bold">{aiResult.calories}</p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Proteína</p>
                    <p className="text-xl font-bold">{aiResult.protein_g}g</p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Carbohidratos</p>
                    <p className="text-xl font-bold">{aiResult.carbs_g}g</p>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Grasas</p>
                    <p className="text-xl font-bold">{aiResult.fats_g}g</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Los valores son estimaciones. Puedes editarlos después de guardar.
              </p>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('upload')}
                  className="flex-1 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
