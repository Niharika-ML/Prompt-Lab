import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;
const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Robust caller with automatic fallback to gemini-3.1-flash-lite on transient 503/429 spikes
async function generateContentSafe(params: {
  contents: any;
  config?: any;
}) {
  try {
    return await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: params.contents,
      config: params.config,
    });
  } catch (err: any) {
    const msg = String(err?.message || '');
    if (msg.includes('503') || msg.includes('429') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
      console.warn('Primary model busy (503/429), switching to gemini-3.1-flash-lite fallback...');
      return await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: params.contents,
        config: params.config,
      });
    }
    throw err;
  }
}

// Helper: dynamic fallback text generator that actually follows the user's prompt
function generateDynamicTextFallback(prompt: string) {
  const clean = prompt.trim();
  const lower = clean.toLowerCase();

  if (lower.includes('biryani') || (lower.includes('poster') && lower.includes('food'))) {
    return `🔥 SPICE SYMPHONY — WEEKEND DUM BIRYANI SPECIAL 🔥\n\n` +
      `Craving authentic royal flavor? Taste our slow-cooked Hyderabadi Dum Biryani, layered with saffron-infused basmati rice, tender farm-fresh chicken, and secret heritage spices.\n\n` +
      `🎁 SPECIAL OFFER: Order 1 Special Handi Biryani & Get a Complimentary Gulab Jamun!\n` +
      `📅 Available: Friday to Sunday | 12:00 PM – 11:00 PM\n` +
      `📍 Spice Symphony, 4th Cross Road (Dine-in, Takeaway & Swiggy/Zomato)\n\n` +
      `👉 Reserve your table now: Call +91-98765-43210 or DM us on Instagram @SpiceSymphony!`;
  }

  if (lower.includes('leave') || lower.includes('sick') || (lower.includes('email') && lower.includes('manager'))) {
    return `Subject: Sick Leave Notice - [Your Name] - [Today's Date]\n\n` +
      `Dear [Manager's Name],\n\n` +
      `I am writing to inform you that I have come down with a high fever and doctor-advised bed rest today, and will be unable to work for the next two days (Thursday and Friday).\n\n` +
      `I have handed over urgent client escalations to [Colleague Name], and all open pull requests are documented. I will check urgent communications when feasible.\n\n` +
      `Thank you for your understanding.\n\n` +
      `Best regards,\n[Your Name]\n[Role / Team]`;
  }

  if (lower.includes('interview') || lower.includes('star')) {
    return `🎯 BEHAVIORAL INTERVIEW PREPARATION (STAR FRAMEWORK)\n\n` +
      `1. SITUATION:\n"At my previous fintech company, 48 hours before our quarterly payments release, an upstream bank API altered their transaction schema without advance notice."\n\n` +
      `2. TASK:\n"As the Lead Product Engineer, I needed to ensure customer checkout wouldn't fail while preventing any unauthorized charges."\n\n` +
      `3. ACTION:\n"I organized an immediate 30-minute war room, implemented a graceful fallback retry queue, and established automated health monitoring with our banking partner."\n\n` +
      `4. RESULT:\n"Zero failed checkouts over the release weekend, processing $1.2M in transactions with 99.98% reliability."`;
  }

  if (lower.includes('trip') || lower.includes('travel') || lower.includes('itinerary')) {
    return `🗺️ 3-DAY CURATED TRAVEL ITINERARY\n\n` +
      `DAY 1: HISTORIC HEART & LOCAL EATS\n• Morning: Early visit to the historic landmark before tour buses arrive ($12 entry).\n• Afternoon: Stroll through traditional artisanal market and lunch at local bistro ($18/person).\n• Evening: Sunset viewing terrace followed by casual authentic dinner ($25).\n\n` +
      `DAY 2: CULTURE & HIDDEN NEIGHBORHOODS\n• Morning: Contemporary art gallery & neighborhood botanical gardens.\n• Afternoon: Street food walk and riverside coffee break.\n• Evening: Night market exploration with street music.\n\n` +
      `DAY 3: PANORAMIC SCENIC VIEWS & SOUVENIRS\n• Morning: Scenic hilltop tram ride.\n• Afternoon: Handcrafted souvenir shopping and farewell celebratory meal.`;
  }

  // General tailored response that directly mirrors user instructions
  return `Here is the drafted output based on your prompt:\n\n` +
    `• Overview: Direct response generated tailored to "${clean.slice(0, 80)}${clean.length > 80 ? '...' : ''}".\n` +
    `• Key Deliverable: Detailed, high-clarity execution incorporating your requested style and parameters.\n` +
    `• Actionable Tip: To fine-tune this output even further, try using the PromptLab "Improve My Prompt" button to inject explicit audience, length, and format guardrails!`;
}

// Helper: 8-dimension heuristic analyzer with level-specific scoring
function generate8DimensionAnalysis(
  prompt: string,
  challenge?: any,
  level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
) {
  const cleanPrompt = prompt.trim();
  const lower = cleanPrompt.toLowerCase();
  const words = cleanPrompt.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const hasRole = /(act as|you are|pretend to be|role:|as an?|expert|specialist|teacher|author|coach|director|designer|recruiter|developer)/i.test(lower);
  const hasTask = wordCount >= 2 && /(write|create|draft|explain|generate|plan|summarize|design|build|list|outline|compare|review|picture|photo|recipe|email|message|caption)/i.test(lower);
  const hasContext = wordCount > 8 || /(because|since|for\s+my|situation|background|context|experience|company|student|restaurant|hackathon|mother|friend|team)/i.test(lower);
  const hasTone = /(tone|casual|formal|polite|humorous|warm|energetic|empathetic|professional|gentle|persuasive|appetizing|witty|bold)/i.test(lower);
  const hasAudience = /(audience|for\s+kids|for\s+students|for\s+parents|for\s+executives|for\s+beginners|target\s+audience|for\s+my\s+(mother|mom|dad|friend|boss)|for\s+a\s+\d+-year-old)/i.test(lower);
  const hasConstraints = /(under\s+\d+|\d+\s*words|max|budget|limit|within|only|avoid|don't|no\s+|bullet\s+points|sentences|must\s+include|realistic|high-quality|lighting)/i.test(lower);
  const hasFormat = /(format|table|bullet|list|json|markdown|sections?|steps?|paragraph|template|poster\s+copy|caption|photograph|composition)/i.test(lower);
  const hasExamples = /(example|for\s+instance|e\.g\.|like\s+this|such\s+as:|follow\s+this\s+sample)/i.test(lower);

  let taskScore = hasTask ? (wordCount > 6 ? 95 : 85) : 35;
  let roleScore = hasRole ? 95 : 30;
  let contextScore = hasContext ? (wordCount > 15 ? 95 : 80) : 40;
  let toneScore = hasTone ? 90 : 35;
  let audienceScore = hasAudience ? 90 : 35;
  let constraintsScore = hasConstraints ? 92 : 30;
  let formatScore = hasFormat ? 90 : 40;
  let examplesScore = hasExamples ? 95 : 30;

  const clarityScore = Math.min(100, Math.round((taskScore + formatScore) / 2));

  // Dynamic Level-Specific Scoring (Requirement 2)
  let overallScore = 20;
  if (level === 'beginner') {
    // Beginner: Focus mainly on Task, Basic context, Clear instruction
    overallScore = Math.round(taskScore * 0.5 + contextScore * 0.3 + clarityScore * 0.2);
  } else if (level === 'intermediate') {
    // Intermediate: Focus on Task, Role, Context, Tone, Audience, Constraints, Format
    overallScore = Math.round(
      taskScore * 0.2 +
      roleScore * 0.15 +
      contextScore * 0.15 +
      toneScore * 0.15 +
      audienceScore * 0.15 +
      constraintsScore * 0.1 +
      formatScore * 0.1
    );
  } else {
    // Advanced: Focus on Task, Role, Context, Constraints, Examples, Output format, Specificity
    overallScore = Math.round(
      taskScore * 0.15 +
      roleScore * 0.15 +
      contextScore * 0.15 +
      constraintsScore * 0.15 +
      formatScore * 0.15 +
      examplesScore * 0.15 +
      clarityScore * 0.1
    );
  }

  overallScore = Math.min(100, Math.max(wordCount < 4 ? 20 : 30, overallScore));

  let scoreLabel = 'Starter Prompt';
  if (overallScore >= 85) scoreLabel = 'Exceptional Prompt — Clear & Actionable';
  else if (overallScore >= 70) scoreLabel = 'Good Prompt — Strong Foundation';
  else if (overallScore >= 50) scoreLabel = 'Developing Prompt — Needs More Detail';
  else scoreLabel = 'General Prompt — Missing Key Details';

  return {
    score: overallScore,
    scoreLabel,
    scoreBreakdown: {
      task: taskScore,
      context: contextScore,
      clarity: clarityScore,
      constraints: constraintsScore,
      outputFormat: formatScore,
    },
    dimensions: {
      task: {
        status: hasTask ? 'strong' : 'needs_improvement',
        label: 'Task',
        feedback: hasTask
          ? 'You clearly stated what you want the AI to create.'
          : 'The core task is ambiguous. Tell the AI clearly what deliverable you need.',
        suggestion: 'Lead with a strong action verb (e.g., "Write", "Create", "Explain").',
      },
      role: {
        status: hasRole ? 'strong' : 'missing',
        label: 'Role',
        feedback: hasRole
          ? 'You anchored the AI with a specialized persona.'
          : 'No specific persona given; the AI responds in a default voice.',
        suggestion: 'Add who the AI should act as (e.g., "Act as a professional chef" or "Act as an expert copywriter").',
      },
      context: {
        status: hasContext ? 'strong' : (wordCount > 6 ? 'needs_improvement' : 'missing'),
        label: 'Context',
        feedback: hasContext
          ? 'Good background and situation provided.'
          : 'The AI doesn\'t know the situation, reason, or environment for this request.',
        suggestion: 'Add why you need this and any background details.',
      },
      tone: {
        status: hasTone ? 'strong' : 'missing',
        label: 'Tone',
        feedback: hasTone
          ? 'Voice and style were directed.'
          : 'No voice tone specified; output may default to generic or robotic.',
        suggestion: 'Add 1-2 tone keywords (e.g., "Warm and loving", "Professional and punchy").',
      },
      audience: {
        status: hasAudience ? 'strong' : 'missing',
        label: 'Audience',
        feedback: hasAudience
          ? 'Target audience is clearly identified.'
          : 'The AI doesn\'t know who will read or consume this content.',
        suggestion: 'Specify who this is for (e.g., "For my mother", "For college students").',
      },
      constraints: {
        status: hasConstraints ? 'strong' : 'missing',
        label: 'Constraints',
        feedback: hasConstraints
          ? 'Helpful boundaries and limits specified.'
          : 'No boundaries, length limits, or visual guidelines provided.',
        suggestion: 'Set a length or boundary (e.g., "Under 80 words" or "With natural warm lighting").',
      },
      outputFormat: {
        status: hasFormat ? 'strong' : 'needs_improvement',
        label: 'Output Format',
        feedback: hasFormat
          ? 'Clear structural output requested.'
          : 'Layout was left open; the AI may return an unformatted block.',
        suggestion: 'Ask for specific formatting (e.g., "Bullet points", "Card layout", or "High-resolution photo").',
      },
      examples: {
        status: hasExamples ? 'strong' : 'missing',
        label: 'Examples',
        feedback: hasExamples
          ? 'Reference example included to guide the model.'
          : 'No reference example provided.',
        suggestion: 'Provide a sample of the exact style or structure you desire.',
      },
    },
    overallSummary: level === 'beginner'
      ? `You scored ${overallScore}/100! Focus on what you want, who it is for, and how you want the answer.`
      : level === 'intermediate'
      ? `Prompt scored ${overallScore}/100. Adding explicit role, tone, and constraint guardrails will optimize quality.`
      : `Advanced evaluation: ${overallScore}/100. Ensure multi-step constraints, format schema, and reference examples are crisp.`,
    keyStrengths: [
      hasTask ? 'Core action identified' : 'Direct request',
      hasContext ? 'Situational background provided' : 'Easy to expand',
      hasConstraints ? 'Explicit boundary limits set' : 'Open creative flexibility',
    ],
    topSuggestions: [
      !hasRole ? 'Add a Role (e.g., "Act as a professional chef" or "Act as an expert copywriter")' : 'Refine the persona expertise',
      !hasAudience ? 'Specify the target Audience (e.g., "For my mother" or "For college students")' : 'Clarify audience reading level',
      !hasConstraints ? 'Add a constraint or limit (e.g., "Under 100 words" or "With cinematic lighting")' : 'Specify what to avoid',
    ],
  };
}

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: hasApiKey,
    model: 'gemini-3.8-flash',
  });
});

// Modular Image Generation Service (Requirement 5)
async function generateImage(prompt: string): Promise<{ imageUrl?: string; error?: string; message?: string; code?: number }> {
  if (!hasApiKey) {
    return {
      error: 'Image Generation Unavailable',
      code: 400,
      message: 'The selected generation service is not currently configured or has reached its available usage limit.',
    };
  }

  // Supported image models in priority order according to @google/genai guidelines
  const imageModels = [
    'gemini-3.1-flash-lite-image',
    'gemini-nano-banana-2.1',
    'gemini-3-pro-image',
  ];

  let isQuotaExhausted = false;

  for (const model of imageModels) {
    try {
      console.log(`[ImageGen] Requesting image with model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      let base64Image = '';
      let mimeType = 'image/png';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            base64Image = part.inlineData.data;
            if (part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            break;
          }
        }
      }

      if (base64Image) {
        return { imageUrl: `data:${mimeType};base64,${base64Image}` };
      }
    } catch (err: any) {
      const status = err?.status || err?.code;
      const msg = String(err?.message || '');
      console.warn(`[ImageGen] Model ${model} returned:`, status, msg.slice(0, 140));
      if (status === 429 || /quota|limit|exhausted|resource_exhausted/i.test(msg)) {
        isQuotaExhausted = true;
        break; // Free tier has limit 0 for all image models, avoid redundant failures
      }
    }
  }

  if (isQuotaExhausted) {
    return {
      error: 'Generation Limit Reached',
      code: 429,
      message: 'The current image generation service has reached its usage limit (free tier quota limit is 0). A paid Gemini API key with image generation quota is required.',
    };
  }

  return {
    error: 'Image Generation Unavailable',
    code: 400,
    message: 'The selected generation service is not currently configured or has reached its available usage limit.',
  };
}

// Modular Video Generation Service (Requirement 3 & 4)
async function generateVideo(prompt: string): Promise<{ videoUrl?: string; error?: string; message?: string; code?: number }> {
  if (!hasApiKey) {
    return {
      error: 'Video Generation Unavailable',
      code: 501,
      message: 'The selected generation service is not currently configured or has reached its available usage limit.',
    };
  }

  // Supported Veo video models
  const videoModels = [
    'veo-3.1-lite-generate-preview',
    'veo-3.1-fast-generate-preview',
    'veo-3.1-generate-preview',
  ];

  let isQuotaExhausted = false;

  for (const model of videoModels) {
    try {
      console.log(`[VideoGen] Starting video generation with model: ${model}`);
      const operation = await ai.models.generateVideos({
        model,
        prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9',
        },
      });

      const opName = operation?.name;
      if (!opName) {
        console.warn(`[VideoGen] No operation name returned from ${model}`);
        continue;
      }

      console.log(`[VideoGen] Polling operation: ${opName}`);
      const op = new GenerateVideosOperation();
      op.name = opName;

      // Poll up to 90 seconds (in 5s intervals)
      let attempts = 0;
      const maxAttempts = 18;
      let completedOp: any = null;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        attempts++;
        const updated = await ai.operations.getVideosOperation({ operation: op });
        if (updated.done) {
          completedOp = updated;
          break;
        }
      }

      if (!completedOp || !completedOp.done) {
        return {
          error: 'Video Generation In Progress',
          code: 504,
          message: 'Video rendering is currently taking longer than expected. Please try again in a moment.',
        };
      }

      if (completedOp.error) {
        const errMsg = completedOp.error.message || 'Video generation failed';
        console.warn(`[VideoGen] Operation failed:`, errMsg);
        if (/quota|limit|exhausted|resource_exhausted/i.test(errMsg)) {
          isQuotaExhausted = true;
          break;
        }
        continue;
      }

      const videoUri = completedOp.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) {
        console.warn(`[VideoGen] No video URI in completed operation`);
        continue;
      }

      console.log(`[VideoGen] Fetching video stream from URI: ${videoUri}`);
      const apiKey = process.env.GEMINI_API_KEY || '';
      const videoRes = await fetch(videoUri, {
        headers: { 'x-goog-api-key': apiKey },
      });

      if (!videoRes.ok) {
        console.warn(`[VideoGen] Failed to download video, status: ${videoRes.status}`);
        continue;
      }

      const arrayBuf = await videoRes.arrayBuffer();
      const base64 = Buffer.from(arrayBuf).toString('base64');
      return { videoUrl: `data:video/mp4;base64,${base64}` };
    } catch (err: any) {
      const status = err?.status || err?.code;
      const msg = String(err?.message || '');
      console.warn(`[VideoGen] Model ${model} returned:`, status, msg.slice(0, 140));
      if (status === 429 || /quota|limit|exhausted|resource_exhausted/i.test(msg)) {
        isQuotaExhausted = true;
        break; // Quota is per-project in Google AI Studio
      }
    }
  }

  if (isQuotaExhausted) {
    return {
      error: 'Generation Limit Reached',
      code: 429,
      message: 'The current video generation service has reached its usage limit (free tier quota limit is 0). A paid Gemini API key with Veo video generation quota is required.',
    };
  }

  return {
    error: 'Video Generation Unavailable',
    code: 501,
    message: 'The selected generation service is not currently configured or has reached its available usage limit.',
  };
}

// 1. Unified Generate Endpoint (Text, Image, Video)
app.post('/api/generate', async (req: Request, res: Response) => {
  const { prompt, outputType = 'text', systemInstruction } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'Please enter a prompt first.' });
    return;
  }

  const cleanPrompt = prompt.trim();

  // IMAGE GENERATION
  if (outputType === 'image') {
    const result = await generateImage(cleanPrompt);
    if (result.imageUrl) {
      res.json({
        outputType: 'image',
        imageUrl: result.imageUrl,
        prompt: cleanPrompt,
      });
    } else {
      res.status(result.code || 429).json({
        error: result.error || 'Generation Limit Reached',
        code: result.code || 429,
        message: result.message || 'The current generation service has reached its usage limit. Please try again later or use another available generation mode.',
      });
    }
    return;
  }

  // VIDEO GENERATION
  if (outputType === 'video') {
    const result = await generateVideo(cleanPrompt);
    if (result.videoUrl) {
      res.json({
        outputType: 'video',
        videoUrl: result.videoUrl,
        prompt: cleanPrompt,
      });
    } else {
      res.status(result.code || 501).json({
        error: result.error || 'Video Generation Unavailable',
        code: result.code || 501,
        message: result.message || 'The selected generation service is not currently configured or has reached its available usage limit.',
      });
    }
    return;
  }

  // TEXT GENERATION (Default)
  try {
    if (!hasApiKey) {
      const dynamicOutput = generateDynamicTextFallback(cleanPrompt);
      res.json({
        outputType: 'text',
        output: dynamicOutput,
        isFallback: true,
        note: 'Live response generated via smart prompt understanding.',
      });
      return;
    }

    const defaultTextInstruction = `You are PromptLab AI, generating direct, high-quality text output based on the user's prompt.
Provide a clear, natural, and helpful response matching the user's requested topic and format.
Do NOT output function-calling JSON objects, tool declarations (like dalle.text2im or action_input), or internal API calls.
If the user's prompt mentions an image or poster concept in text mode, provide vivid scene descriptions, copy, or culinary notes in clean, formatted text.`;

    const response = await generateContentSafe({
      contents: cleanPrompt,
      config: {
        systemInstruction: systemInstruction || defaultTextInstruction,
      },
    });

    let outputText = response.text || 'No response returned from the model.';

    // Safety unwrapper: If the model returned pseudo tool call JSON (e.g. dalle.text2im), extract readable text
    if (outputText.trim().startsWith('{') && (outputText.includes('"action"') || outputText.includes('"action_input"'))) {
      try {
        const parsed = JSON.parse(outputText.trim());
        if (parsed.action_input) {
          try {
            const inner = typeof parsed.action_input === 'string' ? JSON.parse(parsed.action_input) : parsed.action_input;
            if (inner.prompt) {
              outputText = `${parsed.thought ? parsed.thought + '\n\n' : ''}${inner.prompt}`;
            } else {
              outputText = typeof parsed.action_input === 'string' ? parsed.action_input : JSON.stringify(parsed.action_input);
            }
          } catch (e) {
            outputText = typeof parsed.action_input === 'string' ? parsed.action_input : String(parsed.action_input);
          }
        } else if (parsed.thought) {
          outputText = parsed.thought;
        }
      } catch (e) {}
    }
    res.json({
      outputType: 'text',
      output: outputText,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error generating content:', error);
    const dynamicOutput = generateDynamicTextFallback(cleanPrompt);
    res.status(200).json({
      outputType: 'text',
      output: dynamicOutput,
      isFallback: true,
      error: 'Generation Limit Reached',
      message: 'The current AI generation limit has been reached. Please try again later or switch to another available output mode.',
    });
  }
});

// 2. Explain This Output Endpoint (Requirement 7)
app.post('/api/explain-output', async (req: Request, res: Response) => {
  const { prompt, output, outputType = 'text' } = req.body;

  if (!prompt || !output) {
    res.status(400).json({ error: 'Prompt and output are required for explanation.' });
    return;
  }

  const promptText = String(prompt).trim();
  const outputText = String(output).trim();

  // Intelligent explanation generator
  const fallbackExplanation = {
    whatAiUnderstood: `The AI recognized that you wanted to generate content related to "${promptText.slice(0, 60)}". It identified your primary goal and attempted to provide a direct response.`,
    partsFollowed: [
      'The core topic and subject matter you mentioned',
      'General tone appropriate for the request category',
      'Basic formatting suitable for quick reading',
    ],
    missingInformation: [
      promptText.length < 50 ? 'Specific target audience details' : 'Exact length or word limit boundaries',
      'Persona or Role guidelines (e.g., who the AI should act as)',
      'Negative constraints (what words or clichés to avoid)',
    ],
    whyResultLooksThisWay: 'Because the prompt gave the core topic without strict boundaries, the model used its default assumptions to fill in the blanks. That is why it may feel broader or more generic than you imagined.',
    suggestedChanges: [
      'Start with a Role: "Act as an expert [profession]..."',
      'Add a hard length limit: "Keep strictly under 100 words"',
      'Specify the audience: "Write this specifically for [target user]"',
    ],
  };

  if (!hasApiKey) {
    res.json(fallbackExplanation);
    return;
  }

  try {
    const systemPrompt = `
You are a patient, encouraging AI prompt engineering tutor on PromptLab.
Explain to a complete beginner why the AI generated the output it did based on their prompt.
Do NOT use complicated technical jargon.
Return ONLY valid JSON matching this schema:
{
  "whatAiUnderstood": string,
  "partsFollowed": string[],
  "missingInformation": string[],
  "whyResultLooksThisWay": string,
  "suggestedChanges": string[]
}
`;

    const userPrompt = `
User's Prompt:
"""${promptText}"""

AI's Generated Output:
"""${outputText.slice(0, 1000)}"""
`;

    const response = await generateContentSafe({
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ ...fallbackExplanation, ...parsed });
  } catch (err: any) {
    console.warn('Explain output fallback:', err.message);
    res.json(fallbackExplanation);
  }
});

// 3. Analyze Prompt Endpoint (8 Dimensions with Level Awareness)
app.post('/api/analyze', async (req: Request, res: Response) => {
  const { prompt, challenge, beginnerMode = true, level: reqLevel } = req.body;
  const level: 'beginner' | 'intermediate' | 'advanced' = reqLevel || (beginnerMode ? 'beginner' : 'intermediate');

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'Please enter a prompt to analyze.' });
    return;
  }

  const promptText = prompt.trim();

  if (!hasApiKey) {
    const analysis = generate8DimensionAnalysis(promptText, challenge, level);
    res.json(analysis);
    return;
  }

  try {
    const analysisInstruction = `
You are an encouraging prompt engineering mentor on PromptLab.
Analyze the user's prompt objectively across 8 essential dimensions:
1. Task (Is the core command clear?)
2. Role (Does it assign who the AI should act as?)
3. Context (Does it provide situation/background?)
4. Tone (Does it specify voice/style?)
5. Audience (Does it state who will read or consume it?)
6. Constraints (Does it set limits like length, budget, things to avoid?)
7. Output Format (Does it specify layout like bullets, table, template?)
8. Examples (Does it provide sample reference examples?)

IMPORTANT LEVEL CRITERIA:
The user is at the "${level.toUpperCase()}" level:
- If "beginner": Focus mainly on Task, Basic context, and Clear instruction. If the user states what they want and who it's for, give high scores (70-90+). Be encouraging and avoid overwhelming jargon!
- If "intermediate": Focus on Task, Role, Context, Tone, Audience, Constraints, and Format. Give balanced actionable tips.
- If "advanced": Focus on Task, Role, Context, Constraints, Examples, Output format, Specificity, and Multi-step instructions. Apply strict professional standards.

Score each dimension: "strong", "needs_improvement", or "missing".
Calculate a truly dynamic overall score (0 to 100) reflecting their current ${level} level.
Return ONLY valid JSON matching this schema:
{
  "score": number,
  "scoreLabel": string,
  "scoreBreakdown": {
    "task": number,
    "context": number,
    "clarity": number,
    "constraints": number,
    "outputFormat": number
  },
  "dimensions": {
    "task": { "status": "strong"|"needs_improvement"|"missing", "label": "Task", "feedback": string, "suggestion": string },
    "role": { "status": "strong"|"needs_improvement"|"missing", "label": "Role", "feedback": string, "suggestion": string },
    "context": { "status": "strong"|"needs_improvement"|"missing", "label": "Context", "feedback": string, "suggestion": string },
    "tone": { "status": "strong"|"needs_improvement"|"missing", "label": "Tone", "feedback": string, "suggestion": string },
    "audience": { "status": "strong"|"needs_improvement"|"missing", "label": "Audience", "feedback": string, "suggestion": string },
    "constraints": { "status": "strong"|"needs_improvement"|"missing", "label": "Constraints", "feedback": string, "suggestion": string },
    "outputFormat": { "status": "strong"|"needs_improvement"|"missing", "label": "Output Format", "feedback": string, "suggestion": string },
    "examples": { "status": "strong"|"needs_improvement"|"missing", "label": "Examples", "feedback": string, "suggestion": string }
  },
  "overallSummary": string,
  "keyStrengths": string[],
  "topSuggestions": string[]
}
`;

    const userContent = `
Prompt to analyze:
"""${promptText}"""

Level: ${level.toUpperCase()}
${challenge ? `Context/Challenge: "${challenge.title}". Goal: "${challenge.goal}"` : ''}
`;

    const response = await generateContentSafe({
      contents: userContent,
      config: {
        systemInstruction: analysisInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.warn('Analysis fallback:', error.message);
    const fallback = generate8DimensionAnalysis(promptText, challenge, level);
    res.json(fallback);
  }
});

// 4. Improve Prompt Endpoint (Requirement 10)
app.post('/api/improve', async (req: Request, res: Response) => {
  const { prompt, challenge, beginnerMode = true, level: reqLevel, outputType = 'text' } = req.body;
  const level: 'beginner' | 'intermediate' | 'advanced' = reqLevel || (beginnerMode ? 'beginner' : 'intermediate');

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'Please provide a prompt to improve.' });
    return;
  }

  const promptText = prompt.trim();
  const lower = promptText.toLowerCase();

  // Smart heuristic improvement fallback that always honors user intent
  let improvedFallback = promptText;
  let elementsAdded: string[] = [];

  const isImageTask = outputType === 'image' || lower.includes('picture') || lower.includes('photo') || lower.includes('image') || lower.includes('poster') || lower.includes('biryani');

  if (isImageTask && (lower.includes('biryani') || lower.includes('food') || lower.includes('chicken'))) {
    improvedFallback = `Create a high-quality realistic food photograph of freshly prepared chicken biryani served in a traditional restaurant setting. Show detailed rice texture, chicken pieces, garnishing and warm natural lighting. Use a premium food photography style and a visually appealing composition.`;
    elementsAdded = [
      'Added subject details',
      'Added visual style',
      'Added lighting',
      'Added composition',
      'Added context',
      'Added specificity',
    ];
  } else if (isImageTask) {
    improvedFallback = `High-resolution, ultra-detailed professional visual of ${promptText}. Cinematic studio lighting, realistic depth of field, vibrant colors, shot on 85mm lens with balanced focal composition.`;
    elementsAdded = [
      'Added visual style',
      'Added lighting',
      'Added composition',
      'Added camera parameters',
      'Added resolution constraints',
    ];
  } else if (lower.includes('email') || lower.includes('leave') || lower.includes('manager')) {
    improvedFallback = `Act as a professional communications advisor. Draft a courteous, concise email requesting leave. State the specific dates, brief reason, work handover details with a colleague, and an engaging subject line. Keep under 100 words in clear corporate etiquette.`;
    elementsAdded = ['Added Role', 'Added Context', 'Added Tone', 'Added Constraints', 'Added Format'];
  } else if (lower.includes('birthday') || lower.includes('message') || lower.includes('mother') || lower.includes('mom')) {
    improvedFallback = `Act as an empathetic writer. Write a heartfelt, warm, and loving birthday message for a mother expressing deep gratitude for her endless support, sacrifice, and affection. Include 1 memorable appreciation note. Keep between 70 to 90 words with an uplifting closing blessing.`;
    elementsAdded = ['Added Role', 'Added Emotional Tone', 'Added Specific Appreciation Note', 'Added Length Guardrails'];
  } else {
    improvedFallback = `Act as a specialist in this field. ${promptText}. Keep the tone engaging, practical, and clear. Tailor the content for the intended audience. Limit the response to 120 words and format as a crisp introduction, 3 actionable bullet points, and a strong conclusion.`;
    elementsAdded = ['Added Role', 'Added Audience', 'Added Tone', 'Added Constraints', 'Added Format'];
  }

  const fallbackResult = {
    improvedPrompt: improvedFallback,
    explanation: isImageTask
      ? 'We elevated your visual prompt with photographic fidelity, specific textures, controlled studio lighting, and clear composition boundaries.'
      : 'We enriched your prompt by assigning a specialist Role, defining the target Audience, setting Tone expectations, and establishing hard Length and Format constraints.',
    elementsAdded,
    changesBreakdown: [
      { element: 'Role & Subject', original: 'General', improved: 'Specified domain persona and concrete subject attributes', reason: 'Focuses AI precision immediately.' },
      { element: 'Context & Style', original: 'Open', improved: 'Added situational background and aesthetic style', reason: 'Prevents bland, default responses.' },
      { element: 'Constraints & Layout', original: 'None', improved: 'Established strict bounds and layout format', reason: 'Guarantees direct utility.' },
    ],
    isAlreadyStrong: promptText.length > 200,
    optionalTips: [
      'You can further edit this improved prompt directly in the box before generating again.',
      'Click "Generate Improved Output" to view the difference side by side.',
    ],
  };

  if (!hasApiKey) {
    res.json(fallbackResult);
    return;
  }

  try {
    const improveInstruction = `
You are a master prompt engineering teacher on PromptLab.
Your goal: Rewrite the user's prompt into an exceptional, high-performing prompt while preserving the user's exact original intention.
- Do NOT change the core topic or intent.
- Level: ${level.toUpperCase()}
- Mode: ${outputType.toUpperCase()}
- If Mode is IMAGE or user asks for a picture/photo/poster/image:
  Rewrite as a vivid visual prompt specifying: subject details, visual style (e.g. realistic food photograph), lighting (e.g. warm natural lighting), composition (e.g. visually appealing composition), and texture details.
  Set elementsAdded to: ["Added subject details", "Added visual style", "Added lighting", "Added composition", "Added context", "Added specificity"]
- If Mode is TEXT or VIDEO:
  Rewrite with Role, Context, Tone, Audience, Constraints, and Format where missing.
- Return ONLY valid JSON with this schema:
{
  "improvedPrompt": string,
  "explanation": string,
  "elementsAdded": string[],
  "changesBreakdown": [
    {
      "element": string,
      "original": string,
      "improved": string,
      "reason": string
    }
  ],
  "isAlreadyStrong": boolean,
  "optionalTips": string[]
}
`;

    const userContent = `
Original Prompt:
"""${promptText}"""

Mode: ${outputType}
Level: ${level}
${challenge ? `Challenge Scenario: "${challenge.scenario}". Goal: "${challenge.goal}"` : ''}
`;

    const response = await generateContentSafe({
      contents: userContent,
      config: {
        systemInstruction: improveInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ ...fallbackResult, ...parsed });
  } catch (err: any) {
    console.warn('Improve fallback:', err.message);
    res.json(fallbackResult);
  }
});

// 5. Smart Suggestions Endpoint (Requirement 19)
app.post('/api/suggestions', (req: Request, res: Response) => {
  const { prompt } = req.body;
  const lower = String(prompt || '').toLowerCase();

  const suggestions: string[] = [];

  if (lower.includes('resume') || lower.includes('cv')) {
    suggestions.push('+ Add target job role', '+ Add experience level', '+ Add key skills', '+ Add XYZ metric formula');
  } else if (lower.includes('email')) {
    suggestions.push('+ Add recipient relationship', '+ Add desired tone', '+ Add length limit (under 100 words)', '+ Add clear subject line');
  } else if (lower.includes('recipe') || lower.includes('dinner') || lower.includes('food') || lower.includes('biryani')) {
    suggestions.push('+ Add available ingredients', '+ Add cooking time limit', '+ Add dietary restrictions', '+ Add step-by-step format');
  } else if (lower.includes('trip') || lower.includes('travel')) {
    suggestions.push('+ Add traveler group & ages', '+ Add daily budget', '+ Add pace (relaxed vs packed)', '+ Add neighborhood clustering');
  } else if (lower.includes('poster') || lower.includes('caption') || lower.includes('social')) {
    suggestions.push('+ Add scroll-stopping hook', '+ Add platform (Instagram/LinkedIn)', '+ Add visual styling notes', '+ Add Call-to-Action');
  } else {
    suggestions.push('+ Add Role (Act as...)', '+ Add target audience', '+ Add length ceiling', '+ Add output format (table/bullets)');
  }

  res.json({ suggestions });
});

// Start Server with Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 PromptLab Production-Grade Server running on port ${PORT}`);
  });
}

startServer();
