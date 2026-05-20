import { useState } from 'react';

export default function Home() {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState([]);
  const [selected, setSelected] = useState(null);

  const generateAds = async () => {
    if (!product || !audience) {
      alert('Please fill in both fields');
      return;
    }
    
    setLoading(true);
    setAds([]);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, audience, tone }),
      });
      const data = await res.json();
      
      if (data.variations) {
        setAds(data.variations);
        setSelected(data.variations[0]);
      } else {
        alert('Failed to generate ads');
      }
    } catch (err) {
      alert('Error: Check your API key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'Arial' }}>
      <h1 style={{ color: '#2563eb' }}>🚀 Smart AI Ads</h1>
      <p>Powered by DeepSeek</p>
      
      <input
        placeholder="What are you selling?"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        style={{ width: '100%', padding: 12, margin: '10px 0', border: '1px solid #ccc', borderRadius: 8 }}
      />
      
      <input
        placeholder="Target audience"
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
        style={{ width: '100%', padding: 12, margin: '10px 0', border: '1px solid #ccc', borderRadius: 8 }}
      />
      
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        style={{ width: '100%', padding: 12, margin: '10px 0', border: '1px solid #ccc', borderRadius: 8 }}
      >
        <option value="professional">Professional</option>
        <option value="casual">Casual</option>
        <option value="urgent">Urgent</option>
      </select>
      
      <button
        onClick={generateAds}
        disabled={loading}
        style={{ width: '100%', padding: 14, background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, fontSize: 16 }}
      >
        {loading ? 'Generating...' : 'Generate AI Ads'}
      </button>
      
      {ads.map((ad, i) => (
        <div key={i} style={{ marginTop: 20, padding: 15, border: selected === ad ? '2px solid blue' : '1px solid #ddd', borderRadius: 10 }}>
          <h3>{ad.headline}</h3>
          <p>{ad.description}</p>
          <span style={{ background: 'green', color: 'white', padding: '5px 15px', borderRadius: 20 }}>{ad.cta}</span>
        </div>
      ))}
    </div>
  );
}
