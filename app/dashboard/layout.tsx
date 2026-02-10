import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PrivacyProvider } from '@/lib/contexts/privacy-context';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <PrivacyProvider>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="ml-20">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="p-8">{children}</main>
        </div>
      </div>
    </PrivacyProvider>
  );
}
