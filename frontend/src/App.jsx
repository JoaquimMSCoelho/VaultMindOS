import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

function App() {
  // --- TEMA "ENERGIA VITAL" (Refinado para Enterprise) ---
  const theme = {
    primary: '#16A085',     // Verde Principal
    secondary: '#F39C12',   // Laranja Ação
    bgGlobal: '#F4F7F6',    // Fundo Cinza Gelo Profissional
    sidebarBg: '#ffffff',   // Sidebar Branca Clean
    textMain: '#2C3E50',
    textLight: '#ffffff',
    borderColor: 'rgba(0,0,0,0.08)'
  }

  const [input, setInput] = useState('')
  // Mensagem inicial mais curta para dar espaço aos Cards
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Olá. O VaultMindOS está pronto. Selecione uma ferramenta ou envie um documento.' }
  ])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => { scrollToBottom() }, [messages])

  // --- LÓGICA DE UPLOAD E CHAT (Mantida idêntica) ---
  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessages(prev => [...prev, { 
        sender: 'system', 
        text: `📎 **DOCUMENTO ANEXADO:** "${file.name}"\n\nDados extraídos e prontos para análise.` 
      }])
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', isError: true, text: 'Erro ao processar arquivo.' }])
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const sendMessage = async (textOverride) => {
    const textToSend = textOverride || input
    if (!textToSend.trim()) return

    const userMsg = { sender: 'user', text: textToSend }
    const currentHistory = messages.filter(m => m.sender !== 'system')
    
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: textToSend,
        history: currentHistory
      })
      const aiMsg = { sender: 'ai', text: response.data.reply }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', isError: true, text: 'O sistema está sobrecarregado (Cota API). Tente em breve.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  // --- COMPONENTES VISUAIS (Inspirados no Quantumrun) ---
  
  const SidebarItem = ({ icon, label, active }) => (
    <div style={{
      padding: '12px 20px',
      margin: '5px 10px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '10px',
      color: active ? theme.primary : '#7F8C8D',
      background: active ? '#E8F6F3' : 'transparent',
      fontWeight: active ? '600' : '400',
      transition: 'all 0.2s'
    }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <span>{label}</span>
    </div>
  )

  const ActionCard = ({ title, desc, icon }) => (
    <div 
      onClick={() => sendMessage(`Iniciar modo: ${title}`)}
      style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${theme.borderColor}`,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column', gap: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '8px', 
        background: '#E8F6F3', color: theme.primary, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' 
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '0.95rem', color: theme.textMain }}>{title}</h3>
        <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#7F8C8D' }}>{desc}</p>
      </div>
    </div>
  )

  return (
    <div style={{ 
      width: '100vw', height: '100vh', 
      background: theme.bgGlobal, 
      color: theme.textMain,
      display: 'flex', 
      fontFamily: "'Segoe UI', 'Roboto', sans-serif"
    }}>
      
      {/* 1. SIDEBAR (Navegação Profissional) */}
      <div style={{
        width: '260px',
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.borderColor}`,
        display: 'flex', flexDirection: 'column',
        zIndex: 20
      }}>
        {/* Logo Area */}
        <div style={{ padding: '25px 20px', borderBottom: `1px solid ${theme.borderColor}` }}>
          <h1 style={{ margin: 0, fontSize: '1.2rem', color: theme.primary, letterSpacing: '-0.5px' }}>
            🌿 VaultMind<span style={{fontWeight:'300'}}>OS</span>
          </h1>
          <span style={{ fontSize: '0.7rem', color: '#95A5A6', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Enterprise Edition
          </span>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '20px 0', flex: 1 }}>
          <SidebarItem icon="📊" label="Dashboard" active />
          <SidebarItem icon="📂" label="Meus Arquivos" />
          <SidebarItem icon="🧠" label="Memória Ativa" />
          <SidebarItem icon="⚙️" label="Configurações" />
        </div>

        {/* User Profile (Fake) */}
        <div style={{ padding: '20px', borderTop: `1px solid ${theme.borderColor}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: theme.secondary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>J</div>
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: '600' }}>Joaquim</div>
            <div style={{ color: '#95A5A6', fontSize: '0.75rem' }}>Admin Pro</div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT (Área de Trabalho) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Header Simples */}
        <div style={{ 
          height: '60px', background: 'white', borderBottom: `1px solid ${theme.borderColor}`,
          display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between'
        }}>
          <span style={{ fontWeight: '600', color: theme.textMain }}>Nova Análise de Documento</span>
          <span style={{ fontSize: '0.8rem', color: theme.primary, background: '#E8F6F3', padding: '5px 10px', borderRadius: '15px' }}>
             ● Sistema Online
          </span>
        </div>

        {/* Área de Scroll do Chat */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* CARDS DE AÇÃO (Estilo Quantumrun) - Só aparecem no inicio */}
          {messages.length < 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              <ActionCard icon="📄" title="Resumir Documento" desc="Extrair pontos chave de PDFs." />
              <ActionCard icon="🛡️" title="Auditoria de Risco" desc="Avaliar segurança do texto." />
              <ActionCard icon="💡" title="Ideação Estratégica" desc="Criar planos baseados em dados." />
            </div>
          )}

          {/* Mensagens */}
          {messages.map((msg, index) => (
            <div key={index} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : (msg.sender === 'system' ? 'center' : 'flex-start'),
              maxWidth: msg.sender === 'system' ? '90%' : '80%',
              background: msg.sender === 'user' ? theme.primary : (msg.sender === 'system' ? '#E8F6F3' : 'white'),
              color: msg.sender === 'user' ? 'white' : theme.textMain,
              padding: '15px 25px',
              borderRadius: '12px',
              border: msg.sender === 'user' ? 'none' : `1px solid ${theme.borderColor}`,
              boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
              borderLeft: msg.isError ? `4px solid ${theme.secondary}` : undefined
            }}>
              {msg.sender !== 'system' && (
                <div style={{ fontSize: '0.75rem', marginBottom: '5px', opacity: 0.7, fontWeight: 'bold' }}>
                  {msg.sender === 'user' ? 'VOCÊ' : 'VAULTMIND AI'}
                </div>
              )}
              <div className="markdown-content">
                {msg.sender === 'user' ? msg.text : <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>}
              </div>
            </div>
          ))}
          {loading && <div style={{ color: '#95A5A6', fontStyle: 'italic', paddingLeft: '10px' }}>Processando dados...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px 30px', background: 'white', borderTop: `1px solid ${theme.borderColor}`, display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            style={{ 
              background: '#F4F6F7', border: 'none', width: '45px', height: '45px', 
              borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', color: '#7F8C8D',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#E5E8E8'}
            onMouseOut={e => e.currentTarget.style.background = '#F4F6F7'}
          >
            📎
          </button>
          
          <input 
            type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.txt,.md" style={{ display: 'none' }} 
          />

          <input 
            value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
            placeholder={uploading ? "Analisando arquivo..." : "Digite seu comando ou pergunte sobre o documento..."}
            disabled={uploading}
            style={{
              flex: 1, padding: '15px', borderRadius: '8px', background: '#F4F6F7',
              border: '1px solid transparent', outline: 'none', color: theme.textMain
            }}
            onFocus={e => { e.target.style.background = 'white'; e.target.style.borderColor = theme.primary }}
            onBlur={e => { e.target.style.background = '#F4F6F7'; e.target.style.borderColor = 'transparent' }}
          />
          
          <button 
            onClick={() => sendMessage()} disabled={uploading}
            style={{
              padding: '0 25px', height: '45px', borderRadius: '8px', background: theme.primary,
              color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(22, 160, 133, 0.3)'
            }}
          >
            ENVIAR
          </button>
        </div>
      </div>
    </div>
  )
}

export default App