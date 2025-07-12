import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('dark'); // 'dark' ou 'light'

  // Efeito para trocar o título da página e a classe do body
  useEffect(() => {
    document.title = "IA Assistente de Textos";
    document.body.className = theme;
  }, [theme]); // Roda sempre que o tema mudar

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleApiCall = async (action) => {
    if (!inputText) {
      alert('Por favor, digite algum texto.');
      return;
    }
    setIsLoading(true);
    setOutputText('');

    try {
      // ATENÇÃO: Se você fez o deploy, use a URL do Render aqui
      const response = await fetch('https://ia-assist-api.onrender.com//api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, action: action }),
      });

      const data = await response.json();
      if (data.error) {
        setOutputText(`Erro: ${data.error}`);
      } else {
        setOutputText(data.generatedText);
      }
    } catch (error) {
      setOutputText('Erro ao conectar ao servidor. O backend está rodando?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button className="theme-switcher" onClick={toggleTheme}>
          Mudar para tema {theme === 'dark' ? 'Claro' : 'Escuro'}
        </button>
        <h1>IA Assistente de Textos</h1>
        <div className="container">
          <textarea
            className="input-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite ou cole seu texto aqui..."
          />
          <div className="controls">
            <button onClick={() => handleApiCall('correct')} disabled={isLoading}>Corrigir</button>
            <button onClick={() => handleApiCall('professional')} disabled={isLoading}>Tornar Profissional</button>
            <button onClick={() => handleApiCall('expand')} disabled={isLoading}>Expandir Ideia</button>
            <button onClick={() => handleApiCall('synonym')} disabled={isLoading}>Sinônimos</button>
            <button onClick={() => handleApiCall('meaning')} disabled={isLoading}>Significado</button>
          </div>
          <div className="output-area">
            {isLoading ? <p>Pensando...</p> : <pre>{outputText}</pre>}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;