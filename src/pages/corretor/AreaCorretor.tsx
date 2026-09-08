import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Car,
  MagnifyingGlass,
  Plus,
  PencilSimple,
  Trash,
  Eye,
  CheckCircle,
  WarningCircle,
  Clock,
  X,
  SignOut,
  ArrowCounterClockwise,
  User,
  CurrencyDollar,
  FileText,
  Table,
  SquaresFour,
  ArrowLeft,
  Check,
  UserPlus,
  Users,
} from '@phosphor-icons/react';
import { AuthContext } from '../../contexts/AuthContext';
import type Apolice from '../../models/Apolice';
import type Cliente from '../../models/Cliente';
import { buscar, cadastrar, atualizar, deletar } from '../../services/Service';
import { ToastAlerta } from '../../utils/toastalerta/ToastAlerta';

const getAuthHeader = (token?: string) => {
  const tokenFinal = token || localStorage.getItem('token') || '';
  if (!tokenFinal) return {};
  const tokenFormatado = tokenFinal.startsWith('Bearer ') ? tokenFinal : `Bearer ${tokenFinal}`;
  return { headers: { Authorization: tokenFormatado } };
};

const PLANOS_SEGURO = [
  { nome: 'Essencial (Roubo e Furto)', desc: '100% Tabela FIPE, Furto qualificado e Assistência 24h básica', valor: 1850, tag: 'MAIS ECONÔMICO' },
  { nome: 'Completo (Colisão e Terceiros)', desc: 'Colisão total/parcial, danos a terceiros, guincho ilimitado e carro reserva', valor: 2950, tag: 'MAIS POPULAR' },
  { nome: 'Premium VIP (Proteção Total)', desc: 'Proteção total sem franquia para vidros/faróis e carro reserva executivo', valor: 4250, tag: 'MÁXIMA PROTEÇÃO' },
];

interface FormApoliceData {
  id?: number;
  numeroApolice: string;
  bemSegurado: string;
  marcaModelo: string;
  anoModelo: number | string;
  placa: string;
  renavam: string;
  valorApolice: number | string;
  tipoCobertura: string;
  dataInicio: string;
  dataTermino: string;
  statusApolice: number;
  clienteId: number | string;
}

const FORM_APOLICE_INICIAL: FormApoliceData = {
  numeroApolice: '',
  bemSegurado: 'Automóvel Passeio',
  marcaModelo: '',
  anoModelo: new Date().getFullYear(),
  placa: '',
  renavam: '',
  valorApolice: 2950,
  tipoCobertura: 'Completo (Colisão e Terceiros)',
  dataInicio: new Date().toISOString().split('T')[0],
  dataTermino: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    .toISOString()
    .split('T')[0],
  statusApolice: 1,
  clienteId: '',
};

interface FormClienteData {
  nomeCompleto: string;
  email: string;
  cpfCnpj: string;
  dataNascimento: string;
}

const FORM_CLIENTE_INICIAL: FormClienteData = {
  nomeCompleto: '',
  email: '',
  cpfCnpj: '',
  dataNascimento: '1990-01-01',
};

// Validação de Maioridade (18 anos)
const validarMaioridade = (dataNascimentoStr: string): boolean => {
  if (!dataNascimentoStr) return false;
  const hoje = new Date();
  const nascimento = new Date(dataNascimentoStr);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade >= 18;
};

export default function AreaCorretor() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { usuario, handleLogout } = useContext(AuthContext);

  const abaParam = searchParams.get('aba');
  const [abaAtiva, setAbaAtiva] = useState<'apolices' | 'clientes'>(
    abaParam === 'clientes' ? 'clientes' : 'apolices'
  );

  useEffect(() => {
    setSearchParams(abaAtiva === 'clientes' ? { aba: 'clientes' } : {});
  }, [abaAtiva, setSearchParams]);

  const isAutenticado = Boolean(usuario && usuario.token && usuario.token.trim() !== '');
  const isCorretor = isAutenticado && (usuario.perfil === 'ROLE_CORRETOR' || usuario.perfil === 'corretor');

  useEffect(() => {
    if (!isAutenticado) {
      ToastAlerta('Você precisa estar logado para acessar a Área do Corretor.', 'info');
      navigate('/login', { state: { tipoAcesso: 'corretor' }, replace: true });
    } else if (!isCorretor) {
      ToastAlerta('Acesso negado: Seu perfil é de Cliente.', 'erro');
      navigate('/apolices', { replace: true });
    }
  }, [isAutenticado, isCorretor, navigate]);

  const [apolices, setApolices] = useState<Apolice[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [statusApi, setStatusApi] = useState<'online' | 'offline' | 'verificando'>('verificando');

  const [busca, setBusca] = useState('');
  const [buscaCliente, setBuscaCliente] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativas' | 'vencidas' | 'pendentes'>('todas');
  const [viewMode, setViewMode] = useState<'tabela' | 'cards'>('tabela');

  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [modalClienteAberto, setModalClienteAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [modalExcluirClienteAberto, setModalExcluirClienteAberto] = useState(false);

  const [formData, setFormData] = useState<FormApoliceData>(FORM_APOLICE_INICIAL);
  const [formCliente, setFormCliente] = useState<FormClienteData>(FORM_CLIENTE_INICIAL);

  const [apoliceSelecionada, setApoliceSelecionada] = useState<Apolice | null>(null);
  const [apoliceParaExcluir, setApoliceParaExcluir] = useState<Apolice | null>(null);
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);

  const [erroForm, setErroForm] = useState('');
  const [erroCliente, setErroCliente] = useState('');

  const carregarDadosApi = useCallback(async () => {
    setCarregando(true);
    try {
      const header = getAuthHeader(usuario?.token);
      
      const [resApolices, resClientes] = await Promise.all([
        buscar('/apolices', undefined, header).catch(() => []),
        buscar('/clientes', undefined, header).catch(() => [])
      ]);

      if (Array.isArray(resApolices)) {
        setApolices(resApolices);
      }
      if (Array.isArray(resClientes)) {
        setClientes(resClientes);
      }
      setStatusApi('online');
    } catch {
      setStatusApi('offline');
      ToastAlerta('Erro ao carregar dados do servidor Render.', 'erro');
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  useEffect(() => {
    if (isAutenticado && isCorretor) {
      carregarDadosApi();
    }
  }, [isAutenticado, isCorretor, carregarDadosApi]);

  const formatarMoeda = (valor: number) => {
    return Number(valor || 0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatarData = (dataStr?: string) => {
    if (!dataStr) return '-';
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
  };

  const stats = useMemo(() => {
    const total = apolices.length;
    const ativas = apolices.filter((a) => a.statusApolice === 1).length;
    const vencidas = apolices.filter((a) => a.statusApolice === 2).length;
    const pendentes = apolices.filter((a) => a.statusApolice === 0).length;
    const valorTotal = apolices.reduce((acc, curr) => acc + (Number(curr.valorApolice) || 0), 0);
    return { total, ativas, vencidas, pendentes, valorTotal };
  }, [apolices]);

  const statsClientes = useMemo(() => {
    const total = clientes.length;
    const clientesComApolicesIds = new Set(apolices.map((a) => a.cliente?.id).filter(Boolean));
    const comApolices = clientes.filter((c) => c.id && clientesComApolicesIds.has(c.id)).length;
    const semApolices = total - comApolices;
    return { total, comApolices, semApolices };
  }, [clientes, apolices]);

  const apolicesFiltradas = useMemo(() => {
    return apolices.filter((apolice) => {
      const termo = busca.toLowerCase().trim();
      const bateTexto =
        !termo ||
        apolice.numeroApolice?.toLowerCase().includes(termo) ||
        apolice.marcaModelo?.toLowerCase().includes(termo) ||
        apolice.placa?.toLowerCase().includes(termo) ||
        apolice.cliente?.nomeCompleto?.toLowerCase().includes(termo) ||
        apolice.cliente?.cpfCnpj?.toLowerCase().includes(termo) ||
        apolice.tipoCobertura?.toLowerCase().includes(termo);

      if (!bateTexto) return false;

      if (filtroStatus === 'ativas') return apolice.statusApolice === 1;
      if (filtroStatus === 'vencidas') return apolice.statusApolice === 2;
      if (filtroStatus === 'pendentes') return apolice.statusApolice === 0;
      return true;
    });
  }, [apolices, busca, filtroStatus]);

  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      const termo = buscaCliente.toLowerCase().trim();
      return (
        !termo ||
        cliente.nomeCompleto?.toLowerCase().includes(termo) ||
        cliente.email?.toLowerCase().includes(termo) ||
        cliente.cpfCnpj?.toLowerCase().includes(termo)
      );
    });
  }, [clientes, buscaCliente]);

  const handleNovaApolice = () => {
    const codigoAleatorio = Math.random().toString(36).substring(2, 8).toUpperCase();
    const ano = new Date().getFullYear();
    setFormData({
      ...FORM_APOLICE_INICIAL,
      numeroApolice: `SEG-${ano}-${codigoAleatorio}`,
      clienteId: clientes[0]?.id ?? '',
    });
    setErroForm('');
    setModalFormAberto(true);
  };

  const handleNovoCliente = () => {
    setFormCliente(FORM_CLIENTE_INICIAL);
    setErroCliente('');
    setModalClienteAberto(true);
  };

  const handleSalvarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroCliente('');

    if (!formCliente.nomeCompleto.trim() || !formCliente.email.trim() || !formCliente.cpfCnpj.trim()) {
      setErroCliente('Preencha todos os campos obrigatórios do cliente.');
      return;
    }

    if (!validarMaioridade(formCliente.dataNascimento)) {
      setErroCliente('O cliente deve ser maior de 18 anos para ser cadastrado.');
      ToastAlerta('Cadastro não permitido: Menores de 18 anos não podem ser segurados.', 'erro');
      return;
    }

    setSalvando(true);

    const primeiroNome = formCliente.nomeCompleto.trim().split(' ')[0].toLowerCase();
    const senhaGerada = `${primeiroNome}1234`;
    const emailLimpo = formCliente.email.trim();

    // Payload ajustado para alinhar com o padrão de Usuário/Cliente da API Spring Boot
    const clientePayload = {
      nomeCompleto: formCliente.nomeCompleto.trim(),
      email: emailLimpo,
      cpfCnpj: formCliente.cpfCnpj.replace(/\D/g, ''),
      dataNascimento: formCliente.dataNascimento || '1990-01-01',
      usuario: {
        id: null,
        nome: formCliente.nomeCompleto.trim(),
        usuario: emailLimpo, // O campo 'usuario' geralmente armazena o e-mail de login
        senha: senhaGerada,
        perfil: 'ROLE_CLIENTE',
        foto: ''
      }
    };

    try {
      if (!usuario?.token) {
        ToastAlerta('Sessão expirada. Faça login novamente.', 'info');
        navigate('/login');
        return;
      }

      const header = getAuthHeader(usuario.token);

      await cadastrar('/clientes/cadastrar', clientePayload, () => undefined, header);
      
      ToastAlerta(`Cliente cadastrado! Senha de acesso: ${senhaGerada}`, 'sucesso');
      setModalClienteAberto(false);
      carregarDadosApi();
      setFormCliente(FORM_CLIENTE_INICIAL);
    } catch (error: any) {
      console.error('Erro ao cadastrar cliente na API:', error);
      const mensagem = error?.response?.data?.message || 'Erro ao cadastrar cliente no servidor.';
      ToastAlerta(mensagem, 'erro');
      setErroCliente(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  const handleEditarApolice = (apolice: Apolice) => {
    setFormData({
      id: apolice.id,
      numeroApolice: apolice.numeroApolice || '',
      bemSegurado: apolice.bemSegurado || 'Automóvel Passeio',
      marcaModelo: apolice.marcaModelo || '',
      anoModelo: apolice.anoModelo || 2024,
      placa: apolice.placa || '',
      renavam: apolice.renavam || '',
      valorApolice: apolice.valorApolice || '',
      tipoCobertura: apolice.tipoCobertura || '',
      dataInicio: apolice.dataInicio || '',
      dataTermino: apolice.dataTermino || '',
      statusApolice: apolice.statusApolice ?? 1,
      clienteId: apolice.cliente?.id || '',
    });
    setErroForm('');
    setModalFormAberto(true);
  };

  const handleVisualizarApolice = (apolice: Apolice) => {
    setApoliceSelecionada(apolice);
    setModalDetalhesAberto(true);
  };

  const handleExcluirClique = (apolice: Apolice) => {
    setApoliceParaExcluir(apolice);
    setModalExcluirAberto(true);
  };

  const handleConfirmarExclusao = async () => {
    if (!apoliceParaExcluir || !apoliceParaExcluir.id) return;
    setSalvando(true);

    try {
      const header = getAuthHeader(usuario?.token);
      await deletar(`/apolices/${apoliceParaExcluir.id}`, header);

      setApolices((prev) => prev.filter((item) => item.id !== apoliceParaExcluir.id));
      ToastAlerta(`Apólice ${apoliceParaExcluir.numeroApolice} excluída com sucesso!`, 'sucesso');
      setModalExcluirAberto(false);
      setApoliceParaExcluir(null);
      carregarDadosApi();
    } catch {
      ToastAlerta('Erro ao excluir apólice no servidor.', 'erro');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluirClienteClique = (cliente: Cliente) => {
    setClienteParaExcluir(cliente);
    setModalExcluirClienteAberto(true);
  };

  const handleConfirmarExclusaoCliente = async () => {
    if (!clienteParaExcluir || !clienteParaExcluir.id) return;
    setSalvando(true);

    try {
      const header = getAuthHeader(usuario?.token);
      await deletar(`/clientes/${clienteParaExcluir.id}`, header);

      setClientes((prev) => prev.filter((item) => item.id !== clienteParaExcluir.id));
      ToastAlerta(`Cliente ${clienteParaExcluir.nomeCompleto} excluído com sucesso!`, 'sucesso');
      setModalExcluirClienteAberto(false);
      setClienteParaExcluir(null);
      carregarDadosApi();
    } catch {
      ToastAlerta('Erro ao excluir cliente. Verifique se ele possui apólices ativas vinculadas.', 'erro');
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvarApolice = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroForm('');

    if (!formData.marcaModelo.trim() || !formData.placa.trim() || !formData.clienteId) {
      setErroForm('Preencha os campos obrigatórios e selecione o cliente.');
      return;
    }

    setSalvando(true);

    try {
      if (!usuario?.token) {
        ToastAlerta('Sessão expirada.', 'info');
        navigate('/login');
        return;
      }

      const header = getAuthHeader(usuario.token);

      const apolicePayload = {
        id: formData.id || undefined,
        numeroApolice: formData.numeroApolice || `SEG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        bemSegurado: formData.bemSegurado,
        marcaModelo: formData.marcaModelo.trim(),
        anoModelo: Number(formData.anoModelo),
        placa: formData.placa.trim().toUpperCase(),
        renavam: formData.renavam.trim(),
        valorApolice: Number(formData.valorApolice),
        tipoCobertura: formData.tipoCobertura,
        dataInicio: formData.dataInicio,
        dataTermino: formData.dataTermino,
        statusApolice: Number(formData.statusApolice),
        cliente: {
          id: Number(formData.clienteId)
        },
        usuario: {
          id: usuario.id
        }
      };

      if (formData.id) {
        await atualizar('/apolices', apolicePayload, () => undefined, header);
        ToastAlerta('Apólice atualizada com sucesso na API!', 'sucesso');
      } else {
        await cadastrar('/apolices', apolicePayload, () => undefined, header);
        ToastAlerta('Nova apólice cadastrada com sucesso na API!', 'sucesso');
      }

      setModalFormAberto(false);
      carregarDadosApi();
    } catch (error: any) {
      console.error('Erro ao salvar apólice na API:', error);
      const mensagem = error?.response?.data?.message || 'Ocorreu um erro ao salvar a apólice no servidor.';
      ToastAlerta(mensagem, 'erro');
      setErroForm(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  const renderStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle size={14} weight="fill" />
            <span>Ativa</span>
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <WarningCircle size={14} weight="fill" />
            <span>Vencida</span>
          </span>
        );
      case 0:
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock size={14} weight="fill" />
            <span>Pendente</span>
          </span>
        );
    }
  };

  if (!isAutenticado || !isCorretor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="https://ik.imagekit.io/JohnnieDiniz/segurae/escudo-segurade%20(1).svg"
                alt="Logo Seguraê"
                className="w-8 h-8 transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-zinc-900 leading-none">
                  Seguraê
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-600">
                  Painel do Corretor
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-6 border-l border-zinc-200 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  statusApi === 'online'
                    ? 'bg-emerald-500 animate-pulse'
                    : statusApi === 'verificando'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-zinc-400'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-zinc-200">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm shadow-xs">
                {usuario.nome ? usuario.nome.charAt(0) : 'M'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-zinc-900">
                  {usuario.nome || 'Corretor'}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {usuario.usuario || usuario.email}
                </p>
              </div>
            </div>

            <Link
              to="/dashboard/corretor"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200 transition-colors"
            >
              <ArrowLeft size={16} weight="bold" />
              <span className="hidden sm:inline">Voltar ao Site</span>
            </Link>

            <button
              onClick={() => {
                handleLogout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-red-600 hover:bg-red-50 border border-zinc-200 transition-colors cursor-pointer"
            >
              <SignOut size={16} weight="bold" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold mb-3 border border-red-500/30">
              <ShieldCheck size={16} weight="fill" />
              <span>Gestão Centralizada de Seguros e Clientes</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Gerenciamento de Apólices
            </h1>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Consulte, emita, edite e monitore os contratos e veículos da sua carteira com validações em tempo real e integração direta com o backend Seguraê.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={carregarDadosApi}
              disabled={carregando}
              className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-2xl flex items-center gap-2 border border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <ArrowCounterClockwise
                size={18}
                weight="bold"
                className={carregando ? 'animate-spin text-red-400' : ''}
              />
              <span>{carregando ? 'Atualizando...' : 'Atualizar Lista'}</span>
            </button>

            <button
              onClick={handleNovaApolice}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <Plus size={18} weight="bold" />
              <span>Nova Apólice</span>
            </button>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-red-600/15 to-transparent pointer-events-none" />
        </div>

        {/* BARRA DE ABAS (APÓLICES / GESTÃO DE CLIENTES) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-2 bg-zinc-200/70 p-1.5 rounded-2xl">
            <button
              onClick={() => setAbaAtiva('apolices')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                abaAtiva === 'apolices'
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <FileText size={18} weight={abaAtiva === 'apolices' ? 'fill' : 'bold'} />
              <span>Apólices de Seguros</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${abaAtiva === 'apolices' ? 'bg-zinc-900 text-white' : 'bg-zinc-300 text-zinc-700'}`}>
                {apolices.length}
              </span>
            </button>

            <button
              onClick={() => setAbaAtiva('clientes')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                abaAtiva === 'clientes'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Users size={18} weight={abaAtiva === 'clientes' ? 'fill' : 'bold'} />
              <span>Gestão de Clientes</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${abaAtiva === 'clientes' ? 'bg-white text-red-600' : 'bg-zinc-300 text-zinc-700'}`}>
                {clientes.length}
              </span>
            </button>
          </div>

          <p className="text-xs text-zinc-500 font-medium">
            {abaAtiva === 'apolices' ? 'Consulte e gerencie todos os seguros ativos.' : 'Consulte a base de segurados e realize exclusões na API'}
          </p>
        </div>

        {/* CONTEÚDO DA ABA: APÓLICES */}
        {abaAtiva === 'apolices' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0">
                  <FileText size={24} weight="fill" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Total de Apólices</p>
                  <p className="text-2xl font-black text-zinc-900">{stats.total}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} weight="fill" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Apólices Ativas</p>
                  <p className="text-2xl font-black text-emerald-600">{stats.ativas}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <WarningCircle size={24} weight="fill" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Vencidas / Pendentes</p>
                  <p className="text-2xl font-black text-amber-600">
                    {stats.vencidas + stats.pendentes}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <CurrencyDollar size={24} weight="bold" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Prêmio Segurado</p>
                  <p className="text-lg sm:text-xl font-black text-red-600 truncate">
                    {formatarMoeda(stats.valorTotal)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="relative w-full lg:w-96">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <MagnifyingGlass size={18} />
                </span>
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por placa, modelo, cliente ou apólice..."
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setFiltroStatus('todas')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filtroStatus === 'todas'
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Todas ({apolices.length})
                  </button>

                  <button
                    onClick={() => setFiltroStatus('ativas')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filtroStatus === 'ativas'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Ativas ({stats.ativas})
                  </button>

                  <button
                    onClick={() => setFiltroStatus('vencidas')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filtroStatus === 'vencidas'
                        ? 'bg-amber-600 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Vencidas ({stats.vencidas})
                  </button>

                  <button
                    onClick={() => setFiltroStatus('pendentes')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filtroStatus === 'pendentes'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Pendentes ({stats.pendentes})
                  </button>
                </div>

                <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/60">
                  <button
                    onClick={() => setViewMode('tabela')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'tabela'
                        ? 'bg-white text-zinc-900 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <Table size={16} weight="bold" />
                    <span className="hidden sm:inline">Tabela</span>
                  </button>

                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'cards'
                        ? 'bg-white text-zinc-900 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <SquaresFour size={16} weight="bold" />
                    <span className="hidden sm:inline">Cards</span>
                  </button>
                </div>
              </div>
            </div>

            {carregando ? (
              <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center my-6 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-600 font-semibold text-sm">Carregando dados da API do Render...</p>
              </div>
            ) : apolicesFiltradas.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-zinc-300 p-12 text-center my-6">
                <Car size={48} className="mx-auto text-zinc-300 mb-3" />
                <h3 className="text-lg font-bold text-zinc-800 mb-1">Nenhuma apólice encontrada</h3>
                <p className="text-sm text-zinc-500 mb-6">Nenhuma apólice cadastrada na API corresponde aos filtros aplicados.</p>
                <button
                  onClick={handleNovaApolice}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cadastrar Nova Apólice
                </button>
              </div>
            ) : viewMode === 'tabela' ? (
              <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-600">
                    <thead className="bg-zinc-100/70 border-b border-zinc-200/80 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Nº Apólice</th>
                        <th className="py-3.5 px-4">Cliente / Segurado</th>
                        <th className="py-3.5 px-4">Veículo & Placa</th>
                        <th className="py-3.5 px-4">Cobertura</th>
                        <th className="py-3.5 px-4">Valor</th>
                        <th className="py-3.5 px-4">Vigência</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {apolicesFiltradas.map((apolice) => (
                        <tr key={apolice.id || apolice.numeroApolice} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-zinc-900">{apolice.numeroApolice}</td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-zinc-900">{apolice.cliente?.nomeCompleto || 'Não informado'}</div>
                            <div className="text-[11px] text-zinc-400">CPF: {apolice.cliente?.cpfCnpj || '---'}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-semibold text-zinc-900">{apolice.marcaModelo}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono font-bold bg-zinc-900 text-white px-1.5 py-0.5 rounded text-[10px] tracking-wider">{apolice.placa}</span>
                              <span className="text-[11px] text-zinc-400">Ano: {apolice.anoModelo}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 max-w-xs">
                            <span className="truncate block font-medium text-zinc-700">{apolice.tipoCobertura}</span>
                            <span className="text-[10px] text-zinc-400">{apolice.bemSegurado}</span>
                          </td>
                          <td className="py-4 px-4 font-bold text-red-600 whitespace-nowrap">{formatarMoeda(apolice.valorApolice)}</td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="text-zinc-900 font-medium">{formatarData(apolice.dataInicio)}</div>
                            <div className="text-[11px] text-zinc-400">até {formatarData(apolice.dataTermino)}</div>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">{renderStatusBadge(apolice.statusApolice)}</td>
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button onClick={() => handleVisualizarApolice(apolice)} className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer" title="Visualizar"><Eye size={16} weight="bold" /></button>
                              <button onClick={() => handleEditarApolice(apolice)} className="p-2 rounded-xl text-zinc-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer" title="Editar"><PencilSimple size={16} weight="bold" /></button>
                              <button onClick={() => handleExcluirClique(apolice)} className="p-2 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 cursor-pointer" title="Excluir"><Trash size={16} weight="bold" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apolicesFiltradas.map((apolice) => (
                  <div key={apolice.id || apolice.numeroApolice} className="bg-white rounded-3xl border border-zinc-200 shadow-xs p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2.5 py-0.5 bg-zinc-900 text-white font-mono font-bold text-xs rounded-md">{apolice.placa}</span>
                        {renderStatusBadge(apolice.statusApolice)}
                      </div>
                      <h3 className="text-base font-bold text-zinc-900">{apolice.marcaModelo}</h3>
                      <p className="text-xs text-zinc-400 mb-4">{apolice.bemSegurado} • Ano {apolice.anoModelo}</p>
                      <div className="bg-zinc-50 p-3 rounded-2xl text-xs space-y-1">
                        <div className="flex justify-between"><span className="text-zinc-500">Apólice:</span><span className="font-mono font-bold">{apolice.numeroApolice}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-500">Cliente:</span><span className="font-bold truncate max-w-40">{apolice.cliente?.nomeCompleto}</span></div>
                        <div className="flex justify-between pt-1 border-t"><span className="text-zinc-500">Valor:</span><span className="font-black text-red-600">{formatarMoeda(apolice.valorApolice)}</span></div>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center justify-between gap-2 mt-4 border-t">
                      <button onClick={() => handleVisualizarApolice(apolice)} className="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1"><Eye size={16} /><span>Detalhes</span></button>
                      <button onClick={() => handleEditarApolice(apolice)} className="p-2 bg-blue-50 text-blue-600 rounded-xl"><PencilSimple size={16} /></button>
                      <button onClick={() => handleExcluirClique(apolice)} className="p-2 bg-red-50 text-red-600 rounded-xl"><Trash size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CONTEÚDO DA ABA: GESTÃO DE CLIENTES */}
        {abaAtiva === 'clientes' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Users size={24} weight="fill" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Total de Clientes</p>
                  <p className="text-2xl font-black text-zinc-900">{statsClientes.total}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} weight="fill" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Clientes com Apólices</p>
                  <p className="text-2xl font-black text-emerald-600">{statsClientes.comApolices}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock size={24} weight="fill" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Sem Apólices Ativas</p>
                  <p className="text-2xl font-black text-amber-600">{statsClientes.semApolices}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <MagnifyingGlass size={18} />
                </span>
                <input
                  type="text"
                  value={buscaCliente}
                  onChange={(e) => setBuscaCliente(e.target.value)}
                  placeholder="Buscar por nome, e-mail ou CPF..."
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <span className="text-xs text-zinc-500 font-medium">Exibindo {clientesFiltrados.length} de {clientes.length} cadastrados</span>
                <button
                  onClick={handleNovoCliente}
                  className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-600/20 cursor-pointer transition-all"
                >
                  <Plus size={16} weight="bold" />
                  <span>+ Novo Cliente</span>
                </button>
              </div>
            </div>

            {carregando ? (
              <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center my-6 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-zinc-600 font-semibold text-sm">Carregando clientes da API...</p>
              </div>
            ) : clientesFiltrados.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-zinc-300 p-12 text-center my-6">
                <Users size={48} className="mx-auto text-zinc-300 mb-3" />
                <h3 className="text-lg font-bold text-zinc-800 mb-1">Nenhum cliente encontrado</h3>
                <p className="text-sm text-zinc-500 mb-6">Nenhum cliente cadastrado corresponde à busca realizada.</p>
                <button onClick={handleNovoCliente} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl">Cadastrar Novo Cliente</button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-zinc-600">
                    <thead className="bg-zinc-100/70 border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Cliente / Segurado</th>
                        <th className="py-3.5 px-4">E-mail de Login</th>
                        <th className="py-3.5 px-4">CPF / CNPJ</th>
                        <th className="py-3.5 px-4">Data Nasc.</th>
                        <th className="py-3.5 px-4">Apólices Vinculadas</th>
                        <th className="py-3.5 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {clientesFiltrados.map((cli) => {
                        const apolicesDoCliente = apolices.filter((a) => a.cliente?.id === cli.id);
                        const qtdApolices = apolicesDoCliente.length;

                        return (
                          <tr key={cli.id} className="hover:bg-zinc-50 transition-colors">
                            <td className="py-4 px-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 font-bold flex items-center justify-center text-xs shrink-0">
                                {cli.nomeCompleto ? cli.nomeCompleto.charAt(0).toUpperCase() : 'C'}
                              </div>
                              <div>
                                <div className="font-bold text-zinc-900">{cli.nomeCompleto}</div>
                                <div className="text-[10px] text-zinc-400 font-mono">ID: #{cli.id}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium text-zinc-800">{cli.email}</td>
                            <td className="py-4 px-4 font-mono">{cli.cpfCnpj || '---'}</td>
                            <td className="py-4 px-4">{formatarData(cli.dataNascimento)}</td>
                            <td className="py-4 px-4">
                              {qtdApolices > 0 ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle size={14} weight="fill" />
                                  <span>{qtdApolices} apólice(s)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-500 border border-zinc-200">
                                  Sem apólices
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleExcluirClienteClique(cli)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-200 transition-colors cursor-pointer text-xs"
                              >
                                <Trash size={14} weight="bold" />
                                <span>Excluir</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL: NOVO CLIENTE */}
      {modalClienteAberto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-zinc-200 p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <UserPlus size={22} weight="bold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Cadastrar Novo Cliente</h3>
                  <p className="text-xs text-zinc-500">Salva diretamente na API do Render</p>
                </div>
              </div>
              <button onClick={() => setModalClienteAberto(false)} className="text-zinc-400 hover:text-zinc-600 font-bold text-xl cursor-pointer">&times;</button>
            </div>

            {erroCliente && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <WarningCircle size={18} weight="fill" className="shrink-0 text-red-600" />
                <span>{erroCliente}</span>
              </div>
            )}

            <form onSubmit={handleSalvarCliente} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-700 font-semibold mb-1">Nome Completo *</label>
                <input type="text" required value={formCliente.nomeCompleto} onChange={(e) => setFormCliente({...formCliente, nomeCompleto: e.target.value})} placeholder="Ex: Carlos Eduardo Mendes" className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none" />
              </div>

              <div>
                <label className="block text-zinc-700 font-semibold mb-1">E-mail (Login) *</label>
                <input type="email" required value={formCliente.email} onChange={(e) => setFormCliente({...formCliente, email: e.target.value})} placeholder="carlos@email.com" className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">CPF ou CNPJ *</label>
                  <input type="text" required value={formCliente.cpfCnpj} onChange={(e) => setFormCliente({...formCliente, cpfCnpj: e.target.value})} placeholder="12345678900" className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-zinc-700 font-semibold mb-1">Data de Nascimento *</label>
                  <input type="date" required value={formCliente.dataNascimento} onChange={(e) => setFormCliente({...formCliente, dataNascimento: e.target.value})} className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none" />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setModalClienteAberto(false)} className="px-4 py-2 font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md cursor-pointer disabled:bg-red-400">{salvando ? 'Salvando...' : 'Cadastrar Cliente'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVA / EDITAR APÓLICE */}
      {modalFormAberto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-zinc-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-zinc-900 text-white px-6 py-5 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30">
                  <ShieldCheck size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">
                    {formData.id ? 'Editar Apólice de Seguro' : 'Nova Apólice de Seguro'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Preencha os dados da apólice, do veículo e selecione o segurado
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalFormAberto(false)}
                className="w-8 h-8 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            {erroForm && (
              <div className="mx-6 mt-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <WarningCircle size={18} weight="fill" className="shrink-0 text-red-600" />
                <span>{erroForm}</span>
              </div>
            )}

            <form onSubmit={handleSalvarApolice}>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                
                {/* SEÇÃO 1: CARDS DE PLANOS */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={15} className="text-red-600" />
                      <span>1. Tipo de Cobertura Contratada *</span>
                    </h4>
                    <span className="text-[11px] text-zinc-400 font-medium">
                      Clique em um plano para preencher o valor automaticamente
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {PLANOS_SEGURO.map((plano) => {
                      const selecionado = formData.tipoCobertura.includes(plano.nome.split(' ')[0]);
                      return (
                        <div
                          key={plano.nome}
                          onClick={() => setFormData({ 
                            ...formData, 
                            tipoCobertura: plano.nome, 
                            valorApolice: plano.valor 
                          })}
                          className={`cursor-pointer rounded-2xl p-4 border transition-all relative flex flex-col justify-between ${
                            selecionado 
                              ? 'border-red-600 bg-red-50/20 shadow-md ring-2 ring-red-600/15' 
                              : 'border-zinc-200/80 bg-zinc-50/50 hover:border-zinc-300 hover:bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                plano.tag === 'MAIS POPULAR' ? 'bg-red-600 text-white' : 'bg-zinc-200 text-zinc-700'
                              }`}>
                                {plano.tag}
                              </span>
                              {selecionado && <CheckCircle size={16} weight="fill" className="text-red-600" />}
                            </div>
                            <h5 className="font-bold text-zinc-900 text-xs mb-1">{plano.nome}</h5>
                            <p className="text-[11px] text-zinc-500 leading-snug mb-3">{plano.desc}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2.5 border-t border-zinc-200/60 text-xs">
                            <span className="text-[10px] text-zinc-400 font-medium">Sugerido</span>
                            <span className="font-black text-zinc-900">R$ {plano.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DATAS, TIPO DE BEM E STATUS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-zinc-100 text-xs">
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1.5">Início da Vigência *</label>
                    <input
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1.5">Término da Vigência *</label>
                    <input
                      type="date"
                      value={formData.dataTermino}
                      onChange={(e) => setFormData({ ...formData, dataTermino: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1.5">Tipo de Bem</label>
                    <select
                      value={formData.bemSegurado}
                      onChange={(e) => setFormData({ ...formData, bemSegurado: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="Automóvel Passeio">Automóvel Passeio</option>
                      <option value="SUV Urbano">SUV Urbano</option>
                      <option value="Pick-up / Caminhonete">Pick-up / Caminhonete</option>
                      <option value="Motocicleta">Motocicleta</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-700 font-semibold mb-1.5">Status da Apólice *</label>
                    <select
                      value={formData.statusApolice}
                      onChange={(e) => setFormData({ ...formData, statusApolice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-bold focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
                    >
                      <option value={1}>🟢 Ativa</option>
                      <option value={0}>🔵 Pendente</option>
                      <option value={2}>🟠 Vencida</option>
                    </select>
                  </div>
                </div>

                {/* SEÇÃO 2: IDENTIFICAÇÃO DO VEÍCULO */}
                <div className="pt-4 border-t border-zinc-100">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                    <Car size={15} className="text-red-600" />
                    <span>2. Identificação do Veículo</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-zinc-700 font-semibold mb-1.5">Marca e Modelo do Veículo *</label>
                      <input
                        type="text"
                        value={formData.marcaModelo}
                        onChange={(e) => setFormData({ ...formData, marcaModelo: e.target.value })}
                        placeholder="Ex: Toyota Corolla Cross XRE 2.0"
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1.5">Placa (7 dígitos) *</label>
                      <input
                        type="text"
                        maxLength={7}
                        value={formData.placa}
                        onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                        placeholder="BRA2E19"
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono font-bold tracking-wider uppercase focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1.5">Ano do Modelo *</label>
                      <input
                        type="number"
                        value={formData.anoModelo}
                        onChange={(e) => setFormData({ ...formData, anoModelo: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-zinc-700 font-semibold mb-1.5">Código Renavam *</label>
                      <input
                        type="text"
                        maxLength={11}
                        value={formData.renavam}
                        onChange={(e) => setFormData({ ...formData, renavam: e.target.value })}
                        placeholder="Ex: 00123456789"
                        className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-zinc-700 font-semibold mb-1.5">Valor Final da Apólice (R$) *</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-zinc-400 font-bold">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.valorApolice}
                          onChange={(e) => setFormData({ ...formData, valorApolice: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-red-600 font-black focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEÇÃO 3: CLIENTE / SEGURADO */}
                <div className="pt-4 border-t border-zinc-100">
                  <div className="flex items-center justify-between mb-3.5">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                      <User size={15} className="text-red-600" />
                      <span>3. Segurado Responsável</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setModalFormAberto(false);
                        handleNovoCliente();
                      }}
                      className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={14} weight="bold" />
                      <span>Cadastrar Novo Cliente</span>
                    </button>
                  </div>

                  <div className="text-xs">
                    <select
                      value={formData.clienteId}
                      onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                      className="w-full px-3.5 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="">Selecione um cliente da base...</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nomeCompleto} — {cliente.email} ({cliente.cpfCnpj || 'N/D'})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-zinc-400 mt-1.5">
                      A apólice é vinculada diretamente à conta do segurado. Ao logar com este e-mail, o titular visualizará o seguro em seu painel.
                    </p>
                  </div>
                </div>

              </div>

              {/* FOOTER */}
              <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalFormAberto(false)}
                  className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/25 cursor-pointer transition-all"
                >
                  {salvando ? (
                    <span>Salvando...</span>
                  ) : (
                    <>
                      <Check size={16} weight="bold" />
                      <span>{formData.id ? 'Salvar Alterações' : 'Cadastrar Apólice'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EXCLUIR CLIENTE */}
      {modalExcluirClienteAberto && clienteParaExcluir && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto"><Trash size={26} weight="bold" /></div>
            <h3 className="text-lg font-extrabold text-zinc-900 text-center mb-2">Confirmar Exclusão de Cliente</h3>
            <p className="text-xs text-zinc-500 text-center mb-6">
              Deseja excluir permanentemente o cliente <strong className="text-zinc-900">{clienteParaExcluir.nomeCompleto}</strong> do servidor Render?
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => { setModalExcluirClienteAberto(false); setClienteParaExcluir(null); }} className="flex-1 py-2.5 bg-zinc-100 text-zinc-800 text-xs font-bold rounded-xl">Cancelar</button>
              <button onClick={handleConfirmarExclusaoCliente} disabled={salvando} className="flex-1 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow-md">{salvando ? 'Excluindo...' : 'Sim, Excluir'}</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXCLUIR APÓLICE */}
      {modalExcluirAberto && apoliceParaExcluir && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto"><Trash size={26} weight="bold" /></div>
            <h3 className="text-lg font-extrabold text-zinc-900 text-center mb-2">Confirmar Exclusão de Apólice</h3>
            <p className="text-xs text-zinc-500 text-center mb-6">Deseja excluir a apólice <strong className="text-zinc-900">{apoliceParaExcluir.numeroApolice}</strong>?</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setModalExcluirAberto(false)} className="flex-1 py-2.5 bg-zinc-100 text-zinc-800 text-xs font-bold rounded-xl">Cancelar</button>
              <button onClick={handleConfirmarExclusao} disabled={salvando} className="flex-1 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl">{salvando ? 'Excluindo...' : 'Sim, Excluir'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}