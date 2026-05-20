export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product, audience, tone } = req.body;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an ad expert. Output ONLY valid JSON.'
          },
          {
            role: 'user',
            content: `Generate 3 ad variations for ${product}. Target: ${audience}. Tone: ${tone}. Return: {"variations": [{"headline": "...", "description": "...", "cta": "...", "reasoning": "..."}]}`
          }
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleanJson = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const parsed = JSON.parse(cleanJson);
    
    res.status(200).json(parsed);
  } catch (error) {
    res.status(500).json({ error: 'Generation failed' });
  }
}
