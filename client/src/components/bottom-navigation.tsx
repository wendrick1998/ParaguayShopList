import { Home, List, User } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: 'Início', path: '/dashboard' },
    { icon: List, label: 'Listas', path: '/dashboard' },
    { icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200",
      className
    )}>
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={cn(
                "flex flex-col items-center p-3 transition-colors",
                isActive ? "text-primary" : "text-gray-400"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
