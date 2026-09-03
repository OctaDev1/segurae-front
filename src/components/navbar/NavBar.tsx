import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { text: 'Início', to: '/' },
  { text: 'Coberturas', to: '/coberturas' },
  { text: 'Serviços', to: '/servicos' },
  { text: 'Contato', to: '/contato' },
];

function Navbar() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl bg-white/90 backdrop-blur-md shadow-xl border border-zinc-200/60 rounded-full px-6 py-3 flex items-center justify-between z-100 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-32'
      }`}
    >
      <Link to="/" className="flex items-center shrink-0">
        <img
          src="https://ik.imagekit.io/JohnnieDiniz/segurae/escudo-segurade%20(1).svg"
          alt="Logo"
          className="w-8 h-8"
        />
        <span className="text-2xl font-bold text-zinc-900 ml-3 tracking-tight">
          Seguraê
        </span>
      </Link>

      <ul className="hidden lg:flex items-center gap-x-8">
        {links.map((link) => (
          <li key={link.text}>
            <Link
              to={link.to}
              className={`text-[15px] font-medium transition-colors duration-200 ${
                location.pathname === link.to
                  ? 'text-red-600'
                  : 'text-zinc-700 hover:text-zinc-900'
              }`}
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        to="/login"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex shrink-0 bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-6 py-2.5 rounded-full transition-colors duration-200 shadow-md shadow-red-600/20"
      >
        Área do Cliente
      </Link>
    </nav>
  );
}

export default Navbar;