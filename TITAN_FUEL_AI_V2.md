# 🤖 TITAN FUEL AI V2 - Sistema Avanzado de Análisis Nutricional

## 🎯 Características Principales

### 1. **Fusión Visión + Contexto del Usuario**
El sistema combina análisis visual de la imagen con contexto textual proporcionado por el usuario para máxima precisión.

**Jerarquía de Información:**
- ✅ **Texto del usuario SIEMPRE manda** sobre la visión
- ✅ Si el usuario dice "300g", se usa 300g (aunque la imagen parezca 150g)
- ✅ Si el usuario menciona "sin aceite", se eliminan calorías de grasa
- ✅ Si el usuario menciona "con aceite", se añaden automáticamente ~120 kcal

### 2. **Detección Inteligente de Grasas Ocultas**
El sistema detecta automáticamente menciones de:
- "aceite", "mantequilla", "manteca", "frito" → +120 kcal / +14g grasa
- "generoso con el aceite" → +240 kcal / +28g grasa
- "sin aceite", "al vapor", "hervido", "Air Fryer" → valores base

### 3. **APIs Soportadas**

#### 🆓 **Gemini 2.0 Flash (RECOMENDADO - GRATIS)**
- **Modelo:** `gemini-2.0-flash-exp`
- **Límite:** 15 requests/min (gratis)
- **Precisión:** Excelente (comparable a GPT-4o)
- **Obtener API Key:** AIzaSyDzcHjzroV9oyB6gJ65uOlPWTulhTYItcU

#### 💰 **OpenAI GPT-4o (PAGO - Fallback)**
- **Modelo:** `gpt-4o`
- **Costo:** ~$0.01 por análisis
- **Precisión:** Muy alta
- **Uso:** Fallback automático si Gemini falla

## 📋 Configuración

### 1. Variables de Entorno

Añade a tu `.env.local`:

```bash
# Gemini (GRATIS - Recomendado)
GEMINI_API_KEY=AIzaSyDzcHjzroV9oyB6gJ65uOlPWTulhTYItcU

# OpenAI (OPCIONAL - Solo como fallback)
OPENAI_API_KEY=tu_api_key_de_openai

# Proveedor preferido (por defecto: gemini)
FOOD_AI_PROVIDER=gemini
```

### 2. Obtener API Key de Gemini (GRATIS)

1. Ve a: https://makersuite.google.com/app/apikey
2. Inicia sesión con tu cuenta de Google
3. Click en "Create API Key"
4. Copia la key y pégala en `.env.local`

### 3. Desplegar en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade `GEMINI_API_KEY` con tu key
4. Redeploy

## 🎨 Uso en la Aplicación

### Interfaz de Usuario

1. **Subir Imagen:** Toma foto o sube desde galería
2. **Contexto Adicional (NUEVO):** Campo de texto para especificar:
   - Cantidades exactas: "300g de arroz"
   - Método de cocción: "frito con aceite", "al vapor"
   - Ingredientes extras: "con mantequilla", "queso extra"
3. **Analizar:** La IA procesa imagen + contexto
4. **Confirmar:** Revisa y guarda

### Ejemplos de Contexto

#### ✅ Buenos Ejemplos:
- "2 plátanos grandes"
- "300g de arroz con 1 cucharada de aceite"
- "pollo a la plancha sin aceite"
- "frito en aceite de oliva"
- "200g de pasta con salsa y queso extra"

#### ❌ No Necesario:
- "" (vacío) → La IA hará estimación visual estándar
- "comida" → Demasiado genérico

## 🔬 Arquitectura Técnica

### Flujo de Análisis

```
1. Usuario sube imagen + contexto opcional
2. Sistema construye prompt avanzado con:
   - Instrucciones de nutricionista experto
   - Reglas de fusión visión + texto
   - Tabla de valores nutricionales de referencia
   - Ejemplos de casos reales
3. Envía a Gemini 2.0 Flash (o GPT-4o)
4. IA responde con JSON estructurado:
   {
     "food_name": "...",
     "user_context_applied": true/false,
     "items": [...],
     "total_nutrition": {...},
     "confidence_score": 0.0-1.0,
     "summary_msg": "..."
   }
5. Sistema normaliza y valida resultado
6. Muestra al usuario para confirmación
```

### Formato de Respuesta

```typescript
interface FoodAnalysisResult {
  food_name: string;
  user_context_applied: boolean;
  items: FoodItem[];
  total_nutrition: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fats_g: number;
  };
  confidence_score: number; // 0.0 - 1.0
  summary_msg: string;
}

interface FoodItem {
  name: string;
  qty_adjustment_reason?: string;
  calories: number;
  macros: {
    p: number; // proteína
    c: number; // carbos
    f: number; // grasas
  };
}
```

## 📊 Precisión y Validación

### Factores que Afectan la Precisión

✅ **Aumentan Precisión:**
- Foto desde arriba (vista cenital)
- Buena iluminación
- Todo el plato visible
- Contexto del usuario con cantidades exactas
- Mención de método de cocción

❌ **Reducen Precisión:**
- Foto borrosa o mal iluminada
- Ángulo lateral (no se ve todo)
- Alimentos mezclados difíciles de separar
- Sin contexto en platos complejos

### Confidence Score

- **0.9 - 1.0:** Muy alta confianza (contexto claro + imagen buena)
- **0.7 - 0.9:** Alta confianza (estimación visual sólida)
- **0.5 - 0.7:** Confianza media (imagen ambigua)
- **< 0.5:** Baja confianza (requiere más información)

## 🚀 Mejoras Futuras

### Fase 1 (Actual) ✅
- [x] Fusión visión + contexto
- [x] Detección de grasas ocultas
- [x] Gemini 2.0 Flash gratis
- [x] Desglose por ingredientes

### Fase 2 (Próxima)
- [ ] Historial de comidas frecuentes
- [ ] Sugerencias automáticas de contexto
- [ ] Escaneo de códigos de barras
- [ ] Base de datos local de alimentos

### Fase 3 (Futuro)
- [ ] Reconocimiento de marcas
- [ ] Integración con MyFitnessPal
- [ ] Análisis de menús de restaurantes
- [ ] Recomendaciones personalizadas

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY no configurada"
**Solución:** Añade la key a `.env.local` y reinicia el servidor

### Error: "Gemini API error: 429"
**Solución:** Límite de requests excedido (15/min). Espera 1 minuto o usa OpenAI como fallback

### Error: "No se pudo extraer JSON"
**Solución:** La IA respondió en formato incorrecto. Reintenta o reporta el caso

### Resultado incorrecto (ej: "2 plátanos" → "Bowl de quinoa")
**Solución:** 
1. Usa el campo de contexto: "2 plátanos medianos"
2. Asegúrate de que la foto sea clara
3. Si persiste, reporta para mejorar el prompt

## 📝 Notas Técnicas

### Temperatura de IA
- **0.1** (muy baja) → Respuestas consistentes y precisas
- Evita creatividad innecesaria en análisis nutricional

### Tokens
- Prompt: ~1500 tokens
- Respuesta: ~500 tokens
- Total: ~2000 tokens por análisis

### Costo (si usas OpenAI)
- GPT-4o: ~$0.01 por análisis
- Gemini: GRATIS (15 requests/min)

## 🎓 Referencias

- [Gemini API Docs](https://ai.google.dev/docs)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [USDA Food Database](https://fdc.nal.usda.gov/)
- [Mifflin-St Jeor Formula](https://en.wikipedia.org/wiki/Basal_metabolic_rate)

---

**Última actualización:** Febrero 2026
**Versión:** 2.0
**Autor:** Titan OS Team
