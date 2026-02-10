# 🥗 Titan Fuel AI - Documentación Completa

## ✨ Visión General

Titan Fuel AI es el sistema de nutrición inteligente de Titan OS que combina:
- **Visión Artificial** para análisis automático de comidas
- **Lógica Metabólica Dinámica** que se adapta a tu peso actual
- **Tracking de Macros** en tiempo real

## 🎯 Características Implementadas

### 1. Food Lens (Escaneo con IA)

**Flujo Completo:**
1. Usuario toma foto de su plato
2. Selecciona tipo de comida (desayuno/almuerzo/cena/snack)
3. IA analiza la imagen (actualmente mock, preparado para integración real)
4. Sistema muestra análisis con macros estimados
5. Usuario confirma y guarda

**Preparado para Integración Real:**
```typescript
// En scan-food-modal.tsx
async function mockAnalyzeFood(imageFile: File) {
  // TODO: Reemplazar con llamada real a OpenAI Vision/Gemini
  // const response = await fetch('/api/analyze-food', {
  //   method: 'POST',
  //   body: formData
  // });
  
  // Mock response por ahora
  return {
    food_name: 'Pollo con Arroz',
    calories: 520,
    protein_g: 45,
    carbs_g: 55,
    fats_g: 12
  };
}
```

### 2. Lógica Metabólica Dinámica

**Sistema Automático:**
- Cada vez que registras un nuevo peso, el sistema recalcula automáticamente:
  - BMR (Basal Metabolic Rate)
  - TDEE (Total Daily Energy Expenditure)
  - Targets de calorías y macros

**Fórmulas Implementadas:**

#### BMR (Mifflin-St Jeor)
```sql
-- Hombres
BMR = (10 × peso_kg) + (6.25 × altura_cm) - (5 × edad) + 5

-- Mujeres
BMR = (10 × peso_kg) + (6.25 × altura_cm) - (5 × edad) - 161
```

#### TDEE (según nivel de actividad)
```sql
Sedentario:    BMR × 1.2
Ligero:        BMR × 1.375
Moderado:      BMR × 1.55
Activo:        BMR × 1.725
Muy Activo:    BMR × 1.9
```

#### Targets de Macros
```sql
-- Ajuste de calorías según objetivo
Cut (déficit):      TDEE × 0.85 (-15%)
Maintain:           TDEE × 1.00
Bulk (superávit):   TDEE × 1.10 (+10%)

-- Distribución de macros
Proteína:     2g por kg de peso corporal
Grasas:       25% de calorías totales
Carbohidratos: El resto de calorías
```

### 3. Base de Datos Expandida

**Nuevas Tablas:**

```sql
-- Estadísticas corporales (Cubitt Integration)
health_stats:
  - weight_kg
  - body_fat_percent
  - muscle_mass_kg
  - visceral_fat_level
  - water_percent
  - bone_mass_kg
  - metabolic_age
  - photo_urls (progreso visual)

-- Perfil metabólico (auto-calculado)
health_metabolic_profile:
  - age, height_cm, gender
  - activity_level, goal
  - current_weight_kg
  - bmr, tdee
  - daily_calorie_target
  - daily_protein/carbs/fats_target_g

-- Logs de nutrición (AI-powered)
health_nutrition_logs:
  - meal_type
  - image_url
  - ai_provider, ai_analysis_json
  - food_name
  - calories, protein_g, carbs_g, fats_g
```

**Triggers Automáticos:**

```sql
-- Trigger principal: Actualiza perfil al registrar peso
CREATE TRIGGER health_stats_update_metabolic
  AFTER INSERT ON health_stats
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_metabolic_profile();

-- Recalcula automáticamente:
1. BMR con nuevo peso
2. TDEE con nivel de actividad
3. Targets de macros según objetivo
```

## 🎨 Interfaz de Usuario

### Dashboard de Nutrición

**Secciones:**

1. **Header con Botón AI**
   - Botón "Escanear Comida" con gradiente y efecto glow
   - Icono Sparkles para indicar IA

2. **Progreso Diario**
   - Calorías consumidas vs target
   - Proteína consumida vs target
   - Barras de progreso visuales
   - Porcentajes en tiempo real

3. **Desglose de Macros**
   - Proteína (verde)
   - Carbohidratos (azul)
   - Grasas (amarillo)
   - Comparación con targets

4. **Info Metabólica**
   - Peso actual
   - TDEE calculado
   - Objetivo (cut/maintain/bulk)

5. **Comidas del Día**
   - Lista de comidas registradas
   - Icono ✨ para comidas analizadas por IA
   - Macros por comida
   - Hora de registro

### Modal de Escaneo

**3 Pasos:**

1. **Upload**
   - Selector de tipo de comida
   - Botón para tomar/subir foto
   - Preview de imagen

2. **Analyzing**
   - Spinner animado
   - Mensaje "Analizando con IA..."
   - Simula delay de API

3. **Confirm**
   - Imagen de la comida
   - Banner con análisis de IA
   - Grid de macros (calorías, proteína, carbos, grasas)
   - Botones volver/confirmar

## 🔧 Integración con IA Real

### Preparación para OpenAI Vision

```typescript
// Crear archivo: app/api/analyze-food/route.ts
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get('image') as File;
  
  // Convertir a base64
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString('base64');
  
  // Llamar a OpenAI Vision
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analiza esta imagen de comida y devuelve un JSON con: food_name, calories, protein_g, carbs_g, fats_g. Estima las porciones basándote en platos estándar."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64}`
            }
          }
        ]
      }
    ],
    max_tokens: 300
  });
  
  const result = JSON.parse(response.choices[0].message.content);
  return Response.json(result);
}
```

### Preparación para Google Gemini

```typescript
// Alternativa con Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get('image') as File;
  
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
  const result = await model.generateContent([
    "Analiza esta comida y devuelve JSON con: food_name, calories, protein_g, carbs_g, fats_g",
    {
      inlineData: {
        data: await image.arrayBuffer(),
        mimeType: image.type
      }
    }
  ]);
  
  return Response.json(JSON.parse(result.response.text()));
}
```

## 📊 Flujo de Datos

### Registro de Peso → Actualización Metabólica

```
1. Usuario registra peso: 75kg
   ↓
2. Trigger detecta INSERT en health_stats
   ↓
3. Obtiene perfil metabólico (edad: 25, altura: 175cm, género: male)
   ↓
4. Calcula BMR: (10×75) + (6.25×175) - (5×25) + 5 = 1,718 cal
   ↓
5. Calcula TDEE: 1,718 × 1.55 (moderado) = 2,663 cal
   ↓
6. Calcula targets según objetivo (maintain):
   - Calorías: 2,663
   - Proteína: 75kg × 2 = 150g
   - Grasas: (2,663 × 0.25) / 9 = 74g
   - Carbos: (2,663 - 600 - 666) / 4 = 349g
   ↓
7. Actualiza health_metabolic_profile automáticamente
   ↓
8. UI muestra nuevos targets en tiempo real
```

### Escaneo de Comida → Registro

```
1. Usuario toma foto de pollo con arroz
   ↓
2. Imagen se sube (preparado para Storage)
   ↓
3. IA analiza: "Pollo con Arroz y Vegetales"
   - 520 cal, 45g proteína, 55g carbos, 12g grasas
   ↓
4. Usuario confirma
   ↓
5. Se guarda en health_nutrition_logs con:
   - image_url
   - ai_provider: 'openai'
   - ai_analysis_json: {...}
   - macros individuales
   ↓
6. Dashboard actualiza progreso diario automáticamente
```

## 🎯 Casos de Uso

### Caso 1: Usuario en Déficit (Cut)

```
Perfil:
- Peso: 80kg
- Objetivo: Cut (-15%)
- TDEE: 2,500 cal
- Target: 2,125 cal

Día típico:
- Desayuno: 450 cal (21%)
- Almuerzo: 700 cal (33%)
- Cena: 650 cal (31%)
- Snacks: 325 cal (15%)
Total: 2,125 cal ✅

Dashboard muestra:
- Barra de calorías: 100% (verde)
- Proteína: 160g / 160g ✅
- "Objetivo cumplido"
```

### Caso 2: Usuario en Superávit (Bulk)

```
Perfil:
- Peso: 70kg
- Objetivo: Bulk (+10%)
- TDEE: 2,400 cal
- Target: 2,640 cal

Día típico:
- 4-5 comidas
- Enfoque en proteína: 140g+
- Carbos altos para energía

Dashboard muestra:
- Progreso hacia superávit
- Recomendaciones de comidas adicionales
```

### Caso 3: Integración con Cubitt (Futuro)

```
Balanza Cubitt envía datos automáticamente:
- Peso: 75.3kg
- Grasa corporal: 15.2%
- Masa muscular: 61.8kg
- Agua: 58.5%

Sistema actualiza:
1. Perfil metabólico
2. Targets de macros
3. Gráficas de progreso
4. Recomendaciones personalizadas
```

## 🔜 Roadmap de Mejoras

### Fase 1: IA Real (Próximo)
- [ ] Integrar OpenAI Vision API
- [ ] Configurar Supabase Storage para imágenes
- [ ] Implementar fallback a Gemini
- [ ] Mejorar prompts de IA

### Fase 2: Cubitt Integration
- [ ] API webhook para recibir datos de balanza
- [ ] Sincronización automática de peso
- [ ] Gráficas de composición corporal
- [ ] Alertas de cambios significativos

### Fase 3: Features Avanzados
- [ ] Recomendaciones de comidas basadas en targets
- [ ] Análisis de tendencias nutricionales
- [ ] Exportar reportes semanales
- [ ] Integración con Apple Health/Google Fit

### Fase 4: Social & Gamification
- [ ] Compartir comidas con amigos
- [ ] Challenges nutricionales
- [ ] Badges por consistencia
- [ ] Leaderboards

## 🐛 Troubleshooting

### "No hay perfil metabólico"
**Solución**: Crear perfil inicial en Supabase:
```sql
INSERT INTO health_metabolic_profile 
(age, height_cm, gender, activity_level, goal)
VALUES (25, 175, 'male', 'moderate', 'maintain');
```

### IA no analiza correctamente
**Solución**: 
1. Verificar que la imagen sea clara
2. Asegurarse de que el plato sea visible
3. Probar con diferentes ángulos
4. Ajustar prompts de IA

### Targets no se actualizan
**Solución**:
1. Verificar que el trigger esté activo
2. Registrar nuevo peso manualmente
3. Revisar logs de Supabase

---

**Estado**: ✅ Titan Fuel AI Implementado

**Listo para**: Integración con OpenAI Vision/Gemini

**Siguiente**: Configurar API keys y activar IA real
