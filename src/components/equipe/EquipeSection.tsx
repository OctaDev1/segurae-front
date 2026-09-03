import { useRef, useEffect } from "react";
import { TEAM_MEMBERS } from "../../data/TeamData"; // Ajuste o caminho se necessário

export default function EquipeSection() {
  const teamCarouselRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = clientWidth * 0.75;
      ref.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // AUTOMATIZAÇÃO DO CARROSSEL: Roda a cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (teamCarouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = teamCarouselRef.current;
        
        // Se chegou no final do carrossel, volta para o início (0). Se não, avança um pouco.
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          teamCarouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          teamCarouselRef.current.scrollTo({ left: scrollLeft + 350, behavior: 'smooth' });
        }
      }
    }, 4000); // 4000ms = 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full bg-white py-24 px-6 lg:px-16 relative overflow-hidden border-t border-zinc-100">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-red-100">
              Nossa Equipe
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mb-3">
              Quem constrói o Seguraê
            </h2>
            <p className="text-zinc-600 text-base sm:text-lg max-w-xl">
              Conheça as pessoas e os parceiros dedicados a garantir a sua tranquilidade no trânsito.
            </p>
          </div>

          {/* Botões de Navegação do Carrossel */}
          <div className="flex gap-3">
            <button 
              onClick={() => scroll(teamCarouselRef, 'left')} 
              className="p-3 bg-white border border-zinc-200 rounded-full text-zinc-700 hover:text-white hover:border-red-600 hover:bg-red-600 transition-all shadow-sm cursor-pointer"
              aria-label="Rolar para esquerda"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button 
              onClick={() => scroll(teamCarouselRef, 'right')} 
              className="p-3 bg-white border border-zinc-200 rounded-full text-zinc-700 hover:text-white hover:border-red-600 hover:bg-red-600 transition-all shadow-sm cursor-pointer"
              aria-label="Rolar para direita"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        {/* Carrossel de Cards da Equipe usando os dados */}
        <div 
          ref={teamCarouselRef} 
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
        >
          {TEAM_MEMBERS.map((member, index) => (
            <div 
              key={index} 
              className="snap-start shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-zinc-50 rounded-3xl border border-zinc-100 overflow-hidden shadow-lg shadow-zinc-100 flex flex-col justify-between"
            >
              <div className="h-64 w-full overflow-hidden bg-zinc-100">
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105" 
                />
              </div>
              <div className="p-8 flex flex-col justify-between grow">
                <div>
                  <span className="text-red-600 font-bold text-xs uppercase tracking-widest mb-1 block">
                    {member.role}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">
                    {member.name}
                  </h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}