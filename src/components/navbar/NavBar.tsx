import { Link, useLocation } from 'react-router-dom';

const links = [
  { text: 'Início', to: '/' },
  { text: 'Coberturas', to: '/coberturas' },
  { text: 'Serviços', to: '/servicos' },
  { text: 'Depoimentos', to: '/depoimentos' },
  { text: 'FAQ', to: '/faq' },
  { text: 'Contato', to: '/contato' },
];

function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm px-6 lg:px-16 py-4 flex items-center justify-between z-50">
      <Link to="/" className="flex items-center">
        <img src="https://ik.imagekit.io/JohnnieDiniz/segurae/escudo-segurade%20(1).svg" alt="Logo" className="w-8 h-8" />
        <span className="text-2xl font-bold text-zinc-900 ml-4 tracking-tight">Seguraê</span>
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
        to="/contato"
        className="hidden lg:flex bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-colors duration-200 shadow-md shadow-red-600/20"
      >
        Fale com Consultor
      </Link>
    </nav>
  );
}

export default Navbar;