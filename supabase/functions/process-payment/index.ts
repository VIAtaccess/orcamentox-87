import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const asaasToken = Deno.env.get('ASAAS_API_KEY');
    if (!asaasToken) {
      throw new Error('ASAAS_API_KEY não configurada');
    }

    const isProductionToken = asaasToken.includes('prod');
    const apiBaseUrl = isProductionToken 
      ? 'https://api.asaas.com/v3'
      : 'https://api-sandbox.asaas.com/v3';

    const { 
      paymentType, 
      planData, 
      customerData, 
      cardData,
      clientIp 
    } = await req.json();

    console.log('Iniciando processamento de pagamento:', { paymentType, planData });
    
    // Validar CPF
    const cleanCpf = customerData.cpf.replace(/\D/g, '');
    console.log('CPF recebido:', { original: customerData.cpf, limpo: cleanCpf, tamanho: cleanCpf.length });
    
    if (cleanCpf.length !== 11) {
      throw new Error('CPF deve conter 11 dígitos');
    }

    // 1. PRIMEIRO: Verificar se cliente já existe no Asaas
    let customerId = null;
    
    console.log('Buscando cliente no Asaas por CPF:', cleanCpf);
    const searchResponse = await fetch(
      `${apiBaseUrl}/customers?cpfCnpj=${cleanCpf}`,
      {
        headers: {
          'access_token': asaasToken,
          'accept': 'application/json',
          'content-type': 'application/json',
          'User-Agent': 'LovableApp/1.0'
        }
      }
    );

    if (!searchResponse.ok) {
      console.error('Erro ao buscar cliente:', await searchResponse.text());
      throw new Error('Erro ao buscar cliente no Asaas');
    }

    const searchResult = await searchResponse.json();
    console.log('Resultado da busca:', { totalCount: searchResult.totalCount, hasData: !!searchResult.data });
    
    if (searchResult.data && searchResult.data.length > 0) {
      // Cliente encontrado - usar o customer existente
      customerId = searchResult.data[0].id;
      console.log('✓ Cliente já existe no Asaas. Customer ID:', customerId);
    } else {
      // Cliente não existe - criar novo
      console.log('Cliente não encontrado. Criando novo cliente...');
      
      const customerPayload = {
        name: customerData.nome.toUpperCase(),
        email: customerData.email.toLowerCase(),
        cpfCnpj: cleanCpf,
        mobilePhone: customerData.telefone?.replace(/\D/g, '') || '',
        notificationDisabled: true
      };

      console.log('Payload de criação:', { ...customerPayload, cpfCnpj: '***.' + cleanCpf.slice(-2) });

      const createCustomerResponse = await fetch(`${apiBaseUrl}/customers`, {
        method: 'POST',
        headers: {
          'access_token': asaasToken,
          'accept': 'application/json',
          'content-type': 'application/json',
          'User-Agent': 'LovableApp/1.0'
        },
        body: JSON.stringify(customerPayload)
      });

      const createResult = await createCustomerResponse.json();
      
      if (!createCustomerResponse.ok) {
        console.error('Erro ao criar cliente:', createResult);
        throw new Error(createResult.errors?.[0]?.description || 'Erro ao criar cliente no Asaas');
      }

      customerId = createResult.id;
      console.log('✓ Novo cliente criado com sucesso. Customer ID:', customerId);
    }

    // 2. DEPOIS: Criar cobrança usando o customer ID obtido
    console.log('Criando cobrança para customer:', customerId);

    // 2. Criar cobrança
    let paymentData: any = {
      customer: customerId,
      billingType: paymentType === 'pix' ? 'PIX' : 'CREDIT_CARD',
      value: parseFloat(planData.valor),
      dueDate: new Date().toISOString().split('T')[0],
      description: `Assinatura ${planData.titulo}`,
      externalReference: `plano_${planData.id}`,
      remoteIp: clientIp || req.headers.get('x-forwarded-for') || '0.0.0.0'
    };

    // Adicionar dados do cartão se for pagamento com cartão
    if (paymentType === 'cartao' && cardData) {
      // Validações do cartão
      const cleanCardNumber = cardData.numero.replace(/\D/g, '');
      if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        throw new Error('Número do cartão inválido');
      }

      const cleanCvv = cardData.cvv.replace(/\D/g, '');
      if (cleanCvv.length < 3 || cleanCvv.length > 4) {
        throw new Error('CVV inválido');
      }

      const [expiryMonth, expiryYear] = cardData.validade.split('/');
      const cleanExpiryMonth = expiryMonth.padStart(2, '0');
      const fullYear = expiryYear.length === 2 ? `20${expiryYear}` : expiryYear;

      if (parseInt(cleanExpiryMonth) < 1 || parseInt(cleanExpiryMonth) > 12) {
        throw new Error('Mês de validade inválido');
      }

      if (parseInt(fullYear) < new Date().getFullYear()) {
        throw new Error('Cartão vencido');
      }

      paymentData.creditCard = {
        holderName: cardData.nome.toUpperCase(),
        number: cleanCardNumber,
        expiryMonth: cleanExpiryMonth,
        expiryYear: fullYear,
        ccv: cleanCvv
      };

      paymentData.creditCardHolderInfo = {
        name: cardData.nome.toUpperCase(),
        email: customerData.email.toLowerCase(),
        cpfCnpj: cleanCpf,
        postalCode: '00000000',
        addressNumber: '0',
        addressComplement: null,
        phone: customerData.telefone?.replace(/\D/g, '') || '0000000000',
        mobilePhone: customerData.telefone?.replace(/\D/g, '') || '0000000000'
      };
    }

    console.log('Criando cobrança:', { billingType: paymentData.billingType, value: paymentData.value });

    const paymentResponse = await fetch(`${apiBaseUrl}/payments`, {
      method: 'POST',
      headers: {
        'access_token': asaasToken,
        'accept': 'application/json',
        'content-type': 'application/json',
        'User-Agent': 'LovableApp/1.0'
      },
      body: JSON.stringify(paymentData)
    });

    const paymentResult = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error('Erro ao criar cobrança:', paymentResult);
      
      // Mapear erros específicos
      let errorDetails = 'Erro ao processar pagamento';
      const errorCode = paymentResult.errors?.[0]?.code;
      
      switch (errorCode) {
        case 'invalid_creditCard':
          errorDetails = isProductionToken 
            ? 'Transação não autorizada. Verifique se o cartão tem limite disponível'
            : 'Ambiente de desenvolvimento - Use cartões de teste válidos';
          break;
        case 'insufficient_funds':
          errorDetails = 'Limite insuficiente no cartão';
          break;
        case 'card_expired':
          errorDetails = 'Cartão vencido';
          break;
        case 'invalid_card_number':
          errorDetails = 'Número do cartão inválido';
          break;
        default:
          errorDetails = paymentResult.errors?.[0]?.description || errorDetails;
      }
      
      throw new Error(errorDetails);
    }

    console.log('✓ Cobrança criada com sucesso:', { 
      paymentId: paymentResult.id, 
      status: paymentResult.status,
      billingType: paymentResult.billingType 
    });

    // 3. CRIAR ASSINATURA apenas se pagamento for confirmado
    let subscriptionId = null;
    
    if (paymentType === 'cartao') {
      const approved = paymentResult.status === 'CONFIRMED' || paymentResult.status === 'RECEIVED';
      
      if (approved) {
        console.log('Pagamento com cartão confirmado. Criando assinatura...');
        
        try {
          const subscriptionData = {
            customer: customerId,
            billingType: 'CREDIT_CARD',
            value: parseFloat(planData.valor),
            nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 dias
            cycle: 'MONTHLY',
            description: `Assinatura ${planData.titulo}`,
            externalReference: `assinatura_plano_${planData.id}`
          };

          const subscriptionResponse = await fetch(`${apiBaseUrl}/subscriptions`, {
            method: 'POST',
            headers: {
              'access_token': asaasToken,
              'accept': 'application/json',
              'content-type': 'application/json',
              'User-Agent': 'LovableApp/1.0'
            },
            body: JSON.stringify(subscriptionData)
          });

          const subscriptionResult = await subscriptionResponse.json();

          if (subscriptionResponse.ok) {
            subscriptionId = subscriptionResult.id;
            console.log('✓ Assinatura criada com sucesso:', subscriptionId);
          } else {
            console.error('Erro ao criar assinatura:', subscriptionResult);
            // Não vou lançar erro aqui pois o pagamento já foi aprovado
            console.warn('Pagamento aprovado mas assinatura falhou. Revisar manualmente.');
          }
        } catch (subError) {
          console.error('Erro ao criar assinatura:', subError);
          // Não vou lançar erro pois o pagamento já foi aprovado
        }
      } else {
        console.log('Pagamento com cartão não foi confirmado imediatamente. Status:', paymentResult.status);
      }
    } else {
      console.log('Pagamento PIX criado. Assinatura será criada após confirmação do pagamento via webhook.');
    }

    // Preparar resposta
    const responseData: any = {
      success: true,
      paymentId: paymentResult.id,
      status: paymentResult.status,
      value: paymentResult.value,
      subscriptionId: subscriptionId
    };

    // Dados específicos para PIX
    if (paymentType === 'pix') {
      responseData.pixQrCode = paymentResult.encodedImage;
      responseData.pixCopyPaste = paymentResult.payload;
      responseData.pixExpirationDate = paymentResult.expirationDate;
    }

    // Dados específicos para cartão
    if (paymentType === 'cartao') {
      const approved = paymentResult.status === 'CONFIRMED' || paymentResult.status === 'RECEIVED';
      responseData.approved = approved;
      responseData.transactionReceiptUrl = paymentResult.transactionReceiptUrl;
      
      if (approved && subscriptionId) {
        responseData.message = 'Pagamento aprovado e assinatura ativada com sucesso!';
      } else if (approved) {
        responseData.message = 'Pagamento aprovado! A assinatura será ativada em breve.';
      }
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro no processo de pagamento:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro ao processar pagamento' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
