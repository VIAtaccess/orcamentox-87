import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Filter, Edit, Trash2 } from 'lucide-react';
import { CreateSubcategoriaModal } from '../modals/CreateSubcategoriaModal';
import { EditSubcategoriaModal } from '../modals/EditSubcategoriaModal';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

export function AdminSubcategorias() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSubcategoria, setEditingSubcategoria] = useState<any>(null);
  const [deletingSubcategoria, setDeletingSubcategoria] = useState<any>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: subcategorias, isLoading, refetch } = useQuery({
    queryKey: ["admin-subcategorias", searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("subcategories")
        .select("*", { count: 'exact' })
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data: subcategoriasData, error, count } = await query.range(from, to);
      
      if (error) throw error;
      
      // Buscar dados das categorias
      const categoryIds = subcategoriasData?.map(s => s.category_id).filter(Boolean) || [];
      
      if (categoryIds.length === 0) {
        return { data: subcategoriasData, count };
      }
      
      const { data: categoriasData } = await supabase
        .from("categories")
        .select("id, name")
        .in("id", categoryIds);
      
      // Combinar os dados
      const data = subcategoriasData?.map(subcategoria => ({
        ...subcategoria,
        categories: categoriasData?.find(c => c.id === subcategoria.category_id)
      }));
      
      return { data, count };
    }
  });

  const exportData = () => {
    if (subcategorias?.data) {
      const csv = [
        ['id', 'name', 'slug', 'description', 'category_name', 'created_at'],
        ...subcategorias.data.map(sub => [
          sub.id,
          sub.name,
          sub.slug,
          sub.description,
          (sub as any).categories?.name,
          sub.created_at
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subcategorias.csv';
      a.click();
    }
  };

  const totalPages = Math.ceil((subcategorias?.count || 0) / itemsPerPage);

  const handleEdit = (subcategoria: any) => {
    setEditingSubcategoria(subcategoria);
  };

  const handleDelete = (subcategoria: any) => {
    setDeletingSubcategoria(subcategoria);
  };

  if (isLoading) {
    return <div className="p-6">Carregando subcategorias...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Subcategorias</h1>
          <p className="text-gray-600">Gerencie todas as subcategorias de serviços</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova Subcategoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Use os filtros para encontrar subcategorias específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, slug ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" onClick={exportData} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Subcategorias ({subcategorias?.count || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Categoria Pai</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcategorias?.data?.map((subcategoria: any) => (
                <TableRow key={subcategoria.id}>
                  <TableCell className="font-medium">{subcategoria.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{subcategoria.slug}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{subcategoria.categories?.name || '-'}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{subcategoria.description || '-'}</TableCell>
                  <TableCell>{new Date(subcategoria.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(subcategoria)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(subcategoria)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4">
                Página {currentPage} de {totalPages}
              </span>
              <Button 
                variant="outline" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateSubcategoriaModal
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open);
          if (!open) refetch();
        }}
      />

      <EditSubcategoriaModal
        subcategoria={editingSubcategoria}
        open={!!editingSubcategoria}
        onOpenChange={(open) => !open && setEditingSubcategoria(null)}
      />

      <ConfirmDeleteModal
        open={!!deletingSubcategoria}
        onOpenChange={(open) => !open && setDeletingSubcategoria(null)}
        title="Excluir Subcategoria"
        description={`Tem certeza que deseja excluir a subcategoria "${deletingSubcategoria?.name}"? Esta ação não pode ser desfeita.`}
        tableName="subcategories"
        itemId={deletingSubcategoria?.id}
        queryKey={['admin-subcategorias']}
      />
    </div>
  );
}