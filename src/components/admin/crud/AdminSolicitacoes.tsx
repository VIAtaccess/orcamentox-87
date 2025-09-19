import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { CreateSolicitacaoModal } from '../modals/CreateSolicitacaoModal';
import { EditSolicitacaoModal } from "@/components/admin/modals/EditSolicitacaoModal";
import { ViewSolicitacaoModal } from "@/components/admin/modals/ViewSolicitacaoModal";
import { useToast } from "@/hooks/use-toast";

export function AdminSolicitacoes() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: solicitacoes, isLoading, refetch } = useQuery({
    queryKey: ["admin-solicitacoes", searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("solicitacoes_orcamento")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`titulo.ilike.%${searchQuery}%,nome_cliente.ilike.%${searchQuery}%,cidade.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);
      
      if (error) throw error;
      
      return { data, count };
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'default';
      case 'finalizada': return 'secondary';
      case 'cancelada': return 'destructive';
      default: return 'outline';
    }
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'outline';
    }
  };

  const handleView = (solicitacao: any) => {
    setSelectedSolicitacao(solicitacao);
    setViewModalOpen(true);
  };

  const handleEdit = (solicitacao: any) => {
    setSelectedSolicitacao(solicitacao);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
      try {
        const { error } = await supabase
          .from('solicitacoes_orcamento')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Solicitação excluída!",
          description: "A solicitação foi excluída com sucesso.",
        });

        refetch();
      } catch (error) {
        console.error('Erro ao excluir solicitação:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a solicitação.",
          variant: "destructive",
        });
      }
    }
  };

  const exportData = () => {
    if (solicitacoes?.data) {
      const csv = [
        Object.keys(solicitacoes.data[0]),
        ...solicitacoes.data.map(sol => Object.values(sol))
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'solicitacoes.csv';
      a.click();
    }
  };

  const totalPages = Math.ceil((solicitacoes?.count || 0) / itemsPerPage);

  if (isLoading) {
    return <div className="p-6">Carregando solicitações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Solicitações</h1>
          <p className="text-gray-600">Gerencie todas as solicitações de orçamento da plataforma</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova Solicitação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Use os filtros para encontrar solicitações específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por título, cliente ou cidade..."
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
          <CardTitle>Lista de Solicitações ({solicitacoes?.count || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Título</TableHead>
                  <TableHead className="min-w-[180px]">Cliente</TableHead>
                  <TableHead className="min-w-[100px]">Localização</TableHead>
                  <TableHead className="min-w-[80px]">Urgência</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitacoes?.data?.map((solicitacao: any) => (
                  <TableRow key={solicitacao.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {solicitacao.titulo}
                    </TableCell>
                    <TableCell className="min-w-[180px]">
                      <div>
                        <div className="font-medium truncate">{solicitacao.nome_cliente || 'N/A'}</div>
                        <div className="text-sm text-gray-500 truncate">{solicitacao.email_cliente}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[100px] truncate">{`${solicitacao.cidade}/${solicitacao.uf}`}</TableCell>
                    <TableCell>
                      <Badge variant={getUrgenciaColor(solicitacao.urgencia)}>
                        {solicitacao.urgencia?.charAt(0).toUpperCase() + solicitacao.urgencia?.slice(1) || 'Média'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(solicitacao.status)}>
                        {solicitacao.status?.charAt(0).toUpperCase() + solicitacao.status?.slice(1) || 'Ativa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleView(solicitacao)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(solicitacao)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(solicitacao.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
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

      <CreateSolicitacaoModal
        open={createModalOpen}  
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          refetch();
          setCreateModalOpen(false);
        }}
      />

      <ViewSolicitacaoModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        solicitacao={selectedSolicitacao}
      />

      <EditSolicitacaoModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        solicitacao={selectedSolicitacao}
        onUpdate={() => {
          refetch();
          setEditModalOpen(false);
        }}
      />
    </div>
  );
}