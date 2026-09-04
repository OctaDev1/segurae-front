import { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastAlerta } from '../../utils/toastalerta/ToastAlerta';
import {
  Car,
  Briefcase,
  LockKey,
  User,
  Eye,
  EyeSlash,
  ArrowRight,
  Lightning,
  Headset,
  ShieldCheck,
  ArrowLeft,
  Key,
} from '@phosphor-icons/react';
import { AuthContext } from '../../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin: authLogin, isLoading: authLoading } = useContext(AuthContext);

  // ==========================================
  // ESTADOS DO FORMULÁRIO
  // ==========================================

  // 1. Tipo de login ativo: 'cliente' (segurado) ou 'corretor'
  const stateTipo = (location.state as { tipoAcesso?: 'cliente' | 'corretor' } | null)?.tipoAcesso;
  const [tipoAcessoManual, setTipoAcessoManual] = useState<'cliente' | 'corretor' | null>(null);
  const tipoAcesso = tipoAcessoManual ?? stateTipo ?? 'cliente';
  const setTipoAcesso = (tipo: 'cliente' | 'corretor') => setTipoAcessoManual(tipo);

  // 2. Campo de identificação (E-mail ou Usuário)
  const [identificador, setIdentificador] = useState('');

  // 3. Campo de senha
  const [senha, setSenha] = useState('');

  // 4. Alternar entre mostrar ou esconder a senha
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // 5. Opção de lembrar dispositivo / acesso
  const [lembrarDispositivo, setLembrarDispositivo] = useState(true);

  // 6. Estado de carregamento do botão ao enviar
  const [carregando, setCarregando] = useState(false);

  // 7. Mensagem de erro para validações simples
  const [erro, setErro] = useState('');

  // Se já estiver logado, redireciona para o painel correspondente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const perfil = localStorage.getItem('perfil');
    if (token) {
      if (perfil === 'ROLE_CORRETOR') {
        navigate('/dashboard/corretor');
      } else {
        navigate('/dashboard/cliente');
      }
    }
  }, [navigate]);

  // ==========================================
  // FUNÇÕES DE SUBMISSÃO COM VALIDAÇÃO CRUZADA
  // ==========================================

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica dos campos
    if (!identificador.trim()) {
      setErro(
        tipoAcesso === 'cliente'
          ? 'Por favor, digite seu E-mail de cliente.'
          : 'Por favor, digite seu E-mail profissional ou SUSEP.'
      );
      return;
    }

    if (!senha.trim()) {
      setErro('Por favor, digite sua senha de acesso.');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      const perfilDesejado = tipoAcesso === 'corretor' ? 'ROLE_CORRETOR' : 'ROLE_CLIENTE';
      const response = await authLogin({
        id: 0,
        nome: '',
        usuario: identificador.trim(),
        email: identificador.trim(),
        senha: senha,
        foto: '',
        token: '',
        perfil: perfilDesejado,
      });

      if (!response || !response.token) {
        setErro('Credenciais inválidas. Verifique seu usuário e senha.');
        setCarregando(false);
        return;
      }

      const perfil = response.perfil || localStorage.getItem('perfil') || perfilDesejado;

      // ==========================================
      // VALIDAÇÃO CRUZADA E REDIRECIONAMENTO INTELIGENTE
      // ==========================================
      if (tipoAcesso === 'cliente') {
        if (perfil === 'ROLE_CORRETOR') {
          ToastAlerta(
            'Perfil de Corretor identificado! Redirecionando para o Painel do Corretor...',
            'info'
          );
          navigate('/dashboard/corretor');
        } else {
          ToastAlerta('Bem-vindo ao Painel do Segurado!', 'sucesso');
          navigate('/dashboard/cliente');
        }
      } else {
        // tipoAcesso === 'corretor'
        if (perfil === 'ROLE_CLIENTE') {
          ToastAlerta(
            'Perfil de Cliente identificado! Redirecionando para o Painel do Segurado...',
            'info'
          );
          navigate('/dashboard/cliente');
        } else {
          ToastAlerta('Bem-vindo ao Painel do Corretor Parceiro!', 'sucesso');
          navigate('/dashboard/corretor');
        }
      }
    } catch {
      setErro('Erro ao processar login. Verifique seus dados e tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Função para simular o login com o Google
  const handleGoogleLogin = () => {
    alert('Login social com o Google em processo de integração!');
  };

  return (
    // Fundo neutro e moderno da página
    <div className="min-h-screen w-full bg-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">

      {/* Barra superior de navegação para voltar à Home */}
      <div className="w-full max-w-5xl mb-4 flex items-center justify-between text-zinc-600 text-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-2 hover:text-red-600 transition-colors duration-200 font-medium"
        >
          <ArrowLeft size={18} weight="bold" />
          <span>Voltar ao site</span>
        </Link>
        <span className="text-xs text-zinc-400 font-medium">
          Seguraê • Portal de Acesso
        </span>
      </div>

      {/* CARD PRINCIPAL (DESIGN DE 2 COLUNAS PREENCHIDO E ELEGANTE) */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-zinc-300/60 border border-zinc-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">

        {/* ========================================================= */}
        {/* COLUNA ESQUERDA: APRESENTAÇÃO INSTITUCIONAL (DARK)        */}
        {/* ========================================================= */}
        <div
          className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-between relative text-white bg-zinc-950 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(12, 14, 18, 0.76), rgba(9, 10, 14, 0.95)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div>
            {/* Topo: Logo Seguraê e Badge de Atendimento */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <img
                  src="https://ik.imagekit.io/JohnnieDiniz/segurae/escudo-segurade%20(1).svg"
                  alt="Logo Seguraê"
                  className="w-9 h-9"
                />
                <div>
                  <h2 className="text-lg font-black tracking-wider leading-none">SEGURAÊ</h2>
                  <span className="text-[10px] text-zinc-400 font-semibold tracking-widest uppercase">
                    Seguro Inteligente
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs text-zinc-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Atendimento 24h</span>
              </div>
            </div>

            {/* Badge de Portal */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/25 border border-red-500/40 text-red-400 text-xs font-semibold mb-6">
              <ShieldCheck size={16} weight="fill" />
              <span>Portal Unificado de Serviços</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4">
              Sua tranquilidade sob controle em qualquer trajeto.
            </h1>

            {/* Subtítulo */}
            <p className="text-zinc-300 text-sm leading-relaxed mb-8">
              Acesse suas apólices em tempo real, acione assistência emergencial, acompanhe sinistros e consulte pagamentos com rapidez e total autonomia.
            </p>

            {/* Cards de Destaque / Diferenciais (Preenchem o visual) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 backdrop-blur-md flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightning size={18} weight="fill" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Assistência 1-Clique</h4>
                  <p className="text-[11px] text-zinc-400">Guincho & chaveiro 24h</p>
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 backdrop-blur-md flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <LockKey size={18} weight="fill" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Dados Protegidos</h4>
                  <p className="text-[11px] text-zinc-400">Criptografia de ponta</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé da coluna esquerda: Suporte e Status */}
          <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Headset size={16} className="text-red-500" weight="bold" />
              <span>
                Central de Sinistro: <strong className="text-white font-semibold">0800 700 8020</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Operação Normal</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUNA DIREITA: FORMULÁRIO COM 2 OPÇÕES DE LOGIN          */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-between bg-white text-zinc-900">
          <div>
            {/* Topo do Formulário: Tag de Acesso Seguro */}
            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
                <Key size={14} weight="bold" />
                <span>Acesso Seguro</span>
              </span>
              <span className="text-xs text-zinc-400 font-medium">Seguraê Auto</span>
            </div>

            {/* Cabeçalho */}
            <h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mb-6">
              Selecione seu perfil e informe seus dados para acessar sua conta.
            </p>

            {/* ABAS DE LOGIN: CLIENTE / SEGURADO vs CORRETOR */}
            <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setTipoAcesso('cliente');
                  setErro('');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${tipoAcesso === 'cliente'
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
                  : 'text-zinc-500 hover:text-zinc-900'
                  }`}
              >
                <Car
                  size={18}
                  weight="fill"
                  className={tipoAcesso === 'cliente' ? 'text-red-600' : 'text-zinc-400'}
                />
                <span>Sou Cliente</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipoAcesso('corretor');
                  setErro('');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${tipoAcesso === 'corretor'
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/80'
                  : 'text-zinc-500 hover:text-zinc-900'
                  }`}
              >
                <Briefcase
                  size={18}
                  weight="fill"
                  className={tipoAcesso === 'corretor' ? 'text-red-600' : 'text-zinc-400'}
                />
                <span>Sou Corretor</span>
              </button>
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {erro}
              </div>
            )}

            {/* Formulário de Login */}
            <form onSubmit={handleLogin} className="space-y-4">

              {/* Campo 1: Identificador (muda o texto conforme o perfil selecionado) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  {tipoAcesso === 'cliente' ? 'E-mail cadastrado' : 'Código SUSEP ou E-mail profissional'}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-zinc-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    placeholder={
                      tipoAcesso === 'cliente'
                        ? 'seu@email.com'
                        : 'SUSEP ou corretor@email.com'
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Campo 2: Senha */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-700">
                    Senha de acesso
                  </label>
                  <a
                    href="#esqueci-senha"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Enviamos o link de recuperação de senha para o e-mail cadastrado.');
                    }}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-zinc-400">
                    <LockKey size={18} />
                  </span>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3.5 text-zinc-400 hover:text-zinc-600 focus:outline-none cursor-pointer"
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {mostrarSenha ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Opção Lembrar Dispositivo */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-600 font-medium">
                  <input
                    type="checkbox"
                    checked={lembrarDispositivo}
                    onChange={(e) => setLembrarDispositivo(e.target.checked)}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                  />
                  <span>Lembrar dispositivo</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Precisa de ajuda? Entre em contato pelo WhatsApp (11) 99999-9999.')}
                  className="text-zinc-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                >
                  Ajuda para acessar?
                </button>
              </div>

              {/* Botão Entrar na Conta */}
              <button
                type="submit"
                disabled={carregando || authLoading}
                className="w-full mt-2 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 cursor-pointer"
              >
                {carregando || authLoading ? (
                  <span>Acessando...</span>
                ) : (
                  <>
                    <span>Entrar na Conta</span>
                    <ArrowRight size={18} weight="bold" />
                  </>
                )}
              </button>

              {/* Separador "ou" */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-zinc-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-zinc-400 uppercase font-semibold absolute">
                  ou
                </span>
              </div>

              {/* Botão de Login com Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 transition-colors duration-200 flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar com Google</span>
              </button>
            </form>
          </div>

          {/* Rodapé do formulário: Link para cotação e selo de segurança */}
          <div className="pt-6 mt-6 border-t border-zinc-100 text-center space-y-2">
            <p className="text-xs text-zinc-600">
              Ainda não é cliente?{' '}
              <Link to="/cadastro" className="text-red-600 font-bold hover:underline">
                Criar conta &gt;
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
              <ShieldCheck size={14} weight="bold" />
              <span>Ambiente 100% seguro • Certificado SSL 256 bits</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}