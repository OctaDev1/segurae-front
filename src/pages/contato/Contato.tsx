import { useState } from "react";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";

export default function Contato() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="w-full min-h-screen bg-white text-black relative">
      {/* Navbar flutuante */}
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 lg:px-16 pt-36 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Informações de Contato */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-red-500/20">
              Central de Atendimento
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-extrabold text-black leading-tight tracking-tight">
              Estamos prontos para te <span className="text-red-600">atender.</span>
            </h1>
            
            <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
              Fale com um dos nossos consultores especialistas e tire todas as suas dúvidas sobre coberturas, assistência 24h ou cotações para o seu veículo.
            </p>

            <div className="space-y-4 pt-4 text-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-red-500 font-bold">📍</div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Endereço</p>
                  <p className="text-sm font-medium">Atendimento 100% digital em todo o Brasil</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-red-500 font-bold">💬</div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">WhatsApp Oficial</p>
                  <p className="text-sm font-medium">(11) 99999-9999</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-red-500 font-bold">✉️</div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">E-mail</p>
                  <p className="text-sm font-medium">suporte@segurae.com.br</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-4xl shadow-2xl flex flex-col gap-4 text-zinc-900 border border-zinc-800">
              <h3 className="text-2xl font-bold text-zinc-900 mb-1">Mande sua mensagem</h3>
              
              {enviado ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center">
                  <p className="font-bold text-lg mb-1">Mensagem enviada!</p>
                  <p className="text-sm">Retornaremos o mais breve possível.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Nome completo</label>
                    <input type="text" required placeholder="Ex: Maria Silva" className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all bg-zinc-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">E-mail</label>
                    <input type="email" required placeholder="maria@email.com" className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all bg-zinc-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Mensagem</label>
                    <textarea rows={4} required placeholder="Como podemos ajudar?" className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all resize-none bg-zinc-50"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all mt-2 shadow-lg shadow-red-600/25">
                    Enviar mensagem
                  </button>
                </>
              )}
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}