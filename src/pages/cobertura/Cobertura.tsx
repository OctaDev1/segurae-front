import { useState } from "react";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";

export default function Coberturas() {
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);

  const coberturas = [
    {
      id: "essencial",
      nome: "Essencial (Roubo e Furto)",
      preco: "A partir de R$ 79/mês",
      descricao: "Proteção básica e fundamental para garantir que você não perca seu patrimônio para a criminalidade.",
      badge: "Mais Econômico",
      beneficios: [
        "Cobertura contra Roubo e Furto qualificado",
        "Indenização de até 100% da Tabela FIPE",
        "Assistência 24h básica (Guincho e Chaveiro)",
        "Cobertura em todo o território nacional",
        "Sem análise de perfil de condutor"
      ]
    },
    {
      id: "completo",
      nome: "Completo (Colisão e Terceiros)",
      preco: "A partir de R$ 139/mês",
      descricao: "A escolha favorita dos motoristas. Amparo total contra imprevistos do dia a dia, batidas e danos materiais a outros.",
      badge: "Mais Popular",
      destacado: true,
      beneficios: [
        "Tudo do plano Essencial",
        "Cobertura contra colisão (Perta Total e Parcial)",
        "Proteção contra danos materiais e morais a Terceiros",
        "Assistência 24h com quilometragem ilimitada",
        "Carro reserva por até 30 dias",
        "Reparo rápido de lataria e pintura"
      ]
    },
    {
      id: "premium",
      nome: "Premium VIP (Proteção Total)",
      preco: "A partir de R$ 199/mês",
      descricao: "Cobertura de alto padrão para quem busca zero preocupação e benefícios exclusivos na estrada.",
      badge: "Máxima Proteção",
      beneficios: [
        "Tudo do plano Completo",
        "Vidros, faróis, lanternas e retrovisores sem franquia",
        "Carro reserva modelo SUV/Sedan executivo",
        "Assistência residencial para a sua casa inclusa",
        "Hospedagem emergencial em caso de acidente em viagem",
        "Atendimento via concierge dedicado"
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
            Nossos Planos
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
            Escolha a cobertura ideal para o <span className="text-red-600">seu veículo</span>
          </h1>
          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed">
            Planos flexíveis desenvolvidos sob medida para garantir a sua tranquilidade e proteger o seu bolso contra imprevistos.
          </p>
        </div>

        {/* Grid de Cards de Cobertura */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {coberturas.map((cob) => (
            <div 
              key={cob.id}
              className={`bg-white rounded-4xl p-8 flex flex-col justify-between transition-all duration-300 relative border ${
                cob.destacado 
                  ? "border-red-600 shadow-2xl shadow-red-600/10 md:-translate-y-2 ring-2 ring-red-600/20" 
                  : "border-zinc-200/80 shadow-xl shadow-zinc-100 hover:border-zinc-300"
              }`}
            >
              {/* Badge de Destaque */}
              {cob.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                  {cob.badge}
                </div>
              )}

              <div>
                <div className="mb-6 pt-2">
                  <h3 className="text-2xl font-bold text-zinc-900 mb-2">{cob.nome}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed min-h-10">{cob.descricao}</p>
                </div>

                <div className="mb-8 pb-6 border-b border-zinc-100">
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block mb-1">Investimento</span>
                  <span className="text-3xl font-extrabold text-zinc-900">{cob.preco}</span>
                </div>

                <div className="space-y-3.5 mb-8">
                  <span className="text-xs font-bold text-zinc-700 uppercase tracking-widest block mb-2">O que está incluído:</span>
                  {cob.beneficios.map((beneficio, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-zinc-600">
                      <div className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        ✓
                      </div>
                      <span>{beneficio}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setTipoSelecionado(cob.nome)}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 shadow-md ${
                  cob.destacado
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-red-600/30"
                    : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/10"
                }`}
              >
                Contratar este plano
              </button>
            </div>
          ))}
        </div>

        {/* Modal de feedback simples ao clicar em contratar */}
        {tipoSelecionado && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                🚗
              </div>
              <h3 className="text-2xl font-bold text-zinc-900">Plano Selecionado!</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Você escolheu o plano <strong className="text-zinc-900">{tipoSelecionado}</strong>. Vamos redirecioná-lo para a cotação instantânea da placa do seu veículo.
              </p>
              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => setTipoSelecionado(null)}
                  className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Voltar
                </button>
                <button 
                  onClick={() => {
                    alert("Redirecionando para o simulador...");
                    setTipoSelecionado(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-md shadow-red-600/20"
                >
                  Continuar
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