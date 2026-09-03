import { useRef } from "react";

const depoimentos = [
  { 
    company: "Segurado há 2 anos", 
    quote: "Precisei acionar o guincho de madrugada em uma rodovia e o atendimento foi impecável. Em menos de 30 minutos a equipe estava lá para me ajudar.", 
    author: "Carlos Mendes", 
    role: "Proprietário de Honda Civic" 
  },
  { 
    company: "Cliente Seguraê", 
    quote: "A facilidade de fazer a cotação pela internet e fechar na hora me chamou atenção. Sem burocracia e com um preço justo que cabe no bolso.", 
    author: "Ana Beatriz", 
    role: "Motorista de App" 
  },
  { 
    company: "Cliente Protegido", 
    quote: "O controle de assistência 24h e a cobertura de terceiros me dão total tranquilidade para rodar com a família por todo o Brasil.", 
    author: "Fernando Costa", 
    role: "Empresário" 
  }
];

export default function DepoimentosSection() {
  const testimonialCarouselRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="w-full bg-zinc-50 py-24 px-6 lg:px-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-red-100">
              Depoimentos
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mb-3">
              Quem usa o Seguraê, recomenda
            </h2>
            <p className="text-zinc-600 text-base sm:text-lg max-w-xl">
              Veja como estamos transformando a experiência de proteção veicular dos nossos clientes no dia a dia.
            </p>
          </div>

          {/* Botões de Navegação do Carrossel */}
          <div className="flex gap-3">
            <button 
              onClick={() => scroll(testimonialCarouselRef, 'left')} 
              className="p-3 bg-white border border-zinc-200 rounded-full text-zinc-700 hover:text-white hover:border-red-600 hover:bg-red-600 transition-all shadow-sm cursor-pointer"
              aria-label="Rolar para esquerda"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button 
              onClick={() => scroll(testimonialCarouselRef, 'right')} 
              className="p-3 bg-white border border-zinc-200 rounded-full text-zinc-700 hover:text-white hover:border-red-600 hover:bg-red-600 transition-all shadow-sm cursor-pointer"
              aria-label="Rolar para direita"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        {/* Carrossel de Cards */}
        <div 
          ref={testimonialCarouselRef} 
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
        >
          {depoimentos.map((test, index) => (
            <div 
              key={index} 
              className="snap-start shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white p-8 rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-100 flex flex-col justify-between"
            >
              <div>
                <div className="text-red-600 font-bold text-xs uppercase tracking-widest mb-4">
                  {test.company}
                </div>
                <p className="text-zinc-700 text-base leading-relaxed mb-6">
                  "{test.quote}"
                </p>
              </div>
              <div className="border-t border-zinc-100 pt-4 mt-2">
                <p className="font-bold text-zinc-900 text-sm">{test.author}</p>
                <p className="text-xs text-zinc-500 font-medium">{test.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}