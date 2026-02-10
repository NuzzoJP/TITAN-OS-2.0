# Configuración de Autenticación en Supabase

## Problema: Login no redirige al dashboard

Si después de hacer login no te redirige al dashboard, sigue estos pasos:

## 1. Deshabilitar Confirmación de Email

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Navega a **Authentication** → **Providers** → **Email**
3. Desactiva la opción **"Confirm email"**
4. Guarda los cambios

## 2. Verificar URL del Sitio

1. Ve a **Authentication** → **URL Configuration**
2. Asegúrate de que **Site URL** sea: `http://localhost:3001`
3. En **Redirect URLs**, agrega:
   - `http://localhost:3001/auth/callback`
   - `http://localhost:3001/dashboard`

## 3. Verificar Políticas RLS (Row Level Security)

Si las tablas tienen RLS habilitado, necesitas crear políticas:

```sql
-- Ejemplo para la tabla finance_accounts
ALTER TABLE finance_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own accounts"
ON finance_accounts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
ON finance_accounts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
ON finance_accounts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
ON finance_accounts FOR DELETE
USING (auth.uid() = user_id);
```

**IMPORTANTE**: Repite esto para TODAS las tablas que creaste.

## 4. Agregar columna user_id a las tablas

Si no lo has hecho, agrega la columna `user_id` a todas las tablas:

```sql
-- Finance
ALTER TABLE finance_accounts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE finance_transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE finance_budgets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Health
ALTER TABLE health_exercises ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE health_workout_sessions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE health_stats ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE health_metabolic_profile ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE health_nutrition_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Wisdom
ALTER TABLE wisdom_terms ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE wisdom_subjects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Chronos
ALTER TABLE chronos_events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
```

## 5. Probar el Login

1. Recarga la página de login (Ctrl + Shift + R para limpiar cache)
2. Ingresa tus credenciales
3. Deberías ser redirigido a `/dashboard`

## 6. Si aún no funciona

Abre la consola del navegador (F12) y busca errores. Los errores comunes son:

- **"Invalid login credentials"**: Email o contraseña incorrectos
- **"Email not confirmed"**: Necesitas confirmar el email o deshabilitar la confirmación
- **"Failed to fetch"**: Problema de red o CORS
- **Error 400**: Credenciales de Supabase incorrectas en `.env.local`

## 7. Verificar que el usuario existe

En Supabase:
1. Ve a **Authentication** → **Users**
2. Verifica que tu usuario aparezca en la lista
3. Si tiene un ícono de email sin confirmar, haz clic en los 3 puntos → **Confirm email**

## 8. Limpiar cookies y cache

A veces las cookies viejas causan problemas:
1. Abre DevTools (F12)
2. Ve a **Application** → **Cookies**
3. Elimina todas las cookies de `localhost:3001`
4. Recarga la página

---

**Después de seguir estos pasos, el login debería funcionar correctamente.**
