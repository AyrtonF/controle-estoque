'use client';

import { Modal } from './Modal';
import { ArrowRight } from 'lucide-react';

interface AuditValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousValue: unknown;
  newValue: unknown;
  action: string;
}

export function AuditValueModal({ isOpen, onClose, previousValue, newValue, action }: AuditValueModalProps) {
  const formatValue = (value: unknown, action: string): string => {
    if (value === null || value === undefined) return 'N/A';
    
    // Para CREATE, mostrar só a quantidade inicial
    if (action === 'Criado' && typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>;
      if (obj.currentStock !== undefined) {
        return `Quantidade inicial: ${obj.currentStock} unidades`;
      }
      if (obj.name) {
        return `Nome: ${obj.name}`;
      }
    }
    
    // Para DELETE, mostrar quantidade que tinha
    if (action === 'Deletado' && typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>;
      if (obj.currentStock !== undefined) {
        return `Estava com ${obj.currentStock} unidades em estoque`;
      }
      if (obj.name) {
        return `Nome: ${obj.name}`;
      }
    }
    
    // Para RESTOCK e REMOVE_STOCK, mostrar a diferença
    if ((action === 'Reabastecido' || action === 'Estoque Removido') && typeof value === 'number') {
      return `${value} unidades`;
    }
    
    // Para UPDATE, mostrar valores de forma amigável
    if (action === 'Atualizado' && typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>;
      const lines: string[] = [];
      
      if (obj.name !== undefined) lines.push(`Nome: ${obj.name}`);
      if (obj.description !== undefined) lines.push(`Descrição: ${obj.description || 'Sem descrição'}`);
      if (obj.currentStock !== undefined) lines.push(`Estoque: ${obj.currentStock}`);
      if (obj.minimumStockAlert !== undefined) lines.push(`Alerta mínimo: ${obj.minimumStockAlert}`);
      
      return lines.length > 0 ? lines.join('\n') : JSON.stringify(value, null, 2);
    }
    
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Alteração" size="lg">
      <div className="space-y-6">
        <div className="bg-nautico-gray p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Ação Realizada</p>
          <p className="text-lg font-semibold text-nautico-black">{action}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm font-medium text-red-800 mb-2">Valor Anterior</p>
            <pre className="text-sm text-red-900 whitespace-pre-wrap">
              {formatValue(previousValue, action)}
            </pre>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800 mb-2">Valor Novo</p>
            <pre className="text-sm text-green-900 whitespace-pre-wrap">
              {formatValue(newValue, action)}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-center text-gray-400">
          <ArrowRight size={24} />
        </div>
      </div>
    </Modal>
  );
}
