import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Filter, Edit, Trash2 } from 'lucide-react';
import { CreateCategoriaModal } from '../modals/CreateCategoriaModal';
import { EditCategoriaModal } from '../modals/EditCategoriaModal';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

export function AdminCategorias() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCategoria, setEditingCategoria] = useState<any>(null);
  const [deletingCategoria, setDeletingCategoria] = useState<any>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: categorias, isLoading, refetch } = useQuery({
    queryKey: ["admin-categorias", searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);
      
      if (error) throw error;
      
      return { data, count };
    }
  });

  const exportData = () => {
    if (categorias?.data) {
      const csv = [
        Object.keys(categorias.data[0]),
        ...categorias.data.map(categoria => Object.values(categoria))
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'categorias.csv';
      a.click();
    }
  };

  const handleEdit = (categoria: any) => {
    setEditingCategoria(categoria);
  };

  const handleDelete = (categoria: any) => {
    setDeletingCategoria(categoria);
  };

  const totalPages = Math.ceil((categorias?.count || 0) / itemsPerPage);

  if (isLoading) {
    return <div className="p-6">Carregando categorias...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Categorias</h1>
          <p className="text-gray-600">Gerencie todas as categorias de serviços</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Use os filtros para encontrar categorias específicas</CardDescription>
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
          <CardTitle>Lista de Categorias ({categorias?.count || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ícone</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias?.data?.map((categoria: any) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">{categoria.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{categoria.slug}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{categoria.description || '-'}</TableCell>
                  <TableCell>{categoria.icon || '-'}</TableCell>
                  <TableCell>
                    {categoria.color && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: categoria.color }}
                        />
                        <span className="text-sm">{categoria.color}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{new Date(categoria.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(categoria)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(categoria)}>
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

      <CreateCategoriaModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          refetch();
          setCreateModalOpen(false);
        }}
      />

      <EditCategoriaModal
        open={!!editingCategoria}
        onClose={() => setEditingCategoria(null)}
        categoria={editingCategoria}
        onUpdate={() => {
          refetch();
          setEditingCategoria(null);
        }}
      />

      <ConfirmDeleteModal
        open={!!deletingCategoria}
        onOpenChange={(open) => !open && setDeletingCategoria(null)}
        title="Excluir Categoria"
        description={`Tem certeza que deseja excluir a categoria "${deletingCategoria?.name}"? Esta ação não pode ser desfeita.`}
        tableName="categories"
        itemId={deletingCategoria?.id}
        queryKey={['admin-categorias']}
      />
    </div>
  );
}