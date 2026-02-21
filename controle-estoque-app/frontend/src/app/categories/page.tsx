
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Plus, Trash2, Edit, FolderTree } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; categoryId: string | null }>({
    isOpen: false,
    categoryId: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const getParentName = (parentId?: string): string => {
    if (!parentId) return '-';
    const parent = categories.find(c => c.id === parentId);
    return parent?.name || parentId;
  };

  const handleCreate = async () => {
    if (!newCategoryName) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }
    try {
      await api.post('/categories', { 
        name: newCategoryName, 
        parentId: parentId === '' ? null : parentId 
      });
      toast.success('Categoria criada com sucesso!');
      setNewCategoryName('');
      setParentId('');
      setIsModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao criar categoria');
      console.error('Failed to create category', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !newCategoryName) {
      toast.error('Nome da categoria é obrigatório');
      return;
    }
    try {
      await api.put(`/categories/${editingCategory.id}`, { 
        name: newCategoryName, 
        parentId: parentId === '' ? null : parentId 
      });
      toast.success('Categoria atualizada com sucesso!');
      setNewCategoryName('');
      setParentId('');
      setIsModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao atualizar categoria');
      console.error('Failed to update category', error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirm({ isOpen: true, categoryId: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.categoryId) return;
    
    try {
      await api.delete(`/categories/${deleteConfirm.categoryId}`);
      toast.success('Categoria deletada com sucesso!');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao deletar categoria');
      console.error('Failed to delete category', error);
    } finally {
      setDeleteConfirm({ isOpen: false, categoryId: null });
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setParentId(category.parentId || '');
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setParentId('');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <FolderTree size={24} className="text-nautico-red" />
          <h1 className="text-xl md:text-2xl font-bold text-nautico-black">Categorias</h1>
        </div>
        <Button onClick={openCreateModal} className="w-full sm:w-auto">
          <Plus size={18} className="mr-2" /> Nova Categoria
        </Button>
      </div>

      <Table
        data={categories}
        isLoading={loading}
        keyExtractor={(item) => item.id}
        columns={[
          { header: 'Nome', accessor: 'name', className: 'font-medium text-gray-900' },
          { 
            header: 'Categoria Pai', 
            render: (cat) => (
              <span className="text-sm text-gray-600">{getParentName(cat.parentId)}</span>
            )
          },
          { 
            header: 'Data de Criação', 
            render: (cat) => (
              <span className="text-sm text-gray-600">
                {new Date(cat.createdAt).toLocaleDateString('pt-BR')}
              </span>
            )
          },
          {
            header: 'Ações',
            render: (cat) => (
              <Dropdown>
                <DropdownItem onClick={() => openEditModal(cat)} icon={<Edit size={16} />}>
                  Editar
                </DropdownItem>
                <DropdownItem onClick={() => handleDelete(cat.id)} icon={<Trash2 size={16} />} variant="danger">
                  Deletar
                </DropdownItem>
              </Dropdown>
            )
          }
        ]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
          setNewCategoryName('');
          setParentId('');
        }}
        title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <div className="space-y-4">
          <Input 
            label="Nome da Categoria" 
            placeholder="Ex: Roupas" 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Categoria Pai (Opcional)</label>
            <select 
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">Nenhuma (Categoria Principal)</option>
              {categories
                .filter(c => !editingCategory || c.id !== editingCategory.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => {
                setIsModalOpen(false);
                setEditingCategory(null);
                setNewCategoryName('');
                setParentId('');
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={editingCategory ? handleUpdate : handleCreate} 
              disabled={!newCategoryName}
            >
              {editingCategory ? 'Atualizar' : 'Criar'} Categoria
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, categoryId: null })}
        onConfirm={confirmDelete}
        title="Excluir Categoria"
        message="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
