/**
 * TITAN FUEL AI - Sistema avanzado de análisis nutricional
 * Fusiona visión por computadora + contexto del usuario para máxima precisión
 * Soporta: DeepSeek-VL2 (GRATIS/BARATO), Qwen2.5-VL (GRATIS), Gemini 2.0 Flash (GRATIS), OpenAI GPT-4o
 */

export interface FoodItem {
  name: string;
  qty_adjustment_reason?: string;
  calories: number;
  macros: {
    p: number; // proteína
    c: number; // carbos
    f: number; // grasas
  };
}

export interface FoodAnalysisResult {
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
  // Legacy fields para compatibilidad
  portion_size?: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  fiber_g?: number;
  confidence: number; // 0-100
  ingredients?: string[];
  notes?: string;
}

/**
 * PROMPT AVANZADO V2 - Fusión de Visión + Contexto del Usuario
 * Diseñado para máxima precisión combinando análisis visual con input textual
 */
function buildAdvancedPrompt(userContext?: string): string {
  return `ACTÚA COMO: Nutricionista experto certificado y analista de visión multimodal con 15 años de experiencia.

ENTRADAS:
1. IMAGEN: Fotografía de la comida (analiza visualmente)
2. CONTEXTO DEL USUARIO: "${userContext || 'No proporcionado'}"

TAREA PRINCIPAL:
Analiza la imagen para identificar alimentos y estimar volumen, PERO ajusta los cálculos basándote ESTRICTAMENTE en el CONTEXTO DEL USUARIO si existe.

═══════════════════════════════════════════════════════════════
REGLAS DE FUSIÓN (VISUAL + TEXTO) - JERARQUÍA CRÍTICA:
═══════════════════════════════════════════════════════════════

1. 🎯 JERARQUÍA: El texto del usuario SIEMPRE MANDA sobre la visión
   - Si la imagen parece 150g de arroz pero el usuario dice "300g", usa 300g
   - Si la imagen parece pollo frito pero el usuario dice "Air Fryer sin aceite", elimina calorías del aceite
   - Si el usuario especifica cantidades exactas, úsalas sin cuestionar

2. 🍳 GRASAS OCULTAS (CRÍTICO - Aquí está el error más común):
   - Si el usuario menciona "aceite", "mantequilla", "manteca", "frito en aceite":
     → AÑADE automáticamente 1 cucharada (120 kcal / 14g grasa) por porción
   - Si el usuario dice "generoso con el aceite" o "bastante aceite":
     → AÑADE 2 cucharadas (240 kcal / 28g grasa)
   - Si el usuario dice "sin aceite", "al vapor", "hervido", "Air Fryer":
     → USA valores base del alimento crudo/hervido (NO añadas grasa)
   - Si el usuario menciona "queso extra", "con mantequilla", "con crema":
     → AÑADE las calorías correspondientes (queso: +100 kcal/30g, mantequilla: +100 kcal/14g)

3. 🔍 INFERENCIA INTELIGENTE:
   - Si el contexto está vacío, usa estimación visual estándar
   - Asume cocción media (con algo de aceite) si no se especifica
   - Usa referencias visuales: platos (25cm), cubiertos, manos, monedas

4. 📊 PRECISIÓN EN CANTIDADES:
   - Plátano mediano: 120g = 105 kcal, 27g C, 1.3g P, 0.4g F
   - Arroz blanco cocido (100g): 130 kcal, 28g C, 2.7g P, 0.3g F
   - Pollo pechuga (100g): 165 kcal, 31g P, 3.6g F, 0g C
   - Huevo grande (50g): 70 kcal, 6g P, 5g F, 0.6g C
   - Aceite (1 cucharada/14g): 120 kcal, 0g P, 0g C, 14g F
   - Pan blanco (1 rebanada/30g): 80 kcal, 15g C, 2.5g P, 1g F
   - Aguacate (100g): 160 kcal, 2g P, 15g F, 9g C
   - Pasta cocida (100g): 131 kcal, 25g C, 5g P, 1g F

═══════════════════════════════════════════════════════════════
FORMATO DE RESPUESTA (JSON PURO - SIN MARKDOWN):
═══════════════════════════════════════════════════════════════

{
  "food_name": "Nombre final ajustado (ej: 'Pasta con Salsa, Queso Extra y Aceite')",
  "user_context_applied": true/false,
  "items": [
    {
      "name": "Nombre del ingrediente individual",
      "qty_adjustment_reason": "Explicación si cambiaste algo por el texto del usuario (ej: 'Usuario especificó 200g' o 'Agregado aceite de cocción mencionado')",
      "calories": número_entero,
      "macros": {
        "p": número_decimal_proteína,
        "c": número_decimal_carbos,
        "f": número_decimal_grasas
      }
    }
  ],
  "total_nutrition": {
    "calories": número_entero_total,
    "protein_g": número_decimal_total,
    "carbs_g": número_decimal_total,
    "fats_g": número_decimal_total
  },
  "confidence_score": 0.0_a_1.0,
  "summary_msg": "Mensaje corto confirmando los ajustes (ej: 'Entendido, ajustado a 200g y agregado el aceite de oliva mencionado')"
}

═══════════════════════════════════════════════════════════════
EJEMPLOS DE CASOS REALES:
═══════════════════════════════════════════════════════════════

EJEMPLO 1 - Usuario especifica cantidad:
IMAGEN: 2 plátanos
CONTEXTO: "son 3 plátanos medianos"
RESPUESTA:
{
  "food_name": "3 Plátanos Medianos",
  "user_context_applied": true,
  "items": [{
    "name": "Plátanos",
    "qty_adjustment_reason": "Usuario especificó 3 plátanos (visualmente parecían 2)",
    "calories": 315,
    "macros": {"p": 3.9, "c": 81, "f": 1.2}
  }],
  "total_nutrition": {"calories": 315, "protein_g": 3.9, "carbs_g": 81, "fats_g": 1.2},
  "confidence_score": 0.95,
  "summary_msg": "Ajustado a 3 plátanos según tu indicación"
}

EJEMPLO 2 - Usuario menciona aceite (CRÍTICO):
IMAGEN: Pollo a la plancha
CONTEXTO: "pollo con aceite de oliva"
RESPUESTA:
{
  "food_name": "Pollo a la Plancha con Aceite de Oliva",
  "user_context_applied": true,
  "items": [
    {
      "name": "Pechuga de pollo (200g)",
      "calories": 330,
      "macros": {"p": 62, "c": 0, "f": 7.2}
    },
    {
      "name": "Aceite de oliva (1 cucharada)",
      "qty_adjustment_reason": "Agregado por mención de aceite en la cocción",
      "calories": 120,
      "macros": {"p": 0, "c": 0, "f": 14}
    }
  ],
  "total_nutrition": {"calories": 450, "protein_g": 62, "carbs_g": 0, "fats_g": 21.2},
  "confidence_score": 0.90,
  "summary_msg": "Detectado. Agregadas calorías del aceite de oliva mencionado"
}

EJEMPLO 3 - Sin contexto (solo visión):
IMAGEN: Bowl con arroz, pollo y vegetales
CONTEXTO: ""
RESPUESTA:
{
  "food_name": "Bowl de Arroz con Pollo y Vegetales",
  "user_context_applied": false,
  "items": [
    {"name": "Arroz blanco (150g)", "calories": 195, "macros": {"p": 4, "c": 42, "f": 0.5}},
    {"name": "Pechuga de pollo (150g)", "calories": 248, "macros": {"p": 46.5, "c": 0, "f": 5.4}},
    {"name": "Vegetales mixtos (100g)", "calories": 35, "macros": {"p": 2, "c": 7, "f": 0.3}},
    {"name": "Aceite de cocción (estimado)", "calories": 60, "macros": {"p": 0, "c": 0, "f": 7}}
  ],
  "total_nutrition": {"calories": 538, "protein_g": 52.5, "carbs_g": 49, "fats_g": 13.2},
  "confidence_score": 0.75,
  "summary_msg": "Análisis visual. Estimación estándar con cocción media"
}

═══════════════════════════════════════════════════════════════
INSTRUCCIONES FINALES:
═══════════════════════════════════════════════════════════════

1. RESPONDE SOLO CON EL JSON (sin \`\`\`json ni markdown)
2. USA DECIMALES con 1 dígito para macros (ej: 12.5g, no 12.523847g)
3. REDONDEA calorías a enteros
4. SI HAY DUDA, confidence_score < 0.7
5. SIEMPRE incluye summary_msg explicando qué hiciste
6. SI el usuario menciona aceite/mantequilla/frito, NO LO OLVIDES

AHORA ANALIZA LA IMAGEN Y RESPONDE:`;
}

/**
 * Analiza comida con DeepSeek-VL2 (CHINO - MUY PRECISO Y BARATO)
 * Costo: ~$0.14 por millón de tokens (95% más barato que GPT-4)
 * Precisión: Comparable a GPT-4o, excelente en análisis visual detallado
 */
async function analyzeWithDeepSeek(
  base64Image: string,
  userContext?: string
): Promise<FoodAnalysisResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY no configurada. Obtén una en: https://platform.deepseek.com');
  }

  // DeepSeek usa formato OpenAI-compatible
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  const dataUrl = `data:image/jpeg;base64,${base64Data}`;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-vl2',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: buildAdvancedPrompt(userContext) },
            {
              type: 'image_url',
              image_url: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No se pudo extraer JSON de la respuesta de IA');
  }
  
  const result = JSON.parse(jsonMatch[0]);
  return normalizeResult(result);
}

/**
 * Analiza comida con Qwen2.5-VL (ALIBABA - GRATIS/BARATO Y MUY PRECISO)
 * Modelo de Alibaba Cloud, excelente en análisis visual y multimodal
 * Puede usarse gratis en Hugging Face o via Alibaba Cloud API
 */
async function analyzeWithQwen(
  base64Image: string,
  userContext?: string
): Promise<FoodAnalysisResult> {
  const apiKey = process.env.QWEN_API_KEY;
  
  if (!apiKey) {
    throw new Error('QWEN_API_KEY no configurada. Obtén una en: https://dashscope.console.aliyun.com/');
  }

  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-DashScope-Async': 'enable',
    },
    body: JSON.stringify({
      model: 'qwen2.5-vl-72b-instruct',
      input: {
        messages: [
          {
            role: 'user',
            content: [
              { text: buildAdvancedPrompt(userContext) },
              {
                image: `data:image/jpeg;base64,${base64Data}`,
              },
            ],
          },
        ],
      },
      parameters: {
        temperature: 0.1,
        max_tokens: 2000,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Qwen API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.output.choices[0].message.content;
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No se pudo extraer JSON de la respuesta de IA');
  }
  
  const result = JSON.parse(jsonMatch[0]);
  return normalizeResult(result);
}
 * Mejor modelo gratuito disponible con visión multimodal
 */
async function analyzeWithGemini(
  base64Image: string,
  userContext?: string
): Promise<FoodAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no configurada. Obtén una gratis en: https://makersuite.google.com/app/apikey');
  }

  // Remover prefijo data:image si existe
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: buildAdvancedPrompt(userContext) },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1, // Baja temperatura = más preciso y consistente
          maxOutputTokens: 2000,
          topP: 0.8,
          topK: 10,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  
  // Extraer JSON de la respuesta (puede venir con o sin markdown)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No se pudo extraer JSON de la respuesta de IA');
  }
  
  const result = JSON.parse(jsonMatch[0]);
  
  // Normalizar al formato esperado (nuevo + legacy)
  return normalizeResult(result);
}

/**
 * Analiza comida con OpenAI GPT-4o (PAGO - muy preciso)
 */
async function analyzeWithOpenAI(
  base64Image: string,
  userContext?: string
): Promise<FoodAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no configurada');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: buildAdvancedPrompt(userContext) },
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No se pudo extraer JSON de la respuesta de IA');
  }
  
  const result = JSON.parse(jsonMatch[0]);
  return normalizeResult(result);
}

/**
 * Normaliza el resultado de la IA al formato esperado
 * Mantiene compatibilidad con formato legacy
 */
function normalizeResult(result: any): FoodAnalysisResult {
  const total = result.total_nutrition || {};
  
  return {
    // Nuevo formato
    food_name: result.food_name || 'Alimento no identificado',
    user_context_applied: result.user_context_applied || false,
    items: result.items || [],
    total_nutrition: {
      calories: Math.round(total.calories || 0),
      protein_g: Math.round((total.protein_g || 0) * 10) / 10,
      carbs_g: Math.round((total.carbs_g || 0) * 10) / 10,
      fats_g: Math.round((total.fats_g || 0) * 10) / 10,
    },
    confidence_score: result.confidence_score || 0.7,
    summary_msg: result.summary_msg || 'Análisis completado',
    
    // Legacy format (para compatibilidad con componentes existentes)
    portion_size: result.items?.map((i: any) => i.name).join(', ') || 'Porción estándar',
    calories: Math.round(total.calories || 0),
    protein_g: Math.round((total.protein_g || 0) * 10) / 10,
    carbs_g: Math.round((total.carbs_g || 0) * 10) / 10,
    fats_g: Math.round((total.fats_g || 0) * 10) / 10,
    fiber_g: total.fiber_g ? Math.round(total.fiber_g * 10) / 10 : undefined,
    confidence: Math.round((result.confidence_score || 0.7) * 100),
    ingredients: result.items?.map((i: any) => i.name) || [],
    notes: result.summary_msg || '',
  };
}

/**
 * Función principal - Analiza comida con contexto del usuario
 * @param base64Image - Imagen en base64
 * @param userContext - Contexto opcional del usuario (ej: "300g de arroz con aceite")
 */
export async function analyzeFoodImage(
  base64Image: string,
  userContext?: string
): Promise<FoodAnalysisResult> {
  // Prioridad (PRECISIÓN > VELOCIDAD):
  // 1. DeepSeek-VL2 (chino, muy preciso, barato)
  // 2. Qwen2.5-VL (Alibaba, muy preciso, gratis/barato)
  // 3. Gemini 2.0 Flash (Google, gratis, bueno)
  // 4. OpenAI GPT-4o (pago, muy preciso)
  
  const provider = process.env.FOOD_AI_PROVIDER || 'auto';
  
  console.log(`🤖 Analizando comida con proveedor: ${provider.toUpperCase()}...`);
  if (userContext) {
    console.log(`📝 Contexto del usuario: "${userContext}"`);
  }
  
  try {
    // Auto-detect: usa el primero disponible en orden de precisión
    if (provider === 'auto') {
      if (process.env.DEEPSEEK_API_KEY) {
        console.log('✅ Usando DeepSeek-VL2 (máxima precisión)');
        return await analyzeWithDeepSeek(base64Image, userContext);
      } else if (process.env.QWEN_API_KEY) {
        console.log('✅ Usando Qwen2.5-VL (Alibaba, alta precisión)');
        return await analyzeWithQwen(base64Image, userContext);
      } else if (process.env.GEMINI_API_KEY) {
        console.log('✅ Usando Gemini 2.0 Flash (Google, gratis)');
        return await analyzeWithGemini(base64Image, userContext);
      } else if (process.env.OPENAI_API_KEY) {
        console.log('✅ Usando OpenAI GPT-4o (pago)');
        return await analyzeWithOpenAI(base64Image, userContext);
      } else {
        throw new Error('No hay API keys configuradas. Configura al menos una: DEEPSEEK_API_KEY, QWEN_API_KEY, GEMINI_API_KEY, o OPENAI_API_KEY');
      }
    }
    
    // Manual selection
    switch (provider) {
      case 'deepseek':
        return await analyzeWithDeepSeek(base64Image, userContext);
      case 'qwen':
        return await analyzeWithQwen(base64Image, userContext);
      case 'gemini':
        return await analyzeWithGemini(base64Image, userContext);
      case 'openai':
        return await analyzeWithOpenAI(base64Image, userContext);
      default:
        throw new Error(`Proveedor de IA no soportado: ${provider}`);
    }
  } catch (error) {
    console.error('❌ Error en análisis de IA:', error);
    
    // Fallback chain: DeepSeek → Qwen → Gemini → OpenAI
    if (provider !== 'deepseek' && process.env.DEEPSEEK_API_KEY) {
      console.log('⚠️ Intentando fallback a DeepSeek-VL2...');
      try {
        return await analyzeWithDeepSeek(base64Image, userContext);
      } catch (e) {
        console.error('DeepSeek fallback falló:', e);
      }
    }
    
    if (provider !== 'qwen' && process.env.QWEN_API_KEY) {
      console.log('⚠️ Intentando fallback a Qwen2.5-VL...');
      try {
        return await analyzeWithQwen(base64Image, userContext);
      } catch (e) {
        console.error('Qwen fallback falló:', e);
      }
    }
    
    if (provider !== 'gemini' && process.env.GEMINI_API_KEY) {
      console.log('⚠️ Intentando fallback a Gemini...');
      try {
        return await analyzeWithGemini(base64Image, userContext);
      } catch (e) {
        console.error('Gemini fallback falló:', e);
      }
    }
    
    if (provider !== 'openai' && process.env.OPENAI_API_KEY) {
      console.log('⚠️ Intentando fallback a OpenAI...');
      return await analyzeWithOpenAI(base64Image, userContext);
    }
    
    throw error;
  }
}

/**
 * Validar que la imagen sea de comida (opcional)
 */
export function validateFoodImage(result: FoodAnalysisResult): boolean {
  // Si la confianza es muy baja, probablemente no es comida
  if (result.confidence < 30) {
    return false;
  }
  
  // Si no tiene calorías, probablemente no es comida
  if (result.calories === 0) {
    return false;
  }
  
  return true;
}
