import { useState, useEffect } from "react";
import NavBar from "../../components/navbar/NavBar"; 
import Footer from "../../components/footer/Footer";
import DepoimentosSection from "../../components/depoimentos/DepoimentosSection";
import EquipeSection from "../../components/equipe/EquipeSection";
import { ToastAlerta } from "../../utils/toastalerta/ToastAlerta";

const vantagens = [
  {
    titulo: "Assistência 24h Brasil",
    descricao: "Guincho com quilometragem ilimitada, chaveiro presencial, auxílio para pane seca, troca de pneus e socorro elétrico instantâneo.",
    icone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    titulo: "Cobertura Total 100% FIPE",
    descricao: "Proteção integral garantida contra roubo, furto, incêndio natural, colisão com perda total ou parcial com indenização rápida.",
    icone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    titulo: "Carro Reserva até 30 Dias",
    descricao: "Garanta mobilidade ininterrupta. Caso precise deixar o veículo na oficina credenciada, liberação de modelo equivalente em poucas horas.",
    icone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
        <path d="m21 2-9.6 9.6" />
        <circle cx="7.5" cy="15.5" r="5.5" />
      </svg>
    ),
  },
  {
    titulo: "Cobertura para Terceiros",
    descricao: "Amparo completo contra danos materiais, corporais e morais causados a terceiros com tetos personalizáveis de até R$ 200 mil.",
    icone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    titulo: "Vidros, Faróis e Retrovisores",
    descricao: "Substituição e reparo veloz de para-brisas, vidros laterais, lanternas e retrovisores sem perda da sua classe de bônus acumulada.",
    icone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    titulo: "Pagamento Facilitado",
    descricao: "Assinatura mensal recorrente que não compromete o limite total do cartão de crédito, ou via PIX com desconto especial à vista.",
    icone: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  },
];

export default function Home() {
  const [tipoCobertura, setTipoCobertura] = useState("Completo");
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [cep, setCep] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isCalculando, setIsCalculando] = useState(false);
  const [resultadoSimulacao, setResultadoSimulacao] = useState<{
    tipo: string;
    valorBase: number;
    desconto: number;
    valorFinal: number;
    temDesconto10Anos: boolean;
    anoVeiculo: number;
    modelo: string;
    placa: string;
  } | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, vantagens.length - itemsPerView);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const anoAtual = new Date().getFullYear();
  const anoNum = parseInt(ano, 10);
  // Regra: se o carro tiver 10 anos ou mais em relação ao ano atual, recebe 20% de desconto
  const temDesconto10Anos = !isNaN(anoNum) && anoNum > 1900 && (anoAtual - anoNum >= 10);

  const precosBase: Record<string, number> = {
    "Completo": 149.90,
    "Roubo/Furto": 89.90,
    "Terceiros": 99.90,
  };

  const handleSimular = (e: React.FormEvent) => {
    e.preventDefault();

    if (!placa.trim() && !modelo.trim() && !ano.trim()) {
      ToastAlerta("Por favor, preencha ao menos o modelo ou placa e ano do veículo.", "erro");
      return;
    }

    setIsCalculando(true);

    setTimeout(() => {
      const valorBase = precosBase[tipoCobertura] || 149.90;
      const aplicaDesconto = temDesconto10Anos;
      const desconto = aplicaDesconto ? 0.20 : 0;
      const valorFinal = valorBase * (1 - desconto);

      setResultadoSimulacao({
        tipo: tipoCobertura,
        valorBase,
        desconto,
        valorFinal,
        temDesconto10Anos: aplicaDesconto,
        anoVeiculo: !isNaN(anoNum) ? anoNum : anoAtual,
        modelo: modelo.trim() || "Veículo",
        placa: placa.trim().toUpperCase() || "MERCOSUL",
      });

      setIsCalculando(false);
      ToastAlerta(
        aplicaDesconto
          ? "Simulação concluída! Desconto de 20% aplicado para veículo com 10+ anos."
          : "Simulação calculada com sucesso!",
        "sucesso"
      );
    }, 350);
  };

  return (
    <div className="w-full relative bg-white">
      {/* NavBar integrada para aparecer junto com a abertura da home */}
      <NavBar />

      <main className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-red-50/25 pt-32 pb-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Coluna da Esquerda (Textos e Imagem) */}
          <div className="flex flex-col mt-4">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider w-fit mb-6 border border-red-100">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Cotação 100% digital & instantânea
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-zinc-900 leading-[1.1] mb-6 tracking-tight">
              Proteção completa para o seu veículo com contratação em até <span className="text-red-600">3 minutos.</span>
            </h1>

            <p className="text-lg text-zinc-600 leading-relaxed mb-10 max-w-lg">
              Assistência 24 horas em todo o Brasil, cobertura total contra roubo,
              furto, colisão e danos a terceiros sem burocracia ou letras miúdas.
            </p>

            <div className="w-full h-64 lg:h-80 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop"
                alt="Carro de luxo escuro"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Coluna da Direita (Simulador Interativo de Proteção) */}
          <div className="bg-white rounded-4xl shadow-2xl shadow-zinc-200/50 p-6 sm:p-8 lg:p-10 w-full max-w-md mx-auto lg:ml-auto border border-zinc-100 transition-all">
            {!resultadoSimulacao ? (
              <>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-100 mb-2">
                    Cotação Rápida & Sem Cadastro
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                    Simule sua proteção
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Calcule na hora o valor para o seu veículo sem burocracia.
                  </p>
                </div>

                <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSimular}>
                  {/* Tipo de Cobertura */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                      Tipo de Cobertura
                    </label>
                    <div className="flex items-center bg-zinc-100 rounded-xl p-1 gap-1">
                      {["Completo", "Roubo/Furto", "Terceiros"].map((tipo) => (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => setTipoCobertura(tipo)}
                          className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                            tipoCobertura === tipo
                              ? "bg-red-600 text-white shadow-md font-semibold"
                              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
                          }`}
                        >
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Placa */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                      Placa do Veículo
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="BRA2E19"
                        maxLength={7}
                        value={placa}
                        onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent uppercase placeholder:normal-case placeholder:text-zinc-400"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-[9px] font-bold px-2 py-1 rounded border-t-2 border-t-blue-500 flex items-center">
                        MERCOSUL
                      </div>
                    </div>
                  </div>

                  {/* Modelo e Ano */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                        Modelo do Veículo
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Honda Civic"
                        value={modelo}
                        onChange={(e) => setModelo(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-zinc-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                          Ano Fabricação
                        </label>
                        {temDesconto10Anos && (
                          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            20% OFF
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        min="1970"
                        max={anoAtual + 1}
                        placeholder="Ex: 2014"
                        value={ano}
                        onChange={(e) => setAno(e.target.value)}
                        className={`w-full bg-zinc-50 border rounded-xl px-4 py-3 text-zinc-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-zinc-400 transition-colors ${
                          temDesconto10Anos
                            ? "border-emerald-500 ring-1 ring-emerald-500/30"
                            : "border-zinc-200"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Destaque dinâmico do desconto de 20% para carros com 10 anos ou mais */}
                  {temDesconto10Anos && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                      <span className="text-base leading-none">🎉</span>
                      <div>
                        <p className="font-bold">Desconto de 20% aplicado!</p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          Veículos fabricados há 10 anos ou mais ({ano}) ganham 20% de desconto na Seguraê.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CEP e WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                        CEP de Pernoite
                      </label>
                      <input
                        type="text"
                        placeholder="01310-100"
                        maxLength={9}
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-zinc-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                        WhatsApp
                      </label>
                      <input
                        type="text"
                        placeholder="(11) 99999-9999"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isCalculando}
                    className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-base py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-red-600/40 cursor-pointer flex items-center justify-center gap-2 mt-1 disabled:opacity-75"
                  >
                    {isCalculando ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Calculando cotação...</span>
                      </>
                    ) : (
                      <span>Simular Agora</span>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Card de Resultado da Simulação */
              <div className="flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    Cotação Concluída
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                    Plano {resultadoSimulacao.tipo}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-1">
                  {resultadoSimulacao.modelo}
                </h3>
                <p className="text-xs text-zinc-500 mb-5">
                  Placa: <span className="font-semibold text-zinc-700">{resultadoSimulacao.placa}</span> • Ano: <span className="font-semibold text-zinc-700">{resultadoSimulacao.anoVeiculo}</span>
                </p>

                {/* Box de Preço com Destaque do Desconto de 20% */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 mb-5">
                  {resultadoSimulacao.temDesconto10Anos ? (
                    <>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-zinc-400 line-through">
                          De {resultadoSimulacao.valorBase.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/mês
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-white shadow-xs">
                          20% OFF (10+ ANOS)
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                          {resultadoSimulacao.valorFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">/ mês</span>
                      </div>
                      <p className="text-xs text-emerald-600 font-semibold mt-2.5 flex items-center gap-1.5">
                        <span>✓</span>
                        <span>Economia garantida de {(resultadoSimulacao.valorBase * 0.20).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} todos os meses!</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">
                        Mensalidade Estimada
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                          {resultadoSimulacao.valorFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">/ mês</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">
                        Sem taxa de adesão ou carência.
                      </p>
                    </>
                  )}
                </div>

                {/* Vantagens Inclusas */}
                <ul className="space-y-2 text-xs text-zinc-600 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                    <span>Guincho 24h e socorro mecânico ilimitado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                    <span>Indenização de até 100% da Tabela FIPE</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                    <span>Contratação 100% digital em minutos</span>
                  </li>
                </ul>

                {/* Botões de Ação */}
                <div className="flex flex-col gap-2.5">
                  <a
                    href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                      `Olá! Realizei a simulação no site da Seguraê para o veículo ${resultadoSimulacao.modelo} (Ano ${resultadoSimulacao.anoVeiculo}, Placa ${resultadoSimulacao.placa}) no plano ${resultadoSimulacao.tipo} pelo valor de ${resultadoSimulacao.valorFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}/mês${
                        resultadoSimulacao.temDesconto10Anos ? " (com desconto de 20% para veículos com 10+ anos)" : ""
                      }. Gostaria de prosseguir com a contratação!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-sm text-center"
                  >
                    <span>Contratar pelo WhatsApp</span>
                    <span>&rarr;</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setResultadoSimulacao(null)}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-2.5 px-4 rounded-xl transition-colors text-xs text-center cursor-pointer"
                  >
                    Fazer nova simulação
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEÇÃO DE VANTAGENS (Carrossel criado pelo seu amigo) */}
        <div className="max-w-7xl mx-auto mt-32">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight mb-4">
              Por que escolher a Seguraê?
            </h3>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Desenvolvemos benefícios exclusivos para garantir que você e seu veículo rodem com total tranquilidade.
            </p>
          </div>

          <div className="relative overflow-hidden px-2">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {vantagens.map((vantagem, index) => (
                <div 
                  key={index}
                  style={{ minWidth: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 24 / itemsPerView}px)` }}
                  className="snap-start shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white p-8 rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                      {vantagem.icone}
                    </div>
                    <h4 className="text-xl font-bold text-zinc-900 mb-3">{vantagem.titulo}</h4>
                    <p className="text-zinc-600 text-sm leading-relaxed">{vantagem.descricao}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Botões do Carrossel */}
            <div className="flex justify-center gap-4 mt-8">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
              >
                ←
              </button>
              <button 
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-50 shadow-sm transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </main>
      <DepoimentosSection />
      <EquipeSection />
      <Footer />
    </div>
  );
}