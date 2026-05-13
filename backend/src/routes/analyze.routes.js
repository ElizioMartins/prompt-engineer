import express from 'express';

const router = express.Router();

/**
 * POST /api/analyze
 * Analisa um prompt usando OpenRouter com fallback automático
 * 
 * Body:
 * {
 *   "prompt": { ... 9 campos do prompt ... },
 *   "models": ["model1", "model2", "model3"],
 *   "apiKey": "sk-or-v1-..."
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { prompt, models, apiKey } = req.body;

    // Validações
    if (!apiKey) {
      return res.status(400).json({ 
        erro: 'API Key do OpenRouter é obrigatória',
        dica: 'Configure sua chave em https://openrouter.ai/keys'
      });
    }

    if (!models || !Array.isArray(models) || models.length === 0) {
      return res.status(400).json({ 
        erro: 'Array de modelos é obrigatório',
        exemplo: ['google/gemma-4-26b-a4b-it:free', 'minimax/minimax-m2.5:free']
      });
    }

    if (!prompt || typeof prompt !== 'object') {
      return res.status(400).json({ 
        erro: 'Prompt inválido',
        esperado: 'Objeto com os 9 campos dos pilares'
      });
    }

    // Tentar análise com fallback automático
    const result = await analyzeWithFallback(prompt, models, apiKey);
    
    res.json(result);

  } catch (error) {
    console.error('Erro na análise:', error);
    res.status(500).json({ 
      erro: error.message || 'Erro ao analisar prompt',
      detalhes: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Fallback automático: tenta modelo 1 → 2 → 3 até sucesso
 */
async function analyzeWithFallback(prompt, models, apiKey) {
  const results = [];
  let lastError = null;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    
    try {
      console.log(`[${i + 1}/${models.length}] Tentando modelo: ${model}`);
      
      const analysis = await callOpenRouter(model, prompt, apiKey);
      
      // Sucesso! Retorna imediatamente
      return {
        success: true,
        model: model,
        attemptNumber: i + 1,
        totalAttempts: i + 1,
        timestamp: new Date().toISOString(),
        analysis: analysis
      };
      
    } catch (error) {
      console.error(`[${i + 1}/${models.length}] Modelo ${model} falhou:`, error.message);
      lastError = error;
      
      results.push({
        model: model,
        attemptNumber: i + 1,
        failed: true,
        error: error.message
      });
      
      // Se é o último modelo, lança erro
      if (i === models.length - 1) {
        throw new Error(`Todos os ${models.length} modelos falharam. Último erro: ${error.message}`);
      }
      
      // Senão, continua para o próximo
      console.log(`[${i + 1}/${models.length}] Tentando próximo modelo...`);
    }
  }

  // Não deveria chegar aqui, mas por segurança
  throw lastError || new Error('Falha desconhecida no fallback');
}

/**
 * Chamada para a API OpenRouter
 */
async function callOpenRouter(model, prompt, apiKey) {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': appUrl,
      'X-Title': 'Prompt Engineer PoC',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: `Você é um especialista em engenharia de prompts para modelos de IA.

Analise o prompt fornecido e avalie três dimensões críticas:

1. **Clareza (0-10)**: Quão claro e específico é o prompt?
   - 0-3: Ambíguo, vago, confuso
   - 4-6: Razoável, mas com gaps
   - 7-9: Claro e bem definido
   - 10: Cristalino, sem ambiguidades

2. **Altitude (0-10)**: Nível adequado de abstração?
   - 0-3: Muito genérico ou muito detalhado
   - 4-6: Nível aceitável de abstração
   - 7-9: Altitude ideal para a tarefa
   - 10: Abstração perfeita

3. **Precisão (0-10)**: Regras e instruções são precisas?
   - 0-3: Instruções vagas ou contraditórias
   - 4-6: Instruções razoáveis
   - 7-9: Instruções precisas e consistentes
   - 10: Instruções impecáveis

Responda APENAS com JSON válido no formato:
{
  "clarity": X,
  "altitude": Y,
  "precision": Z,
  "feedback": "Análise detalhada com sugestões específicas de melhoria"
}

NÃO adicione texto antes ou depois do JSON.`
        },
        {
          role: 'user',
          content: `Analise este prompt:\n\n${JSON.stringify(prompt, null, 2)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || 
      `OpenRouter API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Resposta vazia do modelo');
  }

  // Parse JSON da resposta
  try {
    const analysis = JSON.parse(content.trim());
    
    // Validar estrutura
    if (typeof analysis.clarity !== 'number' || 
        typeof analysis.altitude !== 'number' || 
        typeof analysis.precision !== 'number') {
      throw new Error('Resposta do modelo não contém métricas válidas');
    }

    return {
      clarity: Math.min(10, Math.max(0, analysis.clarity)),
      altitude: Math.min(10, Math.max(0, analysis.altitude)),
      precision: Math.min(10, Math.max(0, analysis.precision)),
      feedback: analysis.feedback || 'Sem feedback adicional'
    };
    
  } catch (parseError) {
    console.error('Erro ao parsear resposta do modelo:', content);
    throw new Error(`Modelo retornou resposta inválida: ${parseError.message}`);
  }
}

export default router;
