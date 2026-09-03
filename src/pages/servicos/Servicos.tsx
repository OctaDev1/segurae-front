import { useState } from "react";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";

export default function Servicos() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string | null>(null);

  const servicos = [
    {
      id: "guincho",
      titulo: "Assistência 24h & Guincho",
      icone: "🚛",
      descricao: "Socorro mecânico e elétrico rápido, pane seca e guincho com quilometragem ilimitada em todo o território nacional.",
      detalhes: [
        "Guincho ilimitado para qualquer localidade",
        "Chaveiro presencial para abertura de portas",
        "Auxílio pane seca (combustível para reboque)",
        "Troca imediata de pneus furados na rodovia"
      ]
    },
    {
      id: "carro-reserva",
      titulo: "Carro Reserva até 30 Dias",
      icone: "🚗",
      descricao: "Mobilidade garantida para você e sua família enquanto o seu veículo estiver em conserto na oficina credenciada.",
      detalhes: [
        "Liberação rápida do veículo em poucas horas",
        "Modelos equivalentes e confortáveis",
        "Opção de carro popular, sedan ou SUV",
        "Sem burocracia na retirada"
      ]
    },
    {
      id: "vidros",
      titulo: "Vidros, Faróis e Retrovisores",
      icone: "💡",
      descricao: "Reparo e substituição ágil de para-brisas, janelas laterais, faróis, lanternas e retrovisores danificados.",
      detalhes: [
        "Atendimento veloz sem perda da classe de bônus",
        "Peças originais ou equivalentes de alta qualidade",
        "Reparo de trincas em para-brisas sem necessidade de troca",
        "Cobertura para teto solar em planos selecionados"
      ]
    },
    {
      id: "terceiros",
      titulo: "Proteção para Terceiros",
      icone: "🛡️",
      descricao: "Amparo financeiro completo contra danos materiais, corporais ou morais causados a terceiros em acidentes.",
      detalhes: [
        "Tetos personalizáveis de até R$ 200 mil",
        "Assistência jurídica em caso de acidentes",
        "Negociação direta com o terceiro envolvido",
        "Tranquilidade total no trânsito urbano e rodovias"
      ]
    },
    {
      id: "oficinas",
      titulo: "Rede Credenciada Exclusiva",
      icone: "🔧",
      descricao: "Oficinas mecânicas e centros de estética automotiva rigorosamente selecionados com garantia nos serviços prestados.",
      detalhes: [
        "Ferramentaria moderna e alta tecnologia",
        "Profissionais especializados e treinados",
        "Garantia estendida nos reparos de funilaria",
        "Acompanhamento online do status do conserto"
      ]
    },
    {
      id: "aplicativo",
      titulo: "Gestão 100% Digital & App",
      icone: "📱",
      descricao: "Acompanhe tudo na palma da sua mão. Acione o guincho, consulte parcelas e baixe comprovantes em segundos.",
      detalhes: [
        "Botão de pânico e acionamento de socorro via app",
        "Segunda via de boletos e histórico de pagamentos",
        "Chat direto com consultores especialistas",
        "Notificações em tempo real sobre seu plano"
      ]
    }
  ];

  return (
    <div className="w-full min-h-screen bg-zinc-50 text-zinc-900 relative flex flex-col justify-between">
      {/* Navbar flutuante em formato de pílula */}
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 lg:px-16 pt-36 pb-24 w-full">
        {/* Cabeçalho da Página */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-red-100">
            Nossos Serviços
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
            Soluções completas para manter você e seu carro em <span className="text-red-600">movimento</span>
          </h1>
          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed">
            Conheça todos os benefícios e assistências de alta performance que o Seguraê coloca à sua disposição 24 horas por dia.
          </p>
        </div>

        {/* Grid de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {servicos.map((serv) => (
            <div 
              key={serv.id}
              className="bg-white rounded-4xl p-8 border border-zinc-200/80 shadow-xl shadow-zinc-100 flex flex-col justify-between hover:border-red-200 transition-all duration-300 group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  {serv.icone}
                </div>
                
                <h3 className="text-2xl font-bold text-zinc-900 mb-3">{serv.titulo}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6">{serv.descricao}</p>

                <div className="space-y-2.5 mb-8 border-t border-zinc-100 pt-6">
                  {serv.detalhes.map((detalhe, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-medium text-zinc-500">
                      <div className="w-4 h-4 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        ✓
                      </div>
                      <span>{detalhe}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setServicoSelecionado(serv.titulo)}
                className="w-full py-3.5 bg-zinc-100 hover:bg-red-600 hover:text-white text-zinc-800 font-bold text-sm rounded-xl transition-all duration-200"
              >
                Solicitar Informações
              </button>
            </div>
          ))}
        </div>

        {/* Modal interativo ao clicar em um serviço */}
        {servicoSelecionado && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🛠️
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">Atendimento Especializado</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Você demonstrou interesse em <strong className="text-zinc-900">{servicoSelecionado}</strong>. Fale diretamente com nossa equipe via WhatsApp para tirar dúvidas ou acionar agora mesmo!
              </p>
              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => setServicoSelecionado(null)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Fechar
                </button>
                <button 
                  onClick={() => {
                    alert("Redirecionando para o WhatsApp de atendimento...");
                    setServicoSelecionado(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-md shadow-red-600/20"
                >
                  Chamar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer padrão do site */}
      <Footer />
    </div>
  );
}