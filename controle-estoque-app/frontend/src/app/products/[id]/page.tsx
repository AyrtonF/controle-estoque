
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ArrowLeft, Trash2, Package, History } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  minimumStockAlert: z.number().min(0, 'O estoque mínimo não pode ser negativo'),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [stockAmount, setStockAmount] = useState<number>(0);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products/${id}`),
        ]);
        setCategories(categoriesRes.data);
        setProduct(productRes.data);
        reset(productRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, reset]);

  const getCategoryDisplay = (category: any): string => {
    if (category.parentId) {
      const parent = categories.find(c => c.id === category.parentId);
      return parent ? `${category.name} (${parent.name})` : category.name;
    }
    return category.name;
  };

  const onUpdate = async (data: ProductFormData) => {
    setIsUpdating(true);
    try {
      await api.put(`/products/${id}`, data);
      toast.success('Produto atualizado com sucesso!');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar produto');
      console.error('Failed to update product', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStockAction = async (action: 'restock' | 'remove') => {
    if (stockAmount <= 0) {
      toast.error('A quantidade deve ser maior que zero');
      return;
    }
    
    if (action === 'remove' && stockAmount > product.stockAmount) {
      toast.error(`Não é possível remover ${stockAmount} unidades. Estoque atual: ${product.stockAmount}`);
      return;
    }

    try {
      const endpoint = action === 'restock' ? '/stock/restock' : '/stock/remove';
      await api.post(endpoint, { productId: id, quantity: stockAmount });
      
      // Refresh product data
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setStockAmount(0);
      toast.success(`Estoque ${action === 'restock' ? 'reabastecido' : 'removido'} com sucesso!`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar estoque');
    }
  };

  const handleDelete = async () => {
    setDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produto deletado com sucesso!');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao deletar produto');
      console.error('Failed to delete product', error);
    }
  };

  if (isLoading) return (
    <div className="p-4 md:p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nautico-red mx-auto"></div>
      <p className="mt-4 text-gray-600">Carregando...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-nautico-black">Editar Produto</h1>
        </div>
        <Button variant="danger" onClick={handleDelete} className="w-full sm:w-auto">
          <Trash2 size={18} className="mr-2" /> Deletar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit(onUpdate)} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-semibold text-nautico-black border-b border-gray-100 pb-3">Informações Básicas</h3>
            
            <div className="space-y-4">
              <Input label="Nome" {...register('name')} error={errors.name?.message} />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <select className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm" {...register('categoryId')}>
                  <option value="">Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{getCategoryDisplay(cat)}</option>
                  ))}
                </select>
              </div>
              <Input label="Descrição" {...register('description')} error={errors.description?.message} />
              <Input type="number" label="Alerta de Estoque Mínimo" {...register('minimumStockAlert', { valueAsNumber: true })} />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isUpdating}>Salvar Alterações</Button>
            </div>
          </form>
        </div>

        {/* Stock Management Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-semibold text-nautico-black border-b border-gray-100 pb-3 flex items-center gap-2">
              <Package size={18} /> Gestão de Estoque
            </h3>

            <div className="bg-nautico-gray p-4 rounded-md text-center">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Saldo Atual</p>
              <p className="text-4xl font-bold text-nautico-black">{product?.currentStock}</p>
            </div>

            <div className="space-y-4">
              <Input 
                type="number" 
                label="Quantidade" 
                placeholder="0"
                min="0"
                value={stockAmount === 0 ? '' : stockAmount}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  setStockAmount(val < 0 ? 0 : val);
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => handleStockAction('restock')} disabled={stockAmount <= 0}>
                  Entrada
                </Button>
                <Button variant="outline" onClick={() => handleStockAction('remove')} disabled={stockAmount <= 0 || stockAmount > product?.currentStock}>
                  Saída
                </Button>
              </div>
              {stockAmount > product?.currentStock && (
                <p className="text-xs text-red-600 text-center">Quantidade superior ao saldo atual</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
             <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-tight">
               <History size={16} /> Última Movimentação
             </h3>
             <div className="text-sm">
                <p className="text-gray-900 font-medium">Reabastecimento</p>
                <p className="text-xs text-gray-500">{product?.lastRestockAt ? new Date(product.lastRestockAt).toLocaleString() : 'Nunca'}</p>
             </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Excluir Produto"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
