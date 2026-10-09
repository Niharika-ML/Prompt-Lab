import { PromptAnalysis, ImprovementResult, OutputExplanation, OutputType } from '../types';

export async function checkServerHealth(): Promise<{ status: string; hasKey: boolean; model: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'fallback', hasKey: false, model: 'local-heuristic' };
  }
}

export async function generateAiOutput(
  prompt: string,
  outputType: OutputType = 'text',
  systemInstruction?: string
): Promise<{
  outputType: OutputType;
  output?: string;
  imageUrl?: string;
  videoUrl?: string;
  isFallback?: boolean;
  note?: string;
  error?: string;
  message?: string;
  code?: number;
}> {
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, outputType, systemInstruction }),
    });

    const data = await res.json().catch(() => ({ error: 'Something went wrong', message: 'Please try again.' }));

    if (!res.ok) {
      const isLimit = res.status === 429 || data.code === 429 || /quota|limit|exhausted|resource_exhausted/i.test(data.error || data.message || data.detail || '');

      if (outputType === 'video' || data.code === 501 || (typeof data.error === 'string' && data.error.includes('Video'))) {
        return {
          outputType: 'video',
          error: data.error || 'Video Generation Unavailable',
          code: data.code || 501,
          message: data.message || 'The selected generation service is not currently configured or has reached its available usage limit.',
        };
      }

      if (outputType === 'image') {
        return {
          outputType: 'image',
          error: isLimit ? 'Generation Limit Reached' : (data.error || 'Image Generation Unavailable'),
          code: isLimit ? 429 : (data.code || 400),
          message: data.message || (isLimit
            ? 'The current generation service has reached its usage limit. Please try again later or use another available generation mode.'
            : 'The selected generation service is not currently configured or has reached its available usage limit.'),
        };
      }

      return {
        outputType,
        error: isLimit ? 'Generation Limit Reached' : (data.error || 'Something went wrong'),
        code: isLimit ? 429 : (data.code || 500),
        message: isLimit
          ? 'The current generation service has reached its usage limit. Please try again later or use another available generation mode.'
          : (data.message || 'Please try again.'),
      };
    }

    return data;
  } catch (err: any) {
    return {
      outputType,
      error: 'Something went wrong',
      message: 'Please try again.',
    };
  }
}

export async function explainAiOutput(
  prompt: string,
  output: string,
  outputType: OutputType = 'text'
): Promise<OutputExplanation> {
  const res = await fetch('/api/explain-output', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, output, outputType }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Failed to explain output' }));
    throw new Error(errData.error || 'Server error explaining output');
  }

  return await res.json();
}

export async function analyzePrompt(
  prompt: string,
  challenge?: any,
  beginnerMode = true,
  level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
): Promise<PromptAnalysis> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, challenge, beginnerMode, level }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Failed to analyze prompt' }));
    throw new Error(errData.error || 'Server error analyzing prompt');
  }

  return await res.json();
}

export async function improvePrompt(
  prompt: string,
  challenge?: any,
  beginnerMode = true,
  level: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  outputType: OutputType = 'text'
): Promise<ImprovementResult> {
  const res = await fetch('/api/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, challenge, beginnerMode, level, outputType }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'Failed to improve prompt' }));
    throw new Error(errData.error || 'Server error improving prompt');
  }

  return await res.json();
}

export async function fetchPromptSuggestions(prompt: string): Promise<string[]> {
  try {
    const res = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.suggestions || [];
  } catch {
    return [];
  }
}
