import { useState, useCallback } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, buildEnrichedSystemPrompt } from '../data/aiPrompt';

export function useClaudeAPI(apiKey, posts) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamText, setStreamText] = useState('');

  // Holds message history for correction flow
  const [messages, setMessages] = useState([]);

  const client = apiKey
    ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
    : null;

  const generate = useCallback(async (userPrompt) => {
    if (!client) { setError('Chave de API não configurada. Acesse Config → IA.'); return null; }
    setLoading(true);
    setError(null);
    setStreamText('');

    const newMessages = [{ role: 'user', content: userPrompt }];
    setMessages(newMessages);

    // Use enriched system prompt with real performance data when available
    const systemPrompt = buildEnrichedSystemPrompt(posts);

    try {
      let fullText = '';
      const stream = await client.messages.stream({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: newMessages,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
          fullText += chunk.delta.text;
          setStreamText(fullText);
        }
      }

      const assistantMsg = { role: 'assistant', content: fullText };
      setMessages([...newMessages, assistantMsg]);
      setLoading(false);
      return fullText;
    } catch (err) {
      const msg = err?.message || 'Erro ao chamar a API';
      setError(msg.includes('401') ? 'Chave de API inválida. Verifique em Config → IA.' : msg);
      setLoading(false);
      return null;
    }
  }, [client]);

  const correct = useCallback(async (correctionPrompt) => {
    if (!client) { setError('Chave de API não configurada.'); return null; }
    if (messages.length === 0) { setError('Gere uma copy primeiro antes de corrigir.'); return null; }
    setLoading(true);
    setError(null);
    setStreamText('');

    const newMessages = [...messages, { role: 'user', content: correctionPrompt }];
    setMessages(newMessages);

    const systemPrompt = buildEnrichedSystemPrompt(posts);

    try {
      let fullText = '';
      const stream = await client.messages.stream({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: newMessages,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
          fullText += chunk.delta.text;
          setStreamText(fullText);
        }
      }

      const assistantMsg = { role: 'assistant', content: fullText };
      setMessages([...newMessages, assistantMsg]);
      setLoading(false);
      return fullText;
    } catch (err) {
      setError(err?.message || 'Erro ao corrigir');
      setLoading(false);
      return null;
    }
  }, [client, messages]);

  const reset = useCallback(() => {
    setMessages([]);
    setStreamText('');
    setError(null);
  }, []);

  return { generate, correct, reset, loading, error, streamText, hasHistory: messages.length > 0 };
}
