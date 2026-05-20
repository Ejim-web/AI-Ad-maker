// IMPORTANT: Replace this with your actual DeepSeek API key
const DEEPSEEK_API_KEY = "YOUR_DEEPSEEK_API_KEY_HERE";

async function generateAds() {
    const product = document.getElementById('product').value;
    const audience = document.getElementById('audience').value;
    const tone = document.getElementById('tone').value;
    
    if (!product || !audience) {
        showError('Please fill in both fields');
        return;
    }
    
    if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === "YOUR_DEEPSEEK_API_KEY_HERE") {
        showError('Please add your DeepSeek API key in the script.js file');
        return;
    }
    
    // Show loading
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('results').innerHTML = '';
    
    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert ad copywriter. Output ONLY valid JSON. No extra text, no markdown.'
                    },
                    {
                        role: 'user',
                        content: `Generate 3 high-converting ad variations for:
                        
Product: ${product}
Target Audience: ${audience}
Brand Tone: ${tone}

Return EXACTLY this JSON format:
{
  "variations": [
    {
      "headline": "short punchy headline (max 60 chars)",
      "description": "benefit-driven description (max 90 chars)",
      "cta": "action button text (max 20 chars)",
      "reasoning": "one sentence why this ad works"
    }
  ]
}`
                    }
                ],
                temperature: 0.8,
            }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'API error');
        }
        
        const content = data.choices[0].message.content;
        const cleanJson = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        
        displayAds(parsed.variations);
        
    } catch (err) {
        console.error('Error:', err);
        showError('Failed to generate ads: ' + err.message);
        
        // Show example ads as fallback
        const exampleAds = [
            { headline: `🔥 ${product.substring(0,40)} — Limited Time`, description: `Perfect for ${audience}. Join thousands of happy customers.`, cta: 'Shop Now →', reasoning: 'Urgency + social proof drives conversions' },
            { headline: `Finally, ${audience} can get ${product.substring(0,30)}`, description: 'Stop wasting time. Get results today.', cta: 'Learn More', reasoning: 'Addresses pain points directly' },
            { headline: `The ${tone} way to ${product.substring(0,35)}`, description: 'Trusted by industry leaders.', cta: 'Get Started', reasoning: 'Authority positioning builds trust' }
        ];
        displayAds(exampleAds);
        
    } finally {
        document.getElementById('generateBtn').disabled = false;
        document.getElementById('loading').style.display = 'none';
    }
}

function displayAds(ads) {
    const container = document.getElementById('results');
    container.innerHTML = '<h3 style="margin-bottom:15px">📢 Choose your best ad:</h3>';
    
    ads.forEach((ad, index) => {
        const adDiv = document.createElement('div');
        adDiv.className = 'ad-card';
        adDiv.onclick = () => selectAd(adDiv, ad);
        adDiv.innerHTML = `
            <div class="ad-headline">${ad.headline}</div>
            <div class="ad-description">${ad.description}</div>
            <div class="ad-cta">${ad.cta}</div>
            ${ad.reasoning ? `<div class="ad-reasoning">💡 ${ad.reasoning}</div>` : ''}
        `;
        container.appendChild(adDiv);
    });
    
    const successBox = document.createElement('div');
    successBox.className = 'success-box';
    successBox.innerHTML = '<p class="success-text">✅ Ad ready! Copy this to your Facebook, Google, or Instagram Ads Manager.</p>';
    container.appendChild(successBox);
}

function selectAd(element, ad) {
    // Remove selected class from all cards
    document.querySelectorAll('.ad-card').forEach(card => {
        card.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // Show selected ad info
    alert(`Selected Ad:\n\nHeadline: ${ad.headline}\nDescription: ${ad.description}\nCTA: ${ad.cta}\n\nCopy this to your ad platform!`);
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Add event listener when page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateBtn').addEventListener('click', generateAds);
});
