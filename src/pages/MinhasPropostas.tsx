import React, { useEffect } from "react";
import { usePrestadorData } from "@/hooks/usePrestadorData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, MessageSquare, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MinhasPropostas: React.FC = () => {
  // SEO
  useEffect(() => {
    document.title = "Minhas Propostas | Prestador";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Acompanhe as propostas enviadas, status e detalhes das solicitações.");
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "Acompanhe as propostas enviadas, status e detalhes das solicitações.";
      document.head.appendChild(m);
    }
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const href = window.location.origin + "/minhas-propostas";
    if (link) link.href = href; else {
      const l = document.createElement("link");
      l.rel = "canonical"; l.href = href; document.head.appendChild(l);
    }
  }, []);

  const { propostas, loading } = usePrestadorData();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6 flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Propostas</h1>
            <p className="text-gray-600 mt-1">Acompanhe suas propostas enviadas</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><FileText className="h-5 w-5 mr-2" />Propostas enviadas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-gray-500">Carregando...</div>
            ) : proposalsEmpty(propostas) ? (
              <div className="text-center py-10 text-gray-500">Você ainda não enviou propostas.</div>
            ) : (
              <div className="space-y-4">
                {propostas!.map((p: any) => (
                  <div key={p.id} className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-gray-900">{p.solicitacao?.titulo || 'Solicitação'}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            p.status === 'aceita' ? 'bg-green-100 text-green-700' :
                            p.status === 'rejeitada' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {p.status === 'aceita' ? 'Aceita' : p.status === 'rejeitada' ? 'Rejeitada' : 'Pendente'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(p.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div>
                            Valor: <span className="font-semibold text-gray-900">{p.valor_proposto ? `R$ ${p.valor_proposto}` : 'A combinar'}</span>
                          </div>
                          <div>
                            Prazo: <span className="font-semibold text-gray-900">{p.prazo_estimado || 'A definir'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.solicitacao?.id && (
                          <Button variant="outline" asChild>
                            <Link to={`/solicitacao/${p.solicitacao.id}`}>
                              <MessageSquare className="h-4 w-4 mr-1" /> Ver Solicitação
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function proposalsEmpty(arr: any[] | undefined) {
  return !arr || arr.length === 0;
}

export default MinhasPropostas;
