import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Filter, Edit, Trash2, DollarSign } from 'lucide-react';
import { CreatePlanoModal } from '../modals/CreatePlanoModal';
import { EditPlanoModal } from '../modals/EditPlanoModal';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

export function AdminPlanos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingPlano, setDeletingPlano] = useState<any>(null);
  const [editingPlano, setEditingPlano] = useState<any>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: planos, isLoading, refetch } = useQuery({
    queryKey: ["admin-planos", searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("planos")
        .select("*")
        .order("ordem", { ascending: true });

      if (searchQuery) {
        query = query.or(`titulo.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);
      
      if (error) throw error;
      
      return { data, count };
    }
  });

  const exportData = () => {
    if (planos?.data) {
      const csv = [
        Object.keys(planos.data[0]),
        ...planos.data.map(plano => Object.values(plano))
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'planos.csv';
      a.click();
    }
  };

  const handleDelete = (plano: any) => {
    setDeletingPlano(plano);
  };

  const totalPages = Math.ceil((planos?.count || 0) / itemsPerPage);

  if (isLoading) {
    return <div className="p-6">Carregando planos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Planos</h1>
          <p className="text-gray-600">Gerencie os planos de assinatura da plataforma</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Use os filtros para encontrar planos específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título ou descrição..."
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
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Lista de Planos ({planos?.count || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ordem</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criação</TableHead>
                <TableHead>Atualização</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planos?.data?.map((plano: any) => (
                <TableRow key={plano.id}>
                  <TableCell>
                    <Badge variant="outline">{plano.ordem}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{plano.titulo}</TableCell>
                  <TableCell className="max-w-xs truncate">{plano.descricao}</TableCell>
                  <TableCell>
                    <span className="font-medium text-green-600">
                      R$ {parseFloat(plano.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={plano.ativo ? 'default' : 'destructive'}>
                      {plano.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(plano.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{new Date(plano.updated_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingPlano(plano)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(plano)}>
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

      <CreatePlanoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          refetch();
          setCreateModalOpen(false);
        }}
      />

      <EditPlanoModal
        open={!!editingPlano}
        onClose={() => setEditingPlano(null)}
        plano={editingPlano}
        onUpdate={() => {
          refetch();
          setEditingPlano(null);
        }}
      />

      <ConfirmDeleteModal
        open={!!deletingPlano}
        onOpenChange={(open) => !open && setDeletingPlano(null)}
        title="Excluir Plano"
        description={`Tem certeza que deseja excluir o plano "${deletingPlano?.titulo}"? Esta ação não pode ser desfeita.`}
        tableName="planos"
        itemId={deletingPlano?.id}
        queryKey={['admin-planos']}
      />
    </div>
  );
}