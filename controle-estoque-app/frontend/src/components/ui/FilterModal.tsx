'use client';

import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';

export interface FilterOptions {
  search?: string;
  categoryId?: string;
  status?: 'LOW' | 'MEDIUM' | 'GOOD' | '';
  dateFrom?: string;
  dateTo?: string;
}

interface Category {
  id: string;
  name: string;
  parentId?: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  categories?: Category[];
}

export function FilterModal({ isOpen, onClose, onApply, categories = [] }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    categoryId: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const getCategoryDisplay = (category: Category): string => {
    if (category.parentId) {
      const parent = categories.find(c => c.id === category.parentId);
      return parent ? `${category.name} (${parent.name})` : category.name;
    }
    return category.name;
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters: FilterOptions = {
      search: '',
      categoryId: '',
      status: '',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(emptyFilters);
    onApply(emptyFilters);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filtros Avançados" size="md">
      <div className="space-y-6">

        <div className="space-y-4">
          <Input
            label="Buscar por nome"
            placeholder="Digite o nome do produto..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <select
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getCategoryDisplay(cat)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status do Estoque</label>
            <select
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as FilterOptions['status'] })}
            >
              <option value="">Todos os status</option>
              <option value="LOW">Baixo</option>
              <option value="MEDIUM">Médio</option>
              <option value="GOOD">Bom</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data Inicial"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            />
            <Input
              label="Data Final"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Limpar Filtros
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </Modal>
  );
}
