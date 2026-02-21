
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, FolderTree, FileText, Activity, X } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Produtos', href: '/products', icon: Package },
  { name: 'Categorias', href: '/categories', icon: FolderTree },
  { name: 'Auditoria', href: '/audit', icon: Activity },
  { name: 'Relatórios', href: '/reports', icon: FileText },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "w-64 bg-nautico-red text-white h-screen fixed top-0 left-0 flex flex-col shadow-lg z-50 transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Close button - mobile only */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 hover:bg-nautico-dark rounded-md transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6 border-b border-nautico-dark">
          <h1 className="text-2xl font-bold tracking-tight">Estoque </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                  isActive
                    ? 'bg-white text-nautico-red font-medium shadow-sm'
                    : 'hover:bg-nautico-dark text-white/90'
                )}
              >
                <item.icon size={20} />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-nautico-dark text-xs text-white/60 text-center">
          v1.0.0
        </div>
      </aside>
    </>
  );
}
