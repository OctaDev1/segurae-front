import { useState } from "react";

function Home() {
  const [tipoCobertura, setTipoCobertura] = useState("Completo");

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-red-50/20 pt-32 pb-16 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
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

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-zinc-200/50 p-8 lg:p-10 w-full max-w-md mx-auto lg:ml-auto border border-zinc-100">
          <h2 className="text-3xl font-bold text-zinc-900 mb-1">Simule sua proteção</h2>
          <p className="text-sm text-zinc-500 mb-8">Sem compromisso. Rápido e intuitivo.</p>

          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
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
  );
}

export default Home;