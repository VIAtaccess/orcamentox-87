import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Filter } from 'lucide-react';

export function AdminAcessos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: acessos, isLoading } = useQuery({
    queryKey: ["admin-acessos", searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("acessos")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`url.ilike.%${searchQuery}%,ip_address.ilike.%${searchQuery}%,user_agent.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data, error, count } = await query.range(from, to);
      
      if (error) throw error;
      
      return { data, count };
    }
  });

  const exportData = () => {
    if (acessos?.data) {
      const csv = [
        Object.keys(acessos.data[0]),
        ...acessos.data.map(acesso => Object.values(acesso))
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'acessos.csv';
      a.click();
    }
  };

  const totalPages = Math.ceil((acessos?.count || 0) / itemsPerPage);

  if (isLoading) {
    return <div className="p-6">Carregando acessos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Histórico de Acessos</h1>
          <p className="text-gray-600">Monitore todos os acessos à plataforma</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros e Ações</CardTitle>
          <CardDescription>Use os filtros para encontrar acessos específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por URL, IP ou User Agent..."
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
          <CardTitle>Lista de Acessos ({acessos?.count || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>User Agent</TableHead>
                <TableHead>Session ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acessos?.data?.map((acesso: any) => (
                <TableRow key={acesso.id}>
                  <TableCell>{new Date(acesso.created_at).toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">{acesso.url}</TableCell>
                  <TableCell>{acesso.ip_address || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{acesso.referrer || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{acesso.user_agent || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{acesso.session_id || '-'}</TableCell>
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
    </div>
  );
}