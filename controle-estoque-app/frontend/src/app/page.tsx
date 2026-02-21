
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { translateAction, formatDate } from '@/lib/utils';
import { clsx } from 'clsx';

interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  recentLogs: any[];
  products: any[];
  categories: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockCount: 0,
    recentLogs: [],
    products: [],
    categories: [],
  });

  const fetchData = async () => {
    try {
      const [productsRes, logsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/audit-logs'),
        api.get('/categories'),
      ]);

      const products = productsRes.data;
      const logs = logsRes.data;
      const categories = categoriesRes.data;

      const lowStock = products.filter((p: any) => p.currentStock <= p.minimumStockAlert).length;

      setStats({
        totalProducts: products.length,
        lowStockCount: lowStock,
        recentLogs: logs.slice(-8).reverse(), // Last 8 logs
        products,
        categories,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEntityName = (log: any): string => {
    if (log.entityType === 'product') {
      const product = stats.products.find(p => p.id === log.entityId);
      return product?.name || log.entityId;
    }
    if (log.entityType === 'category') {
      const category = stats.categories.find(c => c.id === log.entityId);
      return category?.name || log.entityId;
    }
    return log.entityId;
  };

  const ActionBadge = ({ action }: { action: string }) => {
    const colors: Record<string, string> = {
      'CREATE': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'DELETE': 'bg-red-100 text-red-800',
      'RESTOCK': 'bg-emerald-100 text-emerald-800',
      'REMOVE_STOCK': 'bg-orange-100 text-orange-800',
    };
    return (
      <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold', colors[action] || 'bg-gray-100 text-gray-800')}>
        {translateAction(action)}
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between border-l-4" style={{ borderColor: color }}>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1 text-nautico-black">{value}</h3>
      </div>
      <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: color + '20', color: color }}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Produtos" value={stats.totalProducts} icon={Package} color="#C8102E" />
        <StatCard title="Estoque Baixo" value={stats.lowStockCount} icon={AlertTriangle} color="#F59E0B" />
        <StatCard title="Entradas Recentes" value="-" icon={ArrowUpRight} color="#10B981" />
        <StatCard title="Saídas Recentes" value="-" icon={ArrowDownRight} color="#EF4444" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Activity size={20} className="text-nautico-red" />
          <h3 className="text-lg font-bold text-nautico-black">Atividade Recente</h3>
        </div>
        <Table
          data={stats.recentLogs}
          columns={[
            { 
              header: 'Ação', 
              render: (log: any) => <ActionBadge action={log.action} />,
              className: 'w-32'
            },
            { 
              header: 'Item', 
              render: (log: any) => (
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{getEntityName(log)}</span>
                  <span className="text-xs text-gray-500">
                    {log.entityType === 'product' ? 'Produto' : 'Categoria'}
                  </span>
                </div>
              )
            },
            { 
              header: 'Data e Hora', 
              render: (log: any) => (
                <span className="text-sm text-gray-600">{formatDate(log.timestamp)}</span>
              )
            },
          ]}
          keyExtractor={(log: any) => log.id}
          emptyMessage="Nenhuma atividade recente."
        />
      </div>
    </div>
  );
}
