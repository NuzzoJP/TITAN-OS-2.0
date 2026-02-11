'use client';

import { useState, useRef } from 'react';
import { X, Upload, Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createNutritionLog } from '@/lib/actions/nutrition';
import { analyzeFoodImage, validateFoodImage } from '@/lib/ai/food-analyzer';
import type { FoodAnalysisResult } from '@/lib/ai/food-analyzer';

interface ScanFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScanFoodModal({ isOpen, onClose }: ScanFoodModalProps) {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'confirm'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userContext, setUserContext] = useState('');
  const [aiResult, setAiResult] = useState<FoodAnalysisResult | null>(null);
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
    if (!imageFile || !imagePreview) return;
    
    setStep('analyzing');
    setError('');
    
    try {
      // Analizar con IA (Gemini 2.0 Flash o OpenAI GPT-4o)
      const result = await analyzeFoodImage(imagePreview, userContext || undefined);
      
      // Validar que sea comida
      if (!validateFoodImage(result)) {
        throw new Error('La imagen no parece contener comida. Por favor intenta con otra foto.');
      }
      
      setAiResult(result);
      setStep('confirm');
    } catch (err: any) {
      console.error('Error analyzing food:', err);
      setError(err.message || 'Error al analizar la imagen. Verifica que GEMINI_API_KEY esté configurada.');
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
        ai_provider: process.env.FOOD_AI_PROVIDER || 'gemini',
        ai_analysis_json: aiResult,
        image_url: imagePreview || undefined,
        notes: `${aiResult.portion_size}${aiResult.notes ? ` - ${aiResult.notes}` : ''}`,
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
    setUserContext('');
    setAiResult(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={24} />
            <h2 className="text-xl font-bold">Escanear Comida con IA</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* STEP 1: Upload */}
          {step === 'upload' && (
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-contain rounded-lg border border-border bg-muted"
                  />
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-background/90 hover:bg-background rounded-lg border border-border"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/20">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click para subir</span> o arrastra la imagen
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 10MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                  />
                </label>
              )}

              {/* Meal Type Selector */}
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Comida</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'breakfast', label: '🌅 Desayuno' },
                    { value: 'lunch', label: '🍽️ Almuerzo' },
                    { value: 'dinner', label: '🌙 Cena' },
                    { value: 'snack', label: '🥤 Snack' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setMealType(type.value as any)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        mealType === type.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:border-primary/50'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Context Input - NUEVO */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contexto Adicional (Opcional)
                  <span className="text-xs text-muted-foreground ml-2">
                    Ej: "300g de arroz con aceite", "2 plátanos grandes", "pollo sin piel"
                  </span>
                </label>
                <textarea
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  placeholder="Describe cantidades, método de cocción, ingredientes extras..."
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  💡 Esto ayuda a la IA a ser más precisa. Menciona si usaste aceite, mantequilla, o cantidades exactas.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              {imagePreview && (
                <button
                  onClick={handleAnalyze}
                  className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20 font-semibold"
                >
                  <Sparkles size={20} />
                  Analizar con IA
                </button>
              )}

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">💡 Tips para máxima precisión:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Toma la foto desde arriba (vista cenital)</li>
                  <li>• Asegúrate de que haya buena iluminación</li>
                  <li>• Incluye todo el plato en la foto</li>
                  <li>• <strong>IMPORTANTE:</strong> Menciona si usaste aceite, mantequilla o método de cocción</li>
                  <li>• Si conoces las cantidades exactas, escríbelas en el contexto</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2: Analyzing */}
          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium text-lg">Analizando imagen...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  La IA está identificando los alimentos y calculando valores nutricionales
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm */}
          {step === 'confirm' && aiResult && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{aiResult.food_name}</h3>
                    <p className="text-sm text-muted-foreground">{aiResult.portion_size}</p>
                    {aiResult.user_context_applied && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium">
                        <CheckCircle2 size={12} />
                        Contexto aplicado
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full">
                    <CheckCircle2 size={16} className="text-primary" />
                    <span className="text-sm font-semibold">{aiResult.confidence}% confianza</span>
                  </div>
                </div>

                {/* Summary Message */}
                {aiResult.summary_msg && (
                  <div className="mb-4 p-3 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm">{aiResult.summary_msg}</p>
                  </div>
                )}

                {/* Macros */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{aiResult.calories}</p>
                    <p className="text-xs text-muted-foreground mt-1">Calorías</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">{aiResult.protein_g}g</p>
                    <p className="text-xs text-muted-foreground mt-1">Proteína</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-500">{aiResult.carbs_g}g</p>
                    <p className="text-xs text-muted-foreground mt-1">Carbos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-500">{aiResult.fats_g}g</p>
                    <p className="text-xs text-muted-foreground mt-1">Grasas</p>
                  </div>
                </div>
              </div>

              {/* Items Breakdown - NUEVO */}
              {aiResult.items && aiResult.items.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-3">Desglose de ingredientes:</p>
                  <div className="space-y-2">
                    {aiResult.items.map((item, i) => (
                      <div key={i} className="flex items-start justify-between p-3 bg-background rounded-lg border border-border">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          {item.qty_adjustment_reason && (
                            <p className="text-xs text-muted-foreground mt-1">
                              📝 {item.qty_adjustment_reason}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-xs">
                          <p className="font-bold">{item.calories} cal</p>
                          <p className="text-muted-foreground">
                            P:{item.macros.p}g C:{item.macros.c}g F:{item.macros.f}g
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients (legacy) */}
              {aiResult.ingredients && aiResult.ingredients.length > 0 && !aiResult.items?.length && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-2">Ingredientes detectados:</p>
                  <div className="flex flex-wrap gap-2">
                    {aiResult.ingredients.map((ingredient, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-background border border-border rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {aiResult.notes && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">{aiResult.notes}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('upload')}
                  className="flex-1 h-14 bg-muted hover:bg-muted/80 rounded-lg transition-colors font-semibold"
                  disabled={loading}
                >
                  Reintentar
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 h-14 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Confirmar y Guardar
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
