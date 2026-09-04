export default function Footer() {
  return (
    <footer className="w-full pt-6 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-red-700 mt-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs sm:text-sm">
        
        {/* Logo e Nome */}
        <div className="flex items-center gap-2 font-semibold text-red-700">
          <img
            src="https://ik.imagekit.io/JohnnieDiniz/segurae/escudo-segurade%20(1).svg"
            alt="Logo Seguraê"
            className="w-5 h-5 object-contain"
          />
          Seguraê
        </div>

        {/* Copyright */}
        <p className="font-medium text-center md:text-left">
          © 2026 Seguraê. Todos os direitos reservados.
        </p>

        {/* Links de Termos e Privacidade */}
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-white transition-colors">Termos</a>
          <a href="#" className="hover:text-white transition-colors">Privacidade</a>
        </div>

      </div>
    </footer>
  );
}