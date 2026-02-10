'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, Dumbbell, GraduationCap, Clock, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Finance', href: '/dashboard/finance', icon: DollarSign },
  { name: 'Health', href: '/dashboard/health', icon: Dumbbell },
  { name: 'Wisdom', href: '/dashboard/wisdom', icon: GraduationCap },
  { name: 'Chronos', href: '/dashboard/chronos', icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-card border-r border-border flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl">T</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center transition-colors
                ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }
              `}
              title={item.name}
            >
              <Icon size={24} />
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-12 h-12 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        title="Cerrar Sesión"
      >
        <LogOut size={24} />
      </button>
    </aside>
  );
}
