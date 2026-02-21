
'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Bell, Package, Menu } from 'lucide-react';
import { api } from '@/services/api';
import Link from 'next/link';

interface LowStockProduct {
  id: string;
  name: string;
  currentStock: number;
  minimumStockAlert: number;
}

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const getTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/products')) return 'Gerenciamento de Produtos';
    if (pathname.startsWith('/categories')) return 'Gerenciamento de Categorias';
    if (pathname.startsWith('/audit')) return 'Auditoria de Sistema';
    if (pathname.startsWith('/reports')) return 'Relatórios de Estoque';
    return '';
  };

  useEffect(() => {
    fetchLowStockProducts();
    const interval = setInterval(fetchLowStockProducts, 60000); // Atualiza a cada 1 minuto
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const fetchLowStockProducts = async () => {
    try {
      const response = await api.get('/products');
      const products = response.data;
      const lowStock = products.filter(
        (p: any) => p.currentStock <= p.minimumStockAlert && !p.deletedAt
      );
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Failed to fetch low stock products', error);
    }
  };

  return (
    <header className="bg-white h-16 shadow-sm flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Botão de menu hambúrguer - visível apenas em mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:text-nautico-red transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <h2 className="text-lg md:text-xl font-semibold text-nautico-black tracking-tight truncate">
          {getTitle()}
        </h2>
      </div>
      
      <div className="relative" ref={notificationRef}>
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 text-gray-500 hover:text-nautico-red transition-colors relative"
        >
          <Bell size={20} />
          {lowStockProducts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-nautico-red rounded-full ring-2 ring-white"></span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-nautico-black">Notificações</h3>
              <p className="text-xs text-gray-500 mt-1">
                {lowStockProducts.length} produto(s) com estoque baixo
              </p>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {lowStockProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={() => setShowNotifications(false)}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Package size={16} className="text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Estoque baixo: {product.currentStock} unidades
                        </p>
                        <p className="text-xs text-gray-500">
                          Mínimo: {product.minimumStockAlert} unidades
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
