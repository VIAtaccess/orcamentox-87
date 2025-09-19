import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { EditPropostaModal } from "@/components/admin/modals/EditPropostaModal";
import { ViewPropostaModal } from "@/components/admin/modals/ViewPropostaModal";
import { useToast } from "@/hooks/use-toast";

export function AdminPropostas() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProposta, setSelectedProposta] = useState(null);
  const itemsPerPage = 10;

  const { data: propostas, isLoading, refetch } = useQuery({
    queryKey: ["admin-propostas", searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("propostas")
        .select(`
          *,
          profissionais!inner (
            nome,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`descricao_proposta.ilike.%${searchQuery}%,status.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);
      
      if (error) throw error;
      
      return { data, count };
    }
  });

  const exportData = () => {
    if (propostas?.data) {
      const csv = [
        ['id', 'profissional', 'solicitacao_id', 'valor', 'status', 'criacao'],
        ...propostas.data.map(proposta => [
          proposta.id,
          (proposta as any).profissionais?.nome,
          proposta.solicitacao_id,
          proposta.valor_proposto,
          proposta.status,
          proposta.created_at
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'propostas.csv';
      a.click();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      'enviada': 'default',
      'aceita': 'secondary',
      'rejeitada': 'destructive',
      'expirada': 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const handleView = (proposta: any) => {
    setSelectedProposta(proposta);
    setViewModalOpen(true);
  };

  const handleEdit = (proposta: any) => {
    setSelectedProposta(proposta);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta proposta?')) {
      try {
        const { error } = await supabase
          .from('propostas')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Proposta excluída!",
          description: "A proposta foi excluída com sucesso.",
        });

        refetch();
      } catch (error) {
        console.error('Erro ao excluir proposta:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir a proposta.",
          variant: "destructive",
        });
      }
    }
  };

  const totalPages = Math.ceil((propostas?.count || 0) / itemsPerPage);

  if (isLoading) {
    return <div className="p-6">Carregando propostas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Propostas</h1>
          <p className="text-gray-600">Gerencie todas as propostas enviadas</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Use os filtros para encontrar propostas específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por descrição ou status..."
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
          <CardTitle>Lista de Propostas ({propostas?.count || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profissional</TableHead>
                <TableHead>Solicitação</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Materiais</TableHead>
                <TableHead>Criação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propostas?.data?.map((proposta: any) => (
                <TableRow key={proposta.id}>
                  <TableCell className="font-medium">
                    {proposta.profissionais?.nome || '-'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    Solicitação {proposta.solicitacao_id}
                  </TableCell>
                  <TableCell>
                    {proposta.valor_proposto ? 
                      `R$ ${parseFloat(proposta.valor_proposto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                      : '-'
                    }
                  </TableCell>
                  <TableCell>{proposta.prazo_estimado || '-'}</TableCell>
                  <TableCell>{getStatusBadge(proposta.status)}</TableCell>
                  <TableCell>
                    <Badge variant={proposta.materiais_inclusos ? 'default' : 'secondary'}>
                      {proposta.materiais_inclusos ? 'Inclusos' : 'Não inclusos'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(proposta.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleView(proposta)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(proposta)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(proposta.id)}>
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

      <ViewPropostaModal
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        proposta={selectedProposta}
      />

      <EditPropostaModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        proposta={selectedProposta}
        onUpdate={() => {
          refetch();
          setEditModalOpen(false);
        }}
      />
    </div>
  );
}