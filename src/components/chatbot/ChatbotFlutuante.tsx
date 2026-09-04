import { useState } from 'react';

interface Mensagem {
  id: number;
  texto: string;
  remetente: 'bot' | 'usuario';
}

export default function ChatbotFlutuante() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputTexto, setInputTexto] = useState('');
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 1,
      texto: 'Olá! Sou o assistente virtual da Seguraê. Como posso te ajudar a proteger o seu veículo hoje? 🚗✨',
      remetente: 'bot',
    },
  ]);

  const enviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTexto.trim()) return;

    // Adiciona a mensagem do usuário
    const novaMensagemUsuario: Mensagem = {
      id: Date.now(),
      texto: inputTexto,
      remetente: 'usuario',
    };

    setMensagens((prev) => [...prev, novaMensagemUsuario]);
    const textoAtual = inputTexto;
    setInputTexto('');

    // Simula uma resposta automática do assistente após 1 segundo
    setTimeout(() => {
      let respostaBot = 'Entendi! Para cotações rápidas e contratação de apólices, você pode navegar pelas abas de Coberturas ou acessar a sua Área do Cliente.';
      
      if (textoAtual.toLowerCase().includes('preço') || textoAtual.toLowerCase().includes('valor') || textoAtual.toLowerCase().includes('cotação')) {
        respostaBot = 'Nossas cotações são 100% digitais e levam menos de 3 minutos! Você pode simular diretamente pelo site.';
      } else if (textoAtual.toLowerCase().includes('guincho') || textoAtual.toLowerCase().includes('emergência') || textoAtual.toLowerCase().includes('24h')) {
        respostaBot = 'A assistência 24h funciona em todo o Brasil. Você pode acionar o guincho diretamente pelo painel na sua Área do Cliente!';
      }

      const respostaMensagemBot: Mensagem = {
        id: Date.now() + 1,
        texto: respostaBot,
        remetente: 'bot',
      };
      setMensagens((prev) => [...prev, respostaMensagemBot]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Janela do Chat */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col h-[480px] animate-in fade-in zoom-in-95 duration-200">
          
          {/* Cabeçalho do Chat */}
          <div className="bg-red-600 px-5 py-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Assistente Seguraê</h3>
                <p className="text-[10px] text-white/80 font-medium">Online agora</p>
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

          {/* Corpo / Lista de Mensagens */}
          <div className="flex-1 p-4 bg-zinc-50 overflow-y-auto space-y-3 text-xs sm:text-sm">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.remetente === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed ${
                    msg.remetente === 'usuario'
                      ? 'bg-red-600 text-white rounded-br-none'
                      : 'bg-white text-zinc-700 border border-zinc-100 rounded-bl-none'
                  }`}
                >
                  {msg.texto}
                </div>
              </div>
            ))}
          </div>

          {/* Rodapé / Input de Envio */}
          <form onSubmit={enviarMensagem} className="p-3 bg-white border-t border-zinc-100 flex items-center gap-2">
            <input 
              type="text" 
              value={inputTexto}
              onChange={(e) => setInputTexto(e.target.value)}
              placeholder="Digite sua dúvida..." 
              className="flex-1 bg-zinc-100 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-600/40"
            />
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-red-600/20"
            >
              Enviar
            </button>
          </form>
        </div>
      )}

      {/* Botão Flutuante Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-600/30 group relative"
        aria-label="Abrir Chat"
      >
        {/* Notificação de alerta de mensagem nova */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-bounce"></span>

        <svg className="w-6 h-6 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
}