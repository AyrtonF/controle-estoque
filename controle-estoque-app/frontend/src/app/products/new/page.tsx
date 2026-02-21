
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  categoryId: z.string().uuid('Selecione uma categoria válida'),
  minimumStockAlert: z.number().min(0, 'O estoque mínimo não pode ser negativo'),
  initialStock: z.number().min(0, 'O estoque inicial não pode ser negativo').optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryDisplay = (category: any): string => {
    if (category.parentId) {
      const parent = categories.find(c => c.id === category.parentId);
      return parent ? `${category.name} (${parent.name})` : category.name;
    }
    return category.name;
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      await api.post('/products', data);
      toast.success('Produto criado com sucesso!');
      router.push('/products');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar produto');
      console.error('Failed to create product', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-nautico-black">Novo Produto</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-sm space-y-6">
        <div className="space-y-4">
          <Input 
            label="Nome do Produto" 
            placeholder="Ex: Camiseta Polo Náutico" 
            {...register('name')} 
            error={errors.name?.message}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <select 
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nautico-red"
              {...register('categoryId')}
            >
              <option value="">Selecione uma categoria...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{getCategoryDisplay(cat)}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
          </div>

          <Input 
            label="Descrição (Opcional)" 
            placeholder="Detalhes do produto..." 
            {...register('description')} 
            error={errors.description?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="number" 
              label="Alerta de Estoque Mínimo" 
              {...register('minimumStockAlert', { valueAsNumber: true })} 
              error={errors.minimumStockAlert?.message}
            />
            <Input 
              type="number" 
              label="Estoque Inicial" 
              {...register('initialStock', { valueAsNumber: true })} 
              error={errors.initialStock?.message}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
            Cadastrar Produto
          </Button>
        </div>
      </form>
    </div>
  );
}
