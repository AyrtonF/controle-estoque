
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/services/api';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FilterModal, FilterOptions } from '@/components/ui/FilterModal';
import { Plus, Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { getStockStatus, translateStockStatus } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  categoryId: string;
  currentStock: number;
  minimumStockAlert: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  parentId?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryDisplay = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return categoryId;

    if (category.parentId) {
      const parent = categories.find(c => c.id === category.parentId);
      return parent ? `${category.name} (${parent.name})` : category.name;
    }

    return category.name;
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      LOW: 'bg-red-100 text-red-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      GOOD: 'bg-green-100 text-green-800',
    };
    return (
      <span className={clsx('px-2 py-1 rounded-full text-xs font-semibold', colors[status as keyof typeof colors])}>
        {translateStockStatus(status)}
      </span>
    );
  };

  const applyFilters = (products: Product[]): Product[] => {
    return products.filter(p => {
      // Filtro de busca
      if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filtro de categoria (inclui subcategorias)
      if (filters.categoryId) {
        const productCategory = categories.find(c => c.id === p.categoryId);
        
        // Verifica se o produto está na categoria selecionada
        const isInCategory = p.categoryId === filters.categoryId;
        
        // Verifica se o produto está em uma subcategoria da categoria selecionada
        const isInSubcategory = productCategory?.parentId === filters.categoryId;
        
        if (!isInCategory && !isInSubcategory) {
          return false;
        }
      }

      // Filtro de status
      if (filters.status) {
        const status = getStockStatus(p.currentStock, p.minimumStockAlert);
        if (status !== filters.status) {
          return false;
        }
      }

      // Filtro de data inicial
      if (filters.dateFrom) {
        const productDate = new Date(p.createdAt);
        const filterDate = new Date(filters.dateFrom);
        if (productDate < filterDate) {
          return false;
        }
      }

      // Filtro de data final
      if (filters.dateTo) {
        const productDate = new Date(p.createdAt);
        const filterDate = new Date(filters.dateTo);
        if (productDate > filterDate) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredProducts = applyFilters(
    products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSearch(newFilters.search || '');
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-nautico-black">Produtos</h1>
        <Link href="/products/new">
          <Button className="w-full sm:w-auto">
            <Plus size={18} className="mr-2" /> Novo Produto
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <Input 
            placeholder="Buscar produtos..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilterModal(true)} className="w-full sm:w-auto">
          <Filter size={18} className="mr-2" /> 
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-nautico-red text-white rounded-full text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      <Table
        data={filteredProducts}
        isLoading={loading}
        keyExtractor={(item) => item.id}
        columns={[
          { 
            header: 'ID', 
            render: (item) => (
              <span className="text-xs font-mono text-gray-500">{item.id.substring(0, 8)}</span>
            ),
            className: 'w-24'
          },
          { header: 'Nome', accessor: 'name', className: 'font-medium text-gray-900' },
          { 
            header: 'Categoria', 
            render: (item) => (
              <span className="text-sm text-gray-600">{getCategoryDisplay(item.categoryId)}</span>
            )
          },
          { 
            header: 'Estoque Atual', 
            accessor: 'currentStock',
            className: 'text-center font-semibold'
          },
          { 
            header: 'Status', 
            render: (item) => <StatusBadge status={getStockStatus(item.currentStock, item.minimumStockAlert)} /> 
          },
          {
            header: 'Ações',
            render: (item) => (
              <div className="flex gap-2">
                <Link href={`/products/${item.id}`}>
                  <Button variant="secondary" size="sm">Gerenciar</Button>
                </Link>
              </div>
            )
          }
        ]}
      />

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        categories={categories}
      />
    </div>
  );
}
