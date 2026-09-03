import { useState, useEffect } from "react";

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

  return (
    <div className="w-full">
      <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-red-50/20 pt-32 pb-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="flex flex-col mt-4">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider w-fit mb-6 border border-red-100">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Cotação 100% digital & instantânea
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-zinc-900 leading-[1.1] mb-6 tracking-tight">
              Proteção completa para o seu veículo com contratação em até{" "}
              <span className="text-red-600">3 minutos.</span>
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

          <div className="bg-white rounded-4xl shadow-2xl shadow-zinc-200/50 p-8 lg:p-10 w-full max-w-md mx-auto lg:ml-auto border border-zinc-100">
            <h2 className="text-3xl font-bold text-zinc-900 mb-1">
              Simule sua proteção
            </h2>
            <p className="text-sm text-zinc-500 mb-8">
              Sem compromisso. Rápido e intuitivo.
            </p>

            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                  Tipo de Cobertura
                </label>
                <div className="flex items-center bg-zinc-100 rounded-xl p-1">
                  {["Completo", "Roubo/Furto", "Terceiros"].map((tipo) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => setTipoCobertura(tipo)}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        tipoCobertura === tipo
                          ? "bg-red-600 text-white shadow-md"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
                      }`}
                    >
                      {tipo}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                  Placa do Veículo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="BRA2E19"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent uppercase placeholder:normal-case placeholder:text-zinc-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-900 text-white text-[9px] font-bold px-2 py-1 rounded border-t-2 border-t-blue-500 flex items-center">
                    MERCOSUL
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                  Modelo ou Ano
                </label>
                <input
                  type="text"
                  placeholder="Ex: Honda Civic 2022"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-zinc-400 placeholder:font-normal"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                  CEP de Pernoite
                </label>
                <input
                  type="text"
                  placeholder="01310-100"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-zinc-400 placeholder:font-normal"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
                  WhatsApp para envio da cotação
                </label>
                <input
                  type="text"
                  placeholder="WhatsApp"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-zinc-400 placeholder:font-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-lg py-4 rounded-xl mt-2 transition-colors duration-200 shadow-lg shadow-red-600/30"
              >
                Simular Agora
              </button>
            </form>
          </div>
        </div>
      </main>

      <section className="py-20 lg:py-32 bg-linear-to-b from-blue-50/40 to-white px-6 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-16">
          <span className="text-red-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            Vantagens Exclusivas
          </span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-zinc-900 mb-6 max-w-3xl tracking-tight">
            Por que escolher a Seguraê para proteger seu carro?
          </h2>
          <p className="text-lg text-zinc-600 max-w-2xl">
            Coberturas pensadas nos mínimos detalhes para que você e sua família
            rodem com total tranquilidade todos os dias.
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="overflow-hidden px-2 py-4">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {vantagens.map((item, index) => (
                <div
                  key={index}
                  className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-4"
                >
                  <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-xl shadow-zinc-200/40 border border-zinc-100 h-full flex flex-col transition-transform duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                      {item.icone}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3">
                      {item.titulo}
                    </h3>
                    <p className="text-zinc-600 leading-relaxed text-[15px]">
                      {item.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={prevSlide}
              aria-label="Anterior"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-zinc-200 text-zinc-600 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm transition-all duration-300"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div className="flex gap-3">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === idx
                      ? "w-8 h-2.5 bg-red-600"
                      : "w-2.5 h-2.5 bg-red-200 hover:bg-red-400"
                  }`}
                  aria-label={`Ir para o slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Próximo"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-zinc-200 text-zinc-600 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm transition-all duration-300"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}