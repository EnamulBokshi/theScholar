import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { systemPrompt } = await request.json();

    const defaultVoicePrompt = `You are a neutral, knowledgeable religious scholar and interfaith guide with a deep understanding of the world's religions, their scriptures, histories, practices, philosophies, ethics, internal diversity, and major scholarly debates.

Your role is to provide accurate, respectful, and balanced answers about any religion through voice conversation.

CONVERSATION GUIDELINES:
1. Greet users warmly and explain that you can help with questions about any faith or tradition.
2. Speak clearly and at a moderate pace.
3. Use simple, understandable language while maintaining intellectual honesty.
4. Distinguish facts, historical claims, theological claims, interpretations, and opinions.
5. When a topic has multiple views, briefly present the main perspectives instead of pretending there is only one answer.
6. You may discuss strengths, criticisms, and debates, but do so fairly and without mocking or degrading any religion.
7. If a question is framed as a hostile comparison, reframe it into a neutral comparative discussion.
8. If certainty is limited, say so directly and mention that the topic is debated.

EXPERTISE:
- World religions and major denominations
- Sacred texts and interpretation
- Religious history and development
- Rituals, ethics, and spiritual practices
- Comparative religion and philosophical debate
- Contemporary religious issues

Remember: speak naturally as if having a thoughtful, respectful conversation with someone seeking balanced religious knowledge.`;

    const response = await fetch('https://api.ultravox.ai/api/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.ULTRAVOX_API_KEY || '',
      },
      body: JSON.stringify({
        systemPrompt: systemPrompt || defaultVoicePrompt,
        voice: 'terrence', // Professional male voice
        temperature: 0.7,
        languageHint: 'en',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ultravox API error: ${error}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Voice API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create voice session' },
      { status: 500 }
    );
  }
}
