import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface ScrollExpandIntroProps {
  children: ReactNode;
}

export default function ScrollExpandIntro({ children }: ScrollExpandIntroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isEntering, setIsEntering] = useState(false);
  const [isEntered, setIsEntered] = useState(false);

  // Bloqueia a rolagem do corpo enquanto a tela de abertura estiver ativa e garante scroll no topo
  useEffect(() => {
    if (!isEntered && !shouldReduceMotion) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isEntered, shouldReduceMotion]);

  // Se o usuário preferir redução de movimento ou já entrou, entrega a Home no fluxo 100% nativo
  if (shouldReduceMotion || isEntered) {
    return <div className="w-full relative">{children}</div>;
  }

  const handleEnter = () => {
    if (isEntering || isEntered) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setIsEntering(true);

    // Duração sincronizada com a animação suave de saída do card
    setTimeout(() => {
      setIsEntered(true);
      document.body.style.overflow = "";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 950);
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Camada de Abertura com Fundo Vermelho Bem Claro e Card Sofisticado */}
      <AnimatePresence>
        {!isEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={isEntering ? { opacity: 0 } : { opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-red-50/95 sm:bg-red-50 px-4 select-none overflow-hidden"
          >
            {/* Card Minimalista e Sofisticado seguindo exatamente a referência visual */}
            <motion.div
              initial={{ scale: 1, opacity: 1, y: 0 }}
              animate={
                isEntering
                  ? { scale: 2.2, opacity: 0, y: -20 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-[36px] sm:rounded-[48px] px-8 py-10 sm:px-14 sm:py-14 shadow-2xl shadow-red-950/5 border border-red-100/60 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Ícone com Escudo Oficial Seguraê */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-50/80 border border-red-100/90 flex items-center justify-center p-3 mb-4 shadow-xs">
                <img
                  src="https://ik.imagekit.io/JohnnieDiniz/segurae/escudo-segurade%20(1).svg"
                  alt="Escudo Seguraê"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Nome da Marca com Ponto Vermelho */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                Seguraê<span className="text-red-600">.</span>
              </h1>

              {/* Badge da Categoria */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 mt-3 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                SEGUROS & PROTEÇÃO VEICULAR
              </div>

              {/* Slogan */}
              <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed max-w-md mb-8">
                Proteção veicular inteligente, 100% digital e sem burocracia
                <br className="hidden sm:inline" /> para você e seu veículo.
              </p>

              {/* Botão Vermelho com Sombra Suave e Ícone de Seta */}
              <button
                type="button"
                onClick={handleEnter}
                disabled={isEntering}
                className="px-10 sm:px-12 py-3.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-[0_10px_28px_rgba(220,38,38,0.38)] hover:shadow-[0_14px_32px_rgba(220,38,38,0.48)] transition-all duration-300 flex items-center justify-center gap-2.5 group cursor-pointer mb-5 disabled:pointer-events-none"
              >
                <span>Acessar o Site</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Rodapé do Card com Selo de Segurança */}
              <div className="text-xs text-zinc-400 font-medium flex items-center justify-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-emerald-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Ambiente 100% seguro e digital</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo da Home no fluxo natural, sem transform nem filter que corte a Navbar */}
      <div className="w-full relative z-10">
        {children}
      </div>
    </div>
  );
}