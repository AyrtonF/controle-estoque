
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuditValueModal } from '@/components/ui/AuditValueModal';
import { Activity, Clock, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { translateAction, formatDate, translateEntityType } from '@/lib/utils';

interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  previousValue: any;
  newValue: any;
  timestamp: string;
  user: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [logsRes, productsRes, categoriesRes] = await Promise.all([
        api.get('/audit-logs'),
        api.get('/products'),
        api.get('/categories'),
      ]);
      setLogs(logsRes.data.reverse()); // Newest first
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
    } finally {
      setLoading(false);
    }
  };

  const getEntityName = (log: AuditLog): string => {
    if (log.entityType === 'product') {
      const product = products.find(p => p.id === log.entityId);
      return product?.name || log.entityId;
    }
    if (log.entityType === 'category') {
      const category = categories.find(c => c.id === log.entityId);
      return category?.name || log.entityId;
    }
    return log.entityId;
  };

  const ActionBadge = ({ action }: { action: string }) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-800',
      UPDATE: 'bg-blue-100 text-blue-800',
      DELETE: 'bg-red-100 text-red-800',
      RESTOCK: 'bg-emerald-100 text-emerald-800',
      REMOVE_STOCK: 'bg-orange-100 text-orange-800',
    };
    return (
      <span className={clsx('px-2.5 py-1 rounded-full text-xs font-semibold', colors[action as keyof typeof colors])}>
        {translateAction(action)}
      </span>
    );
  };

  const filteredLogs = logs.filter(log => {
    // Filtro de busca por nome do item
    if (searchTerm) {
      const entityName = getEntityName(log).toLowerCase();
      if (!entityName.includes(searchTerm.toLowerCase())) return false;
    }

    // Filtro de ação
    if (actionFilter && log.action !== actionFilter) return false;

    // Filtro de tipo de entidade
    if (entityTypeFilter && log.entityType !== entityTypeFilter) return false;

    // Filtro de data inicial
    if (dateFrom) {
      const logDate = new Date(log.timestamp);
      const filterDate = new Date(dateFrom);
      if (logDate < filterDate) return false;
    }

    // Filtro de data final
    if (dateTo) {
      const logDate = new Date(log.timestamp);
      const filterDate = new Date(dateTo);
      filterDate.setHours(23, 59, 59, 999); // Incluir o dia todo
      if (logDate > filterDate) return false;
    }

    return true;
  });

  const activeFiltersCount = [searchTerm, actionFilter, entityTypeFilter, dateFrom, dateTo].filter(f => f !== '').length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <Activity size={24} className="text-nautico-red" />
        <h1 className="text-xl md:text-2xl font-bold text-nautico-black">Log de Auditoria</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-nautico-red" />
          <h3 className="text-sm font-semibold text-gray-700">Filtros</h3>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-nautico-red text-white rounded-full text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Buscar item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <select
            className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">Todas as ações</option>
            <option value="CREATE">Criação</option>
            <option value="UPDATE">Atualização</option>
            <option value="DELETE">Deleção</option>
            <option value="RESTOCK">Reabastecimento</option>
            <option value="REMOVE_STOCK">Remoção de Estoque</option>
          </select>

          <select
            className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={entityTypeFilter}
            onChange={(e) => setEntityTypeFilter(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="product">Produto</option>
            <option value="category">Categoria</option>
          </select>

          <Input
            type="date"
            label=""
            placeholder="Data inicial"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full"
          />

          <Input
            type="date"
            label=""
            placeholder="Data final"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full"
          />
        </div>

        {activeFiltersCount > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setActionFilter('');
              setEntityTypeFilter('');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          data={filteredLogs}
          isLoading={loading}
          keyExtractor={(item) => item.id}
          columns={[
            { 
              header: 'Ação', 
              render: (log) => <ActionBadge action={log.action} />,
              className: 'w-32'
            },
            { 
              header: 'Item', 
              render: (log) => (
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{getEntityName(log)}</span>
                  <span className="text-xs text-gray-500 font-mono">ID: {log.entityId}</span>
                </div>
              )
            },
            { 
              header: 'Data e Hora', 
              render: (log) => (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={14} />
                  {formatDate(log.timestamp)}
                </div>
              )
            },
            {
              header: 'Detalhes',
              render: (log) => (
                <button 
                  onClick={() => setSelectedLog(log)}
                  className="text-nautico-red hover:text-nautico-dark underline underline-offset-4 text-xs font-medium transition-colors"
                >
                  Ver Valores
                </button>
              )
            }
          ]}
          emptyMessage="Nenhum registro de auditoria encontrado."
        />
      </div>

      {selectedLog && (
        <AuditValueModal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          previousValue={selectedLog.previousValue}
          newValue={selectedLog.newValue}
          action={translateAction(selectedLog.action)}
        />
      )}
    </div>
  );
}
