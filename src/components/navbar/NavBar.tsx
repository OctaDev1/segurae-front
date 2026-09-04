import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ToastAlerta } from '../../utils/toastalerta/ToastAlerta';

const links = [
  { text: 'Início', to: '/' },
  { text: 'Coberturas', to: '/coberturas' },
  { text: 'Serviços', to: '/servicos' },
  { text: 'Contato', to: '/contato' },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, handleLogout } = useContext(AuthContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsMenuOpen(false); // Fecha o submenu ao rolar a página
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar o submenu ao clicar fora ou ao pressionar Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Fechar o submenu na mudança de rota
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsMenuOpen(false);
  }

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const isAutenticado = Boolean(usuario && usuario.token && usuario.token.trim() !== '');
  const isCliente = isAutenticado && (usuario.perfil === 'ROLE_CLIENTE' || usuario.perfil === 'cliente');
  const isCorretor = isAutenticado && (usuario.perfil === 'ROLE_CORRETOR' || usuario.perfil === 'corretor');

  // 1. Opção "Entrar"
  const handleEntrar = () => {
    setIsMenuOpen(false);
    if (!isAutenticado) {
      navigate('/login');
    } else if (isCorretor) {
      ToastAlerta('Você já está autenticado como Corretor.', 'info');
      navigate('/corretor');
    } else {
      ToastAlerta('Você já está autenticado como Cliente.', 'info');
      navigate('/apolices');
    }
  };

  // 2. Opção "Área do Cliente"
  const handleAreaCliente = () => {
    setIsMenuOpen(false);
    if (!isAutenticado) {
      ToastAlerta('Faça login como Cliente para acessar a Área do Cliente.', 'info');
      navigate('/login');
    } else if (isCliente) {
      navigate('/apolices');
    } else {
      ToastAlerta('Acesso negado: Seu perfil é de Corretor e não possui permissão para a Área do Cliente.', 'erro');
    }
  };

  // 3. Opção "Área do Corretor"
  const handleAreaCorretor = () => {
    setIsMenuOpen(false);
    if (!isAutenticado) {
      ToastAlerta('Faça login como Corretor para acessar a Área do Corretor.', 'info');
      navigate('/login');
    } else if (isCorretor) {
      navigate('/corretor');
    } else {
      ToastAlerta('Acesso negado: Seu perfil é de Cliente e não possui permissão para a Área do Corretor.', 'erro');
    }
  };

  // 4. Opção "Sair"
  const handleSair = () => {
    setIsMenuOpen(false);
    handleLogout();
    navigate('/');
  };

  return (
    <nav
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl bg-white/90 backdrop-blur-md shadow-xl border border-zinc-200/60 rounded-full px-4 sm:px-6 py-3 flex items-center justify-between z-[100] transition-all duration-300"
    >
      <Link to="/" className="flex items-center shrink-0">
        <img
          src="https://ik.imagekit.io/JohnnieDiniz/segurae/escudo-segurade%20(1).svg"
          alt="Logo"
          className="w-8 h-8"
        />
        <span className="text-xl sm:text-2xl font-bold text-zinc-900 ml-2 sm:ml-3 tracking-tight">
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

      {/* Dropdown "Sua conta" */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-red-600 hover:bg-red-700 text-white font-medium text-xs sm:text-sm px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-200 shadow-md shadow-red-600/20 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600/40 select-none"
        >
          <span>Sua conta</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 transition-transform duration-200 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Submenu Dropdown com exatamente 4 opções */}
        {isMenuOpen && (
          <div
            className="absolute right-0 top-full mt-3 w-56 sm:w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-zinc-900/10 border border-zinc-200/70 p-2 z-[110] animate-in fade-in zoom-in-95 duration-150 origin-top-right space-y-1"
            role="menu"
            aria-orientation="vertical"
          >
            {/* Opção 1: Entrar */}
            <button
              type="button"
              onClick={handleEntrar}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-xl transition-colors text-left cursor-pointer group"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-red-50 text-zinc-600 group-hover:text-red-600 flex items-center justify-center transition-colors shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
              </div>
              <div>
                <span className="block font-semibold">Entrar</span>
                <span className="block text-[11px] text-zinc-400 font-normal">
                  Acesse sua conta
                </span>
              </div>
            </button>

            {/* Opção 2: Área do Cliente */}
            <button
              type="button"
              onClick={handleAreaCliente}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-xl transition-colors text-left cursor-pointer group"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-red-50 text-zinc-600 group-hover:text-red-600 flex items-center justify-center transition-colors shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-13.5 18v-2.25z"
                  />
                </svg>
              </div>
              <div>
                <span className="block font-semibold">Área do Cliente</span>
                <span className="block text-[11px] text-zinc-400 font-normal">
                  Minhas apólices e coberturas
                </span>
              </div>
            </button>

            {/* Opção 3: Área do Corretor */}
            <button
              type="button"
              onClick={handleAreaCorretor}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-xl transition-colors text-left cursor-pointer group"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-red-50 text-zinc-600 group-hover:text-red-600 flex items-center justify-center transition-colors shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div>
                <span className="block font-semibold">Área do Corretor</span>
                <span className="block text-[11px] text-zinc-400 font-normal">
                  Gestão de apólices
                </span>
              </div>
            </button>

            {/* Opção 4: Sair */}
            <button
              type="button"
              onClick={handleSair}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm font-medium text-zinc-700 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-colors text-left cursor-pointer group"
              role="menuitem"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-red-100/70 text-zinc-600 group-hover:text-red-600 flex items-center justify-center transition-colors shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
              </div>
              <div>
                <span className="block font-semibold">Sair</span>
                <span className="block text-[11px] text-zinc-400 font-normal">
                  Encerrar sessão
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;