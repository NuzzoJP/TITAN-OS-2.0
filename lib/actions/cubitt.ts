'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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

/**
 * Analiza una imagen de Cubitt usando Vision AI (OpenAI GPT-4 Vision o Gemini)
 * Extrae TODOS los datos automáticamente
 */
export async function analyzeCubittImage(base64Image: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    // Determinar qué proveedor de IA usar
    const aiProvider = process.env.CUBITT_AI_PROVIDER || 'openai'; // 'openai' o 'gemini'
    
    let extractedData: CubittData;

    if (aiProvider === 'openai') {
      extractedData = await analyzeWithOpenAI(base64Image);
    } else if (aiProvider === 'gemini') {
      extractedData = await analyzeWithGemini(base64Image);
    } else {
      // Fallback: Mock data para desarrollo
      extractedData = await mockAnalyzeCubitt(base64Image);
    }

    // Guardar en la base de datos
    const { error: insertError } = await supabase
      .from('health_stats')
      .insert({
        user_id: user.id,
        measured_at: new Date().toISOString(),
        source: 'cubitt_api',
        weight_kg: extractedData.weight_kg,
        bmi: extractedData.bmi,
        body_fat_percent: extractedData.body_fat_percent,
        muscle_mass_kg: extractedData.muscle_mass_kg,
        visceral_fat_kg: extractedData.visceral_fat_kg,
        water_percent: extractedData.water_percent,
        bone_mass_kg: extractedData.bone_mass_kg,
        basal_metabolism: extractedData.basal_metabolism,
        protein_percent: extractedData.protein_percent,
        metabolic_age: extractedData.metabolic_age,
        skeletal_muscle_percent: extractedData.skeletal_muscle_percent,
        subcutaneous_fat_percent: extractedData.subcutaneous_fat_percent,
      });

    if (insertError) {
      console.error('Error inserting Cubitt data:', insertError);
      return { success: false, error: 'Error al guardar los datos' };
    }

    revalidatePath('/dashboard/health');
    return { success: true, data: extractedData };
  } catch (error) {
    console.error('Error analyzing Cubitt image:', error);
    return { success: false, error: 'Error al analizar la imagen' };
  }
}

/**
 * Analiza imagen con OpenAI GPT-4 Vision
 */
async function analyzeWithOpenAI(base64Image: string): Promise<CubittData> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no configurada');
  }

  const prompt = `Analiza esta imagen de un reporte de Cubitt Health (báscula inteligente).
Extrae TODOS los valores numéricos y devuelve un JSON con esta estructura EXACTA:

{
  "weight_kg": número (peso en kg),
  "bmi": número (IMC),
  "body_fat_percent": número (% grasa corporal),
  "muscle_mass_kg": número (masa muscular en kg),
  "visceral_fat_kg": número (grasa visceral en kg),
  "water_percent": número (% agua corporal),
  "bone_mass_kg": número (masa ósea en kg),
  "basal_metabolism": número (metabolismo basal en kcal),
  "protein_percent": número (% proteína),
  "metabolic_age": número (edad metabólica en años),
  "skeletal_muscle_percent": número (% músculo esquelético),
  "subcutaneous_fat_percent": número (% grasa subcutánea)
}

IMPORTANTE:
- Devuelve SOLO el JSON, sin texto adicional
- Todos los valores deben ser números (no strings)
- Si un valor no está visible, usa 0
- Los porcentajes deben ser números decimales (ej: 8.7, no "8.7%")`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o', // o 'gpt-4-vision-preview'
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.1, // Baja temperatura para respuestas más precisas
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Parsear JSON de la respuesta
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No se pudo extraer JSON de la respuesta');
  }
  
  return JSON.parse(jsonMatch[0]);
}

/**
 * Analiza imagen con Google Gemini Vision
 */
async function analyzeWithGemini(base64Image: string): Promise<CubittData> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no configurada');
  }

  // Remover el prefijo data:image/...;base64, si existe
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

  const prompt = `Analiza esta imagen de un reporte de Cubitt Health (báscula inteligente).
Extrae TODOS los valores numéricos y devuelve un JSON con esta estructura EXACTA:

{
  "weight_kg": número,
  "bmi": número,
  "body_fat_percent": número,
  "muscle_mass_kg": número,
  "visceral_fat_kg": número,
  "water_percent": número,
  "bone_mass_kg": número,
  "basal_metabolism": número,
  "protein_percent": número,
  "metabolic_age": número,
  "skeletal_muscle_percent": número,
  "subcutaneous_fat_percent": número
}

Devuelve SOLO el JSON, sin texto adicional.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
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
          temperature: 0.1,
          maxOutputTokens: 500,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  
  // Parsear JSON de la respuesta
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No se pudo extraer JSON de la respuesta');
  }
  
  return JSON.parse(jsonMatch[0]);
}

/**
 * Mock para desarrollo (simula análisis de imagen)
 */
async function mockAnalyzeCubitt(base64Image: string): Promise<CubittData> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Datos de ejemplo basados en la imagen que mostraste
  return {
    weight_kg: 59.3,
    bmi: 19.6,
    body_fat_percent: 8.7,
    muscle_mass_kg: 51.4,
    visceral_fat_kg: 3.1,
    water_percent: 65.9,
    bone_mass_kg: 2.77,
    basal_metabolism: 1670,
    protein_percent: 80.4,
    metabolic_age: 18,
    skeletal_muscle_percent: 58.9,
    subcutaneous_fat_percent: 8.7,
  };
}

/**
 * Obtener progreso de métricas (últimos 30 días)
 */
export async function getCubittProgress(days: number = 30) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    const { data, error } = await supabase
      .from('health_stats')
      .select('*')
      .eq('user_id', user.id)
      .gte('measured_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('measured_at', { ascending: true });

    if (error) {
      console.error('Error fetching Cubitt progress:', error);
      return { success: false, error: 'Error al obtener progreso' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getCubittProgress:', error);
    return { success: false, error: 'Error al obtener progreso' };
  }
}

/**
 * Obtener última medición de Cubitt
 */
export async function getLatestCubittData() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No autenticado' };
    }

    const { data, error } = await supabase
      .from('health_stats')
      .select('*')
      .eq('user_id', user.id)
      .order('measured_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching latest Cubitt data:', error);
      return { success: false, error: 'Error al obtener datos' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in getLatestCubittData:', error);
    return { success: false, error: 'Error al obtener datos' };
  }
}
