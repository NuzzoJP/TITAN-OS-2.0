# 🚀 Guía de Configuración: Qwen2.5-VL (Máxima Precisión GRATIS)

## ¿Por qué Qwen?

Según benchmarks independientes de 2025:
- ✅ **Supera a GPT-4o** en MathVista, DocVQA, RealWorldQA
- ✅ **Supera a Gemini 2.0 Flash** en la mayoría de tests de visión
- ✅ **GRATIS:** 60 requests/min, 1000 requests/día
- ✅ **Open Source:** Transparencia total

## 📋 Pasos para Obtener API Key (5 minutos)

### Opción A: DashScope (Alibaba Cloud) - RECOMENDADO

1. **Crear cuenta:**
   - Ve a: https://dashscope.console.aliyun.com/
   - Click en "Sign Up" (arriba derecha)
   - Puedes usar Google/GitHub o email

2. **Activar DashScope:**
   - Una vez dentro, ve a "Model Studio"
   - Click en "Activate Service" (si aparece)
   - Es GRATIS, no requiere tarjeta de crédito

3. **Obtener API Key:**
   - Ve a: https://dashscope.console.aliyun.com/apiKey
   - Click en "Create API Key"
   - Selecciona "Default workspace"
   - Click en "Create"
   - **COPIA LA KEY** (solo se muestra una vez)

4. **Configurar en tu proyecto:**
   ```bash
   # Añade a titan-os/.env.local
   QWEN_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
   FOOD_AI_PROVIDER=qwen
   ```

### Opción B: Puter.com (Sin API Key) - MÁS FÁCIL

Si no quieres crear cuenta en Alibaba:

1. Usa el servicio gratuito de Puter.com
2. No requiere API key
3. Sin límites de requests
4. Implementación diferente (requiere cambios en el código)

## 🔧 Configuración en Vercel

Una vez que tengas tu API key:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade:
   - Name: `QWEN_API_KEY`
   - Value: `sk-xxxxxxxxxxxxxxxxxxxxxxxx`
   - Environment: Production, Preview, Development
4. Click "Save"
5. Redeploy tu proyecto

## 🧪 Probar que Funciona

1. Inicia tu app localmente:
   ```bash
   cd titan-os
   npm run dev
   ```

2. Ve a Health → Titan Fuel AI
3. Sube una foto de comida
4. Verifica en la consola del navegador:
   ```
   🤖 Analizando comida con QWEN...
   ```

## 📊 Límites y Cuotas

### Tier Gratuito (Default)
- **60 requests/minuto**
- **1,000 requests/día**
- **Modelos disponibles:**
  - `qwen2-vl-7b-instruct` (rápido, gratis)
  - `qwen2-vl-72b-instruct` (más preciso, gratis)

### Si Necesitas Más
- Alibaba Cloud ofrece planes de pago muy baratos
- ~$0.0005 por request (mucho más barato que GPT-4o)

## 🔄 Fallback Automático

El sistema está configurado con fallback en cascada:

```
1. Qwen2.5-VL (mejor precisión)
   ↓ (si falla)
2. Gemini 2.0 Flash (buena precisión)
   ↓ (si falla)
3. OpenAI GPT-4o (pago, último recurso)
```

Esto significa que si Qwen falla por cualquier razón, automáticamente usará Gemini.

## ❓ Troubleshooting

### Error: "QWEN_API_KEY no configurada"
**Solución:** Verifica que la key esté en `.env.local` y reinicia el servidor

### Error: "Qwen API error: 401"
**Solución:** La API key es inválida. Genera una nueva en DashScope

### Error: "Qwen API error: 429"
**Solución:** Excediste el límite de 60/min. Espera 1 minuto o el sistema usará Gemini automáticamente

### Error: "No se pudo extraer JSON"
**Solución:** La IA respondió en formato incorrecto. El sistema reintentará con Gemini

## 🎯 Comparación de Precisión

Basado en tus pruebas reales:

| Escenario | Qwen | Gemini | GPT-4o |
|-----------|------|--------|--------|
| 2 plátanos → "Bowl de quinoa" | ❌ | ❌ | ✅ |
| Con contexto: "2 plátanos" | ✅ | ✅ | ✅ |
| Platos complejos | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Comida asiática | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| OCR (etiquetas) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 💡 Tips para Máxima Precisión

1. **USA EL CAMPO DE CONTEXTO:**
   - "2 plátanos medianos"
   - "300g de arroz con aceite de oliva"
   - "pollo a la plancha sin aceite"

2. **Fotos de calidad:**
   - Vista desde arriba (cenital)
   - Buena iluminación
   - Todo el plato visible

3. **Menciona el método de cocción:**
   - "frito" → añade calorías de aceite
   - "al vapor" → sin grasa añadida
   - "Air Fryer" → sin aceite

## 🔗 Links Útiles

- [DashScope Console](https://dashscope.console.aliyun.com/)
- [Qwen2.5-VL GitHub](https://github.com/QwenLM/Qwen2.5-VL)
- [Documentación API](https://www.alibabacloud.com/help/en/model-studio/use-qwen-by-calling-api)
- [Benchmarks](https://the-decoder.com/?p=20888)

---

**¿Listo para empezar?** Sigue los pasos de "Opción A" arriba y tendrás la mejor precisión en 5 minutos.
