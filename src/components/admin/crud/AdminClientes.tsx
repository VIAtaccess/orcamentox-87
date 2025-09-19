import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Filter, Edit, Trash2 } from 'lucide-react';
import { CreateClienteModal } from '../modals/CreateClienteModal';
import { EditClienteModal } from '../modals/EditClienteModal';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';

export function AdminClientes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCliente, setEditingCliente] = useState<any>(null);
  const [deletingCliente, setDeletingCliente] = useState<any>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: clientes, isLoading, refetch } = useQuery({
    queryKey: ["admin-clientes", searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`nome.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,whatsapp.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);
      
      if (error) throw error;
      
      return { data, count };
    }
  });

  const exportData = () => {
    if (clientes?.data) {
      const csv = [
        Object.keys(clientes.data[0]),
        ...clientes.data.map(cliente => Object.values(cliente))
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clientes.csv';
      a.click();
    }
  };

  const handleEdit = (cliente: any) => {
    setEditingCliente(cliente);
  };

  const handleDelete = (cliente: any) => {
    setDeletingCliente(cliente);
  };

  const totalPages = Math.ceil((clientes?.count || 0) / itemsPerPage);

  if (isLoading) {
    return <div className="p-6">Carregando clientes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
          <p className="text-gray-600">Gerencie todos os clientes cadastrados na plataforma</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Use os filtros para encontrar clientes específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou WhatsApp..."
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
          <CardTitle>Lista de Clientes ({clientes?.count || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes?.data?.map((cliente: any) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.whatsapp || '-'}</TableCell>
                  <TableCell>{`${cliente.cidade || '-'}/${cliente.uf || '-'}`}</TableCell>
                  <TableCell>
                    <Badge variant={cliente.tipo_pessoa === 'juridica' ? 'default' : 'secondary'}>
                      {cliente.tipo_pessoa === 'juridica' ? 'PJ' : 'PF'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cliente.ativo ? 'default' : 'destructive'}>
                      {cliente.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(cliente.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(cliente)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(cliente)}>
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

      <CreateClienteModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          refetch();
          setCreateModalOpen(false);
        }}
      />

      <EditClienteModal
        open={!!editingCliente}
        onClose={() => setEditingCliente(null)}
        cliente={editingCliente}
        onUpdate={() => {
          refetch();
          setEditingCliente(null);
        }}
      />

      <ConfirmDeleteModal
        open={!!deletingCliente}
        onOpenChange={(open) => !open && setDeletingCliente(null)}
        title="Excluir Cliente"
        description={`Tem certeza que deseja excluir o cliente "${deletingCliente?.nome}"? Esta ação não pode ser desfeita.`}
        tableName="clientes"
        itemId={deletingCliente?.id}
        queryKey={['admin-clientes']}
      />
    </div>
  );
}