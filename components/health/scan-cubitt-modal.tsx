'use client';

import { useState } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { analyzeCubittImage, createManualWeightEntry } from '@/lib/actions/cubitt';

interface ScanCubittModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface CubittData {
  weight_kg: number;
  bmi: number;
  body_fat_percent: number;
  muscle_mass_kg: number;
  visceral_fat_kg: number;
  water_percent: number;
  bone_mass_kg: number;
  basal_metabolism: number;
  protein_percent: number;
  metabolic_age: number;
  skeletal_muscle_percent: number;
  subcutaneous_fat_percent: number;
}

export function ScanCubittModal({ open, onOpenChange, onSuccess }: ScanCubittModalProps) {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'confirm' | 'success' | 'error'>('upload');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [extractedData, setExtractedData] = useState<CubittData | null>(null);
  const [error, setError] = useState<string>('');
  const [manualData, setManualData] = useState({
    weight_kg: '',
    body_fat_percent: '',
    muscle_mass_kg: '',
  });
  const [savingManual, setSavingManual] = useState(false);

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
      // Convertir imagen a base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        // Llamar a la función de análisis
        const result = await analyzeCubittImage(base64Image);
        
        if (result.success && result.data) {
          setExtractedData(result.data);
          setStep('confirm');
        } else {
          setError(result.error || 'Error al analizar la imagen');
          setStep('error');
        }
      };
      reader.readAsDataURL(imageFile);
    } catch (err) {
      setError('Error al procesar la imagen');
      setStep('error');
    }
  };

  const handleConfirm = async () => {
    if (!extractedData) return;

    try {
      // Los datos ya fueron guardados en analyzeCubittImage
      setStep('success');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      setError('Error al guardar los datos');
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('upload');
    setImageFile(null);
    setImagePreview('');
    setExtractedData(null);
    setError('');
    setManualData({ weight_kg: '', body_fat_percent: '', muscle_mass_kg: '' });
    setSavingManual(false);
    onOpenChange(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSavingManual(true);

    try {
      const weight = parseFloat(manualData.weight_kg);
      if (isNaN(weight) || weight < 30 || weight > 300) {
        throw new Error('Peso debe estar entre 30 y 300 kg');
      }

      const result = await createManualWeightEntry({
        weight_kg: weight,
        body_fat_percent: manualData.body_fat_percent ? parseFloat(manualData.body_fat_percent) : undefined,
        muscle_mass_kg: manualData.muscle_mass_kg ? parseFloat(manualData.muscle_mass_kg) : undefined,
      });

      if (result.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      } else {
        setError(result.error || 'Error al guardar');
        setStep('error');
      }
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
      setStep('error');
    } finally {
      setSavingManual(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actualizar Métricas</DialogTitle>
          <DialogDescription>
            Escanea tu reporte de Cubitt o ingresa los datos manualmente
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">
              <Camera className="mr-2 h-4 w-4" />
              Escanear
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Edit className="mr-2 h-4 w-4" />
              Manual
            </TabsTrigger>
          </TabsList>

          {/* TAB: Escanear */}
          <TabsContent value="scan" className="space-y-4">
            {/* STEP 1: Upload */}
            {step === 'upload' && (
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-contain rounded-lg border border-border"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                >
                  Cambiar
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click para subir</span> o arrastra la imagen
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            )}

            {imagePreview && (
              <Button onClick={handleAnalyze} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Analizar Imagen
              </Button>
            )}
          </TabsContent>

          {/* TAB: Manual */}
          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-base">
                  Peso (kg) *
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="70.5"
                  value={manualData.weight_kg}
                  onChange={(e) => setManualData({ ...manualData, weight_kg: e.target.value })}
                  className="h-14 text-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body_fat" className="text-base">
                  % Grasa Corporal (opcional)
                </Label>
                <Input
                  id="body_fat"
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="15.3"
                  value={manualData.body_fat_percent}
                  onChange={(e) => setManualData({ ...manualData, body_fat_percent: e.target.value })}
                  className="h-14 text-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="muscle_mass" className="text-base">
                  Masa Muscular (kg) (opcional)
                </Label>
                <Input
                  id="muscle_mass"
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="55.2"
                  value={manualData.muscle_mass_kg}
                  onChange={(e) => setManualData({ ...manualData, muscle_mass_kg: e.target.value })}
                  className="h-14 text-xl"
                />
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Tu perfil metabólico se recalculará automáticamente con el nuevo peso.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg"
                disabled={savingManual || !manualData.weight_kg}
              >
                {savingManual ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Guardar
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Shared Steps (analyzing, confirm, success, error) */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <p className="font-medium">Analizando imagen...</p>
              <p className="text-sm text-muted-foreground">Extrayendo datos de Cubitt</p>
            </div>
          </div>
        )}

        {/* STEP 3: Confirm */}
        {step === 'confirm' && extractedData && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
              <h4 className="font-semibold mb-3">Datos Extraídos:</h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Peso:</span>
                  <p className="font-mono font-semibold">{extractedData.weight_kg} kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">IMC:</span>
                  <p className="font-mono font-semibold">{extractedData.bmi}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Grasa Corporal:</span>
                  <p className="font-mono font-semibold">{extractedData.body_fat_percent}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Masa Muscular:</span>
                  <p className="font-mono font-semibold">{extractedData.muscle_mass_kg} kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Grasa Visceral:</span>
                  <p className="font-mono font-semibold">{extractedData.visceral_fat_kg} kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Agua Corporal:</span>
                  <p className="font-mono font-semibold">{extractedData.water_percent}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Masa Ósea:</span>
                  <p className="font-mono font-semibold">{extractedData.bone_mass_kg} kg</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Metabolismo Basal:</span>
                  <p className="font-mono font-semibold">{extractedData.basal_metabolism} kcal</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Proteína:</span>
                  <p className="font-mono font-semibold">{extractedData.protein_percent}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Edad Metabólica:</span>
                  <p className="font-mono font-semibold">{extractedData.metabolic_age} años</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Músculo Esquelético:</span>
                  <p className="font-mono font-semibold">{extractedData.skeletal_muscle_percent}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Grasa Subcutánea:</span>
                  <p className="font-mono font-semibold">{extractedData.subcutaneous_fat_percent}%</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('upload')} className="flex-1">
                Reintentar
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirmar
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <p className="font-medium">¡Datos guardados!</p>
              <p className="text-sm text-muted-foreground">Tus métricas han sido actualizadas</p>
            </div>
          </div>
        )}

        {/* STEP 5: Error */}
        {step === 'error' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <div className="text-center">
                <p className="font-medium">Error al analizar</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
            <Button onClick={() => setStep('upload')} className="w-full">
              Intentar de nuevo
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
