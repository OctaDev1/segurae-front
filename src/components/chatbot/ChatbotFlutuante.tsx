import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Botao {
  texto: string;
  prompt?: string;
  acao?: () => void;
  rota?: string;
  link?: string;
}

interface Mensagem {
  id: number;
  texto: string;
  remetente: 'bot' | 'usuario';
  botoes?: Botao[];
}

const processarIntencao = (texto: string): Omit<Mensagem, 'id' | 'remetente'> => {
  const txt = texto.toLowerCase();

  // 1. INTENÇÃO: PREÇO / PLANOS
  if (txt.match(/preço|preco|valor|custa|custo|pago|pagar|plano|planos|essencial|completo|vip/)) {
    return {
      texto: 'Trabalhamos com 3 planos oficiais para o Seguro Auto da Seguraê:\n\n• Essencial: R$ 139/mês\n• Completo: R$ 199/mês\n• Premium VIP: R$ 279/mês\n\nOs valores podem variar conforme o perfil e as coberturas escolhidas.',
      botoes: [
        { texto: '🛡️ Ver detalhes', rota: '/coberturas' },
        { texto: '🚗 Fazer cotação', rota: '/coberturas' },
        { texto: '💬 Falar com consultor', rota: '/contato' }
      ]
    };
  }

  // 2. INTENÇÃO: COBERTURAS E CONDIÇÕES
  if (txt.match(/cobertura|cobre|condição|condicoes/)) {
    return {
      texto: 'Para o Seguro Auto, oferecemos opções completas divididas em nossos planos:\n\n• Essencial (R$ 139/mês): Proteção essencial para o dia a dia.\n• Completo (R$ 199/mês): Cobertura ampliada para colisão e terceiros.\n• Premium VIP (R$ 279/mês): Proteção total sem preocupações.',
      botoes: [
        { texto: 'Ver todas as coberturas', rota: '/coberturas' },
        { texto: 'Fazer cotação', rota: '/coberturas' }
      ]
    };
  }

  // 3. INTENÇÃO: FAQ / DÚVIDAS
  if (txt.match(/faq|dúvida|duvida|pergunta|frequente/)) {
    return {
      texto: 'Se tiver dúvidas sobre os planos ou assistências, você pode falar diretamente com nossa equipe de atendimento!',
      botoes: [
        { texto: 'Falar conosco', rota: '/contato' }
      ]
    };
  }

  // 4. INTENÇÃO: CONTATO / ATENDIMENTO
  if (txt.match(/contato|falar|atendente|telefone|whatsapp|whats|email|e-mail|ajuda|vendedor/)) {
    return {
      texto: 'Claro! Você pode falar com a Seguraê por:\n\n📱 WhatsApp: (11) 99999-9999\n📞 Telefone/Sinistro: 0800 700 8020\n📧 E-mail: suporte@segurae.com.br',
      botoes: [
        { texto: '💬 WhatsApp', link: 'https://wa.me/5511999999999' },
        { texto: '📞 Ligar', link: 'tel:08007008020' },
        { texto: '📧 E-mail', link: 'mailto:suporte@segurae.com.br' }
      ]
    };
  }

  // 5. INTENÇÃO: COTAÇÃO / CONTRATAÇÃO
  if (txt.match(/cotação|cotacao|contratar|orçamento|orcamento/)) {
    return {
      texto: 'Perfeito! Posso te ajudar a iniciar uma cotação agora mesmo para escolher o seu plano ideal.',
      botoes: [
        { texto: '🚗 Fazer cotação', rota: '/coberturas' }
      ]
    };
  }

  // 6. SAUDAÇÃO
  if (txt.match(/oi|olá|ola|bom dia|boa tarde|boa noite|tudo bem/)) {
    return {
      texto: 'Olá! Como posso ajudar você hoje com o seu Seguro Auto?',
      botoes: [
        { texto: '💰 Ver nossos planos', prompt: 'planos' },
        { texto: '🛡️ Ver coberturas', prompt: 'coberturas' }
      ]
    };
  }

  // DEFAULT (Não entendeu / Não encontrou)
  return {
    texto: 'Não encontrei essa informação nas opções disponíveis da Seguraê.\n\nPosso te encaminhar para nosso atendimento para tirar suas dúvidas.',
    botoes: [
      { texto: 'Falar com atendente', rota: '/contato' }
    ]
  };
};

const SAUDACAO_INICIAL: Mensagem = {
  id: 1,
  texto: 'Olá! 👋\nSou o assistente virtual da Seguraê.\n\nPosso ajudar você a encontrar o plano de Seguro Auto ideal, consultar preços ou tirar suas dúvidas.\n\nComo posso ajudar?',
  remetente: 'bot',
  botoes: [
    { texto: '💰 Nossos Planos', prompt: 'planos' },
    { texto: '🛡️ Coberturas', prompt: 'coberturas' },
    { texto: '💬 Falar conosco', prompt: 'contato' },
    { texto: '🚗 Fazer cotação', rota: '/coberturas' }
  ]
};

export default function ChatbotFlutuante() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputTexto, setInputTexto] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([SAUDACAO_INICIAL]);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rolar para o fim quando nova mensagem chegar
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, isTyping]);

  const processarTexto = useCallback((textoBotao: string) => {
    const timestamp = Date.now();
    const novaMensagemUsuario: Mensagem = {
      id: timestamp,
      texto: textoBotao,
      remetente: 'usuario',
    };
    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    
    setIsTyping(true);

    const delay = 800 + Math.floor(Math.random() * 500);
    setTimeout(() => {
      const resposta = processarIntencao(textoBotao);
      const respostaMensagemBot: Mensagem = {
        id: timestamp + 1,
        texto: resposta.texto,
        botoes: resposta.botoes,
        remetente: 'bot',
      };
      setMensagens((prev) => [...prev, respostaMensagemBot]);
      setIsTyping(false);
    }, delay);
  }, []);

  const enviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTexto.trim()) return;

    const txt = inputTexto;
    setInputTexto('');
    processarTexto(txt);
  };

  const executarAcaoBotao = (botao: Botao) => {
    if (botao.prompt) {
      processarTexto(botao.prompt);
    } else if (botao.acao) {
      botao.acao();
    } else if (botao.rota) {
      setIsOpen(false);
      navigate(botao.rota);
    } else if (botao.link) {
      window.open(botao.link, '_blank');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[550px] max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
          
          <div className="bg-red-600 px-5 py-4 text-white flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                  Assistente Segura<span className="text-white">ê</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[11px] text-white/90 font-medium">Estamos online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white font-bold text-xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Fechar chat"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 p-4 bg-zinc-50 overflow-y-auto space-y-4 text-sm">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.remetente === 'usuario' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.remetente === 'usuario'
                      ? 'bg-red-600 text-white rounded-br-none'
                      : 'bg-white text-zinc-800 border border-zinc-100 rounded-bl-none'
                  }`}
                >
                  {msg.texto}
                </div>
                
                {msg.botoes && msg.remetente === 'bot' && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-1 max-w-[90%]">
                    {msg.botoes.map((botao, i) => (
                      <button
                        key={i}
                        onClick={() => executarAcaoBotao(botao)}
                        className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                      >
                        {botao.texto}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-zinc-100 p-3.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={enviarMensagem} className="p-3 bg-white border-t border-zinc-100 flex items-center gap-2">
            <input 
              type="text" 
              value={inputTexto}
              onChange={(e) => setInputTexto(e.target.value)}
              placeholder="Digite sua mensagem..." 
              className="flex-1 bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-600/40 transition-all"
            />
            <button 
              type="submit"
              disabled={!inputTexto.trim() || isTyping}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white w-12 h-12 rounded-xl font-bold transition-colors cursor-pointer shadow-md shadow-red-600/20 flex items-center justify-center shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -rotate-45 ml-1">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-600/30 group relative"
        aria-label="Abrir Chat"
      >
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-bounce"></span>
        )}
        <svg className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180 opacity-0 absolute' : 'rotate-0 opacity-100'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <svg className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0 absolute'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}