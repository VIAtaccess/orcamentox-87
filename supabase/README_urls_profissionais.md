# Sistema de URLs para Profissionais

## Nova Estrutura de URLs

A partir de agora, os profissionais podem ser acessados através de URLs amigáveis no formato:

```
https://seudominio.com/cidade/categoria/id
```

### Exemplos:
- `https://seudominio.com/sao-paulo/eletricista/123e4567-e89b-12d3-a456-426614174000`
- `https://seudominio.com/rio-de-janeiro/encanador/987f6543-e21c-43d2-b789-123456789abc`

## Rotas Suportadas

O sistema suporta ambos os formatos de URL:

1. **Formato antigo (mantido para compatibilidade):**
   - `/prestador/:id`

2. **Novo formato (recomendado):**
   - `/:cidade/:categoria/:id`

## Implementação

### 1. Campos Adicionados na Tabela `profissionais`

Foram adicionados os seguintes campos para suportar a galeria de serviços:

```sql
-- Campos para imagens dos serviços
imagem_servico_1 text
imagem_servico_2 text  
imagem_servico_3 text
```

### 2. Bucket de Storage

Foi criado um bucket `servicos-imagens` para armazenar as imagens dos serviços dos profissionais com:

- Limite de 5MB por arquivo
- Suporte para JPEG, PNG, WEBP
- Acesso público para visualização
- Políticas de segurança configuradas

### 3. Alterações na Interface

#### Removido:
- Links diretos de contato (telefone, email)
- Seção de informações de contato

#### Adicionado:
- Galeria com 3 imagens dos serviços
- Call-to-action destacado para solicitar orçamento
- Texto incentivando o usuário a solicitar orçamento

## Como Gerar URLs Amigáveis

Para gerar as URLs no novo formato, use a função utilitária:

```javascript
import { gerarUrlProfissional } from '@/utils/urlUtils';

const prestador = {
  cidade: 'São Paulo',
  categoria_slug: 'eletricista', 
  id: '123e4567-e89b-12d3-a456-426614174000'
};

const url = gerarUrlProfissional(prestador);
// Resultado: /sao-paulo/eletricista/123e4567-e89b-12d3-a456-426614174000
```

### Exemplo de uso em componente:

```jsx
import { Link } from 'react-router-dom';
import { gerarUrlProfissional } from '@/utils/urlUtils';

const PrestadorCard = ({ prestador }) => (
  <Link to={gerarUrlProfissional(prestador)}>
    Ver perfil do {prestador.nome}
  </Link>
);
```

## SEO Benefits

O novo formato de URL oferece melhor SEO:

- URLs mais descritivas e amigáveis
- Melhor indexação por motores de busca
- URLs que fazem sentido para o usuário
- Estrutura hierárquica clara (cidade > categoria > profissional)