
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Table } from '@/components/ui/Table';
import { FileText, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { translateAction, formatDate } from '@/lib/utils';
import { clsx } from 'clsx';

interface Product {
  id: string;
  name: string;
  currentStock: number;
  minimumStockAlert: number;
  deletedAt?: string;
}

interface AuditLog {
  id: string;
  action: string;
  entityId: string;
  timestamp: string;
  newValue?: number;
  previousValue?: number;
}

interface ReportData {
  dailyChanges: AuditLog[];
  lowStockItems: Product[];
  totals: { entries: number; removals: number };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    dailyChanges: [],
    lowStockItems: [],
    totals: { entries: 0, removals: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [productsRes, logsRes] = await Promise.all([
        api.get('/products'),
        api.get('/audit-logs'),
      ]);

      const products = productsRes.data;
      const logs = logsRes.data;

      // Filter daily logs
      const today = new Date().toISOString().split('T')[0];
      const dailyLogs = logs.filter((l: any) => l.timestamp.startsWith(today));

      // Low stock items
      const lowStock = products.filter((p: any) => p.currentStock <= p.minimumStockAlert && !p.deletedAt);

      // Totals
      const entries = logs.filter((l: any) => l.action === 'RESTOCK').reduce((acc: number, l: any) => acc + (l.newValue - l.previousValue), 0);
      const removals = logs.filter((l: any) => l.action === 'REMOVE_STOCK').reduce((acc: number, l: any) => acc + (l.previousValue - l.newValue), 0);

      setReportData({
        dailyChanges: dailyLogs,
        lowStockItems: lowStock,
        totals: { entries, removals },
      });
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-nautico-red" />
        <h1 className="text-2xl font-bold text-nautico-black">Relatórios e Estatísticas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between border-b-2 border-emerald-500">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">Total Entradas</p>
            <h3 className="text-2xl font-bold text-emerald-600">+{reportData.totals.entries}</h3>
            <p className="text-xs text-gray-500 mt-1">Unidades reabastecidas</p>
          </div>
          <TrendingUp className="text-emerald-500" size={28} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between border-b-2 border-red-500">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">Total Saídas</p>
            <h3 className="text-2xl font-bold text-red-600">-{reportData.totals.removals}</h3>
            <p className="text-xs text-gray-500 mt-1">Unidades removidas</p>
          </div>
          <TrendingDown className="text-red-500" size={28} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between border-b-2 border-orange-500">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1 tracking-wider">Itens em Alerta</p>
            <h3 className="text-2xl font-bold text-orange-600">{reportData.lowStockItems.length}</h3>
            <p className="text-xs text-gray-500 mt-1">Requerem atenção</p>
          </div>
          <AlertCircle className="text-orange-500" size={28} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-nautico-black flex items-center gap-2">
            <AlertCircle className="text-red-600" size={18} /> Itens com Baixo Estoque
          </h3>
          <Table
            data={reportData.lowStockItems}
            isLoading={loading}
            keyExtractor={(p) => p.id}
            columns={[
              { header: 'Produto', accessor: 'name', className: 'font-medium text-gray-900' },
              { 
                header: 'Estoque Atual', 
                render: (p) => (
                  <span className="font-bold text-red-600">{p.currentStock}</span>
                ),
                className: 'text-center'
              },
              { 
                header: 'Mínimo', 
                accessor: 'minimumStockAlert',
                className: 'text-center text-gray-600'
              },
            ]}
            emptyMessage="Nenhum item com estoque baixo. Parabéns!"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-nautico-black flex items-center gap-2">
             Movimentações de Hoje
          </h3>
          <Table
            data={reportData.dailyChanges}
            isLoading={loading}
            keyExtractor={(l) => l.id}
            columns={[
              { 
                header: 'Ação', 
                render: (l) => <ActionBadge action={l.action} />
              },
              { 
                header: 'Item', 
                render: (l) => (
                  <span className="text-sm text-gray-600 font-mono truncate block max-w-25">{l.entityId.substring(0, 8)}...</span>
                )
              },
              { 
                header: 'Variação', 
                render: (l) => {
                  const newVal = Number(l.newValue) || 0;
                  const prevVal = Number(l.previousValue) || 0;
                  const diff = newVal - prevVal;
                  return (
                    <span className={clsx('font-semibold', diff > 0 ? 'text-green-600' : 'text-red-600')}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  );
                } 
              },
            ]}
            emptyMessage="Nenhuma movimentação hoje."
          />
        </div>
      </div>
    </div>
  );
}
