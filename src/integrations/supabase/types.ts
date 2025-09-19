export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      acessos: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          referrer: string | null
          session_id: string | null
          url: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          url: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          referrer?: string | null
          session_id?: string | null
          url?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      avaliacoes: {
        Row: {
          cliente_id: string | null
          comentario: string | null
          created_at: string
          id: string
          nota: number
          prestador_id: string
          recomenda: boolean | null
          solicitacao_id: string
        }
        Insert: {
          cliente_id?: string | null
          comentario?: string | null
          created_at?: string
          id?: string
          nota: number
          prestador_id: string
          recomenda?: boolean | null
          solicitacao_id: string
        }
        Update: {
          cliente_id?: string | null
          comentario?: string | null
          created_at?: string
          id?: string
          nota?: number
          prestador_id?: string
          recomenda?: boolean | null
          solicitacao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes_orcamento"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          aceita_marketing: boolean | null
          ativo: boolean | null
          cidade: string | null
          cpf_cnpj: string | null
          created_at: string
          data_nascimento: string | null
          email: string
          endereco: string | null
          foto_url: string | null
          id: string
          nome: string
          tipo_pessoa: string | null
          uf: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          aceita_marketing?: boolean | null
          ativo?: boolean | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          data_nascimento?: string | null
          email: string
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          tipo_pessoa?: string | null
          uf?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          aceita_marketing?: boolean | null
          ativo?: boolean | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string
          endereco?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          tipo_pessoa?: string | null
          uf?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      favoritos: {
        Row: {
          cliente_id: string
          created_at: string
          id: string
          prestador_id: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          id?: string
          prestador_id: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          id?: string
          prestador_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favoritos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      planos: {
        Row: {
          ativo: boolean | null
          created_at: string
          descricao: string
          id: string
          ordem: number | null
          titulo: string
          updated_at: string
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          descricao: string
          id?: string
          ordem?: number | null
          titulo: string
          updated_at?: string
          valor: number
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          descricao?: string
          id?: string
          ordem?: number | null
          titulo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      profissionais: {
        Row: {
          admin: boolean
          ativo: boolean | null
          avaliacao: number | null
          categoria: string | null
          categoria_slug: string | null
          cidade: string | null
          cnpj: string | null
          created_at: string
          descricao: string | null
          email: string | null
          endereco: string | null
          foto_url: string | null
          id: string
          imagem_servico_1: string | null
          imagem_servico_2: string | null
          imagem_servico_3: string | null
          nome: string
          nota_media: number | null
          subcategoria_slug: string | null
          total_avaliacoes: number | null
          uf: string | null
          updated_at: string
          verificado: boolean | null
          whatsapp: string | null
        }
        Insert: {
          admin?: boolean
          ativo?: boolean | null
          avaliacao?: number | null
          categoria?: string | null
          categoria_slug?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          descricao?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          imagem_servico_1?: string | null
          imagem_servico_2?: string | null
          imagem_servico_3?: string | null
          nome: string
          nota_media?: number | null
          subcategoria_slug?: string | null
          total_avaliacoes?: number | null
          uf?: string | null
          updated_at?: string
          verificado?: boolean | null
          whatsapp?: string | null
        }
        Update: {
          admin?: boolean
          ativo?: boolean | null
          avaliacao?: number | null
          categoria?: string | null
          categoria_slug?: string | null
          cidade?: string | null
          cnpj?: string | null
          created_at?: string
          descricao?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          id?: string
          imagem_servico_1?: string | null
          imagem_servico_2?: string | null
          imagem_servico_3?: string | null
          nome?: string
          nota_media?: number | null
          subcategoria_slug?: string | null
          total_avaliacoes?: number | null
          uf?: string | null
          updated_at?: string
          verificado?: boolean | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      propostas: {
        Row: {
          created_at: string
          data_expiracao: string | null
          descricao_proposta: string
          garantia: string | null
          id: string
          materiais_inclusos: boolean | null
          prazo_estimado: string | null
          prestador_id: string
          solicitacao_id: string
          status: string | null
          updated_at: string
          valor_proposto: number | null
        }
        Insert: {
          created_at?: string
          data_expiracao?: string | null
          descricao_proposta: string
          garantia?: string | null
          id?: string
          materiais_inclusos?: boolean | null
          prazo_estimado?: string | null
          prestador_id: string
          solicitacao_id: string
          status?: string | null
          updated_at?: string
          valor_proposto?: number | null
        }
        Update: {
          created_at?: string
          data_expiracao?: string | null
          descricao_proposta?: string
          garantia?: string | null
          id?: string
          materiais_inclusos?: boolean | null
          prazo_estimado?: string | null
          prestador_id?: string
          solicitacao_id?: string
          status?: string | null
          updated_at?: string
          valor_proposto?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "propostas_solicitacao_id_fkey"
            columns: ["solicitacao_id"]
            isOneToOne: false
            referencedRelation: "solicitacoes_orcamento"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitacoes_orcamento: {
        Row: {
          categoria_id: string | null
          cidade: string
          cliente_id: string | null
          created_at: string
          descricao: string
          email_cliente: string | null
          endereco: string
          id: string
          max_propostas: number | null
          nome_cliente: string | null
          orcamento_estimado: string | null
          prazo_resposta: string | null
          status: string | null
          subcategoria_id: string | null
          titulo: string
          uf: string
          updated_at: string
          urgencia: string | null
          whatsapp_cliente: string | null
        }
        Insert: {
          categoria_id?: string | null
          cidade: string
          cliente_id?: string | null
          created_at?: string
          descricao: string
          email_cliente?: string | null
          endereco: string
          id?: string
          max_propostas?: number | null
          nome_cliente?: string | null
          orcamento_estimado?: string | null
          prazo_resposta?: string | null
          status?: string | null
          subcategoria_id?: string | null
          titulo: string
          uf: string
          updated_at?: string
          urgencia?: string | null
          whatsapp_cliente?: string | null
        }
        Update: {
          categoria_id?: string | null
          cidade?: string
          cliente_id?: string | null
          created_at?: string
          descricao?: string
          email_cliente?: string | null
          endereco?: string
          id?: string
          max_propostas?: number | null
          nome_cliente?: string | null
          orcamento_estimado?: string | null
          prazo_resposta?: string | null
          status?: string | null
          subcategoria_id?: string | null
          titulo?: string
          uf?: string
          updated_at?: string
          urgencia?: string | null
          whatsapp_cliente?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitacoes_orcamento_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_orcamento_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitacoes_orcamento_subcategoria_id_fkey"
            columns: ["subcategoria_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_prestador: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      block_reason:
        | "ma_qualidade"
        | "nao_compareceu"
        | "comportamento_inadequado"
        | "outros"
      block_status: "pendente" | "analisado" | "procedente" | "improcedente"
      contact_status: "novo" | "em_atendimento" | "resolvido" | "fechado"
      contact_type: "contato" | "suporte" | "comercial" | "outros"
      document_type: "cnpj" | "alvara" | "certidao" | "outros"
      notification_type:
        | "lead"
        | "proposta"
        | "avaliacao"
        | "pagamento"
        | "sistema"
      person_type: "fisica" | "juridica"
      privacy_level: "publico" | "semi_privado" | "privado"
      proposal_status: "enviada" | "aceita" | "rejeitada" | "expirada"
      quality_seal: "nenhum" | "verificado" | "premium" | "ouro"
      request_status: "ativa" | "em_andamento" | "finalizada" | "cancelada"
      status_solicitacao: "pendente" | "aceita" | "rejeitada" | "finalizada"
      subscription_status: "ativo" | "cancelado" | "vencido" | "pendente"
      tipo_plano: "free" | "profissional" | "empresa" | "premium"
      tipo_usuario: "cliente" | "prestador"
      urgency_level: "baixa" | "media" | "alta"
      user_type: "cliente" | "prestador"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      block_reason: [
        "ma_qualidade",
        "nao_compareceu",
        "comportamento_inadequado",
        "outros",
      ],
      block_status: ["pendente", "analisado", "procedente", "improcedente"],
      contact_status: ["novo", "em_atendimento", "resolvido", "fechado"],
      contact_type: ["contato", "suporte", "comercial", "outros"],
      document_type: ["cnpj", "alvara", "certidao", "outros"],
      notification_type: [
        "lead",
        "proposta",
        "avaliacao",
        "pagamento",
        "sistema",
      ],
      person_type: ["fisica", "juridica"],
      privacy_level: ["publico", "semi_privado", "privado"],
      proposal_status: ["enviada", "aceita", "rejeitada", "expirada"],
      quality_seal: ["nenhum", "verificado", "premium", "ouro"],
      request_status: ["ativa", "em_andamento", "finalizada", "cancelada"],
      status_solicitacao: ["pendente", "aceita", "rejeitada", "finalizada"],
      subscription_status: ["ativo", "cancelado", "vencido", "pendente"],
      tipo_plano: ["free", "profissional", "empresa", "premium"],
      tipo_usuario: ["cliente", "prestador"],
      urgency_level: ["baixa", "media", "alta"],
      user_type: ["cliente", "prestador"],
    },
  },
} as const
