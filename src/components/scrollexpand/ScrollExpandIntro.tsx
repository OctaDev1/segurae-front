import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollExpandIntroProps {
  children: ReactNode;
}

export default function ScrollExpandIntro({ children }: ScrollExpandIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  
  // A caixa cresce do início (0) ao fim (1)
  const width = useTransform(scrollYProgress, [0, 1], ["30vw", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 1], ["30vh", "100vh"]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["50px", "0px"]);
  
  // MUDANÇA AQUI:
  // [0, 0.7, 1] significa: do início (0) até 70% do scroll (0.7), o valor não muda. 
  // Ele só altera nos 30% finais (de 0.7 até 1).
  const tituloOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const tituloY = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0, -50]); // Desliza pra cima no final

  // A Home fica invisível até 70% e aparece nos 30% finais
  const homeOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0, 1]);

  return (
    <div ref={containerRef} className="h-[200vh] bg-[#8D99AE] w-full relative z-50">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        <motion.div
          style={{ width, height, borderRadius }}
          className="bg-zinc-50 relative overflow-hidden shadow-2xl flex flex-col"
        >
          
          {/* CAMADA 1: TÍTULO SEGURAÊ (Agora com o y: tituloY) */}
          <motion.div
            style={{ opacity: tituloOpacity, y: tituloY }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <h1 className="text-5xl md:text-8xl font-black text-zinc-900 tracking-tighter">
              seguraê.
            </h1>
          </motion.div>

          {/* CAMADA 2: A SUA HOME */}
          <motion.div
            style={{ opacity: homeOpacity }}
            className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden z-10"
          >
            {children}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}