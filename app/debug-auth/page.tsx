'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function DebugAuthPage() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Verificar sesión
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session data:', sessionData);
      console.log('Session error:', sessionError);
      setSession(sessionData.session);

      // Verificar usuario
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('User data:', userData);
      console.log('User error:', userError);
      setUser(userData.user);
    } catch (err) {
      console.error('Error checking auth:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Debug Auth</h1>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Session</h2>
        {session ? (
          <pre className="bg-background p-4 rounded text-xs overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No hay sesión activa</p>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">User</h2>
        {user ? (
          <pre className="bg-background p-4 rounded text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No hay usuario autenticado</p>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Cookies</h2>
        <pre className="bg-background p-4 rounded text-xs overflow-auto">
          {document.cookie || 'No hay cookies'}
        </pre>
      </div>

      <div className="flex gap-4">
        <button
          onClick={checkAuth}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Recargar
        </button>
        <button
          onClick={() => window.location.href = '/login'}
          className="px-4 py-2 bg-card border border-border rounded"
        >
          Ir a Login
        </button>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="px-4 py-2 bg-card border border-border rounded"
        >
          Ir a Dashboard
        </button>
      </div>
    </div>
  );
}
