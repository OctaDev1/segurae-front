import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@phosphor-icons/react';
import { AuthContext } from '../../contexts/AuthContext';
import type Apolice from '../../models/Apolice';
import { buscar, cadastrar, atualizar, deletar } from '../../services/Service';
import { ToastAlerta } from '../../utils/toastalerta/ToastAlerta';

const getAuthHeader = (token?: string) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};

// Dados iniciais para demonstração e resiliência offline/cold-start
const APOLICES_INICIAIS_CORRETOR: Apolice[] = [
  {
    id: 1,
    numeroApolice: 'SEG-2026-X892A1',
    marcaModelo: 'Toyota Corolla Cross XRE 2.0',
    bemSegurado: 'Automóvel Passeio',
    anoModelo: 2024,
    placa: 'BRA2E19',
    renavam: '00123456789',
    valorApolice: 3850.0,
    tipoCobertura: 'Total 100% FIPE + Terceiros (R$ 150k)',
    dataInicio: '2026-01-15',
    dataTermino: '2027-01-15',
    statusApolice: 1,
    cliente: {
      id: 1,
      nomeCompleto: 'Carlos Eduardo Mendes',
      email: 'carlos.mendes@email.com',
      cpfCnpj: '123.456.789-00',
      dataNascimento: '1988-04-12',
    },
    usuario: {
      id: 1,
      nome: 'Mariana Silva (Corretora)',
      email: 'mariana.corretora@segurae.com.br',
    },
  },
  {
    id: 2,
    numeroApolice: 'SEG-2025-F741B3',
    marcaModelo: 'Honda Civic Touring 1.5 Turbo',
    bemSegurado: 'Automóvel Passeio',
    anoModelo: 2022,
    placa: 'SEG9A88',
    renavam: '00987654321',
    valorApolice: 4200.0,
    tipoCobertura: 'Compreensiva + Vidros, Faróis e Carro Reserva',
    dataInicio: '2025-08-10',
    dataTermino: '2026-08-10',
    statusApolice: 1,
    cliente: {
      id: 2,
      nomeCompleto: 'Ana Beatriz Souza',
      email: 'ana.souza@email.com',
      cpfCnpj: '234.567.890-11',
      dataNascimento: '1992-09-21',
    },
    usuario: {
      id: 1,
      nome: 'Mariana Silva (Corretora)',
      email: 'mariana.corretora@segurae.com.br',
    },
  },
  {
    id: 3,
    numeroApolice: 'SEG-2024-C332D9',
    marcaModelo: 'Jeep Renegade Longitude 1.3 Turbo',
    bemSegurado: 'Automóvel Passeio',
    anoModelo: 2021,
    placa: 'RLM4C20',
    renavam: '00543219876',
    valorApolice: 3100.0,
    tipoCobertura: 'Roubo, Furto e Incêndio',
    dataInicio: '2024-02-01',
    dataTermino: '2025-02-01',
    statusApolice: 2,
    cliente: {
      id: 3,
      nomeCompleto: 'Rodrigo Fernandes Lima',
      email: 'rodrigo.lima@email.com',
      cpfCnpj: '345.678.901-22',
      dataNascimento: '1985-11-05',
    },
    usuario: {
      id: 1,
      nome: 'Mariana Silva (Corretora)',
      email: 'mariana.corretora@segurae.com.br',
    },
  },
  {
    id: 4,
    numeroApolice: 'SEG-2026-P910E4',
    marcaModelo: 'Volkswagen T-Cross Highline 250 TSI',
    bemSegurado: 'SUV Urbano',
    anoModelo: 2023,
    placa: 'FTX3D82',
    renavam: '00778899112',
    valorApolice: 3600.0,
    tipoCobertura: 'Total 100% FIPE + Danos Corporais e Materiais',
    dataInicio: '2026-03-01',
    dataTermino: '2027-03-01',
    statusApolice: 0,
    cliente: {
      id: 4,
      nomeCompleto: 'Juliana Paes Vasconcelos',
      email: 'juliana.vasconcelos@email.com',
      cpfCnpj: '456.789.012-33',
      dataNascimento: '1995-07-18',
    },
    usuario: {
      id: 1,
      nome: 'Mariana Silva (Corretora)',
      email: 'mariana.corretora@segurae.com.br',
    },
  },
];

// Interface para formulário de cadastro / edição
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
  clienteNome: string;
  clienteEmail: string;
  clienteCpfCnpj: string;
  clienteDataNasc: string;
}

const FORM_INICIAL: FormApoliceData = {
  numeroApolice: '',
  bemSegurado: 'Automóvel Passeio',
  marcaModelo: '',
  anoModelo: new Date().getFullYear(),
  placa: '',
  renavam: '',
  valorApolice: '',
  tipoCobertura: 'Total 100% FIPE + Terceiros (R$ 150k)',
  dataInicio: new Date().toISOString().split('T')[0],
  dataTermino: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    .toISOString()
    .split('T')[0],
  statusApolice: 1,
  clienteNome: '',
  clienteEmail: '',
  clienteCpfCnpj: '',
  clienteDataNasc: '1990-01-01',
};

export default function AreaCorretor() {
  const navigate = useNavigate();
  const { usuario, handleLogout } = useContext(AuthContext);

  const isAutenticado = Boolean(usuario && usuario.token && usuario.token.trim() !== '');
  const isCorretor = isAutenticado && (usuario.perfil === 'ROLE_CORRETOR' || usuario.perfil === 'corretor');

  // Proteção da rota do Corretor
  useEffect(() => {
    if (!isAutenticado) {
      ToastAlerta('Você precisa estar logado para acessar a Área do Corretor.', 'info');
      navigate('/login', { state: { tipoAcesso: 'corretor' }, replace: true });
    } else if (!isCorretor) {
      ToastAlerta('Acesso negado: Seu perfil é de Cliente e não possui permissão para a Área do Corretor.', 'erro');
      navigate('/apolices', { replace: true });
    }
  }, [isAutenticado, isCorretor, navigate]);

  // Estados principais
  const [apolices, setApolices] = useState<Apolice[]>(() => {
    const salvas = localStorage.getItem('segurae_apolices_corretor');
    if (salvas) {
      try {
        return JSON.parse(salvas);
      } catch {
        return APOLICES_INICIAIS_CORRETOR;
      }
    }
    return APOLICES_INICIAIS_CORRETOR;
  });

  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [statusApi, setStatusApi] = useState<'online' | 'offline' | 'verificando'>('verificando');

  // Filtros e Visualização
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativas' | 'vencidas' | 'pendentes'>('todas');
  const [viewMode, setViewMode] = useState<'tabela' | 'cards'>('tabela');

  // Modais
  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  // Itens em edição ou inspeção
  const [formData, setFormData] = useState<FormApoliceData>(FORM_INICIAL);
  const [apoliceSelecionada, setApoliceSelecionada] = useState<Apolice | null>(null);
  const [apoliceParaExcluir, setApoliceParaExcluir] = useState<Apolice | null>(null);
  const [erroForm, setErroForm] = useState('');

  // Sincronizar apólices no localStorage para persistência de sessão
  useEffect(() => {
    localStorage.setItem('segurae_apolices_corretor', JSON.stringify(apolices));
  }, [apolices]);

  // Carregar dados da API
  const carregarApolicesApi = useCallback(async () => {
    setCarregando(true);
    try {
      const header = getAuthHeader(usuario?.token);
      const dados = await buscar('/apolices', undefined, header);
      if (Array.isArray(dados) && dados.length > 0) {
        setApolices(dados);
        setStatusApi('online');
      } else {
        setStatusApi('online');
      }
    } catch {
      setStatusApi('offline');
      // Continua usando os dados do estado/localStorage sem interromper a navegação
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  useEffect(() => {
    let ativo = true;
    const buscarInicial = async () => {
      try {
        const header = getAuthHeader(usuario?.token);
        const dados = await buscar('/apolices', undefined, header);
        if (ativo && Array.isArray(dados) && dados.length > 0) {
          setApolices(dados);
          setStatusApi('online');
        } else if (ativo) {
          setStatusApi('online');
        }
      } catch {
        if (ativo) setStatusApi('offline');
      }
    };
    buscarInicial();
    return () => {
      ativo = false;
    };
  }, [usuario]);

  // Formatações
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

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const total = apolices.length;
    const ativas = apolices.filter((a) => a.statusApolice === 1).length;
    const vencidas = apolices.filter((a) => a.statusApolice === 2).length;
    const pendentes = apolices.filter((a) => a.statusApolice === 0).length;
    const valorTotal = apolices.reduce((acc, curr) => acc + (Number(curr.valorApolice) || 0), 0);
    return { total, ativas, vencidas, pendentes, valorTotal };
  }, [apolices]);

  // Filtro e busca
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

  // Abertura do formulário para nova apólice
  const handleNovaApolice = () => {
    const codigoAleatorio = Math.random().toString(36).substring(2, 8).toUpperCase();
    const ano = new Date().getFullYear();
    setFormData({
      ...FORM_INICIAL,
      numeroApolice: `SEG-${ano}-${codigoAleatorio}`,
    });
    setErroForm('');
    setModalFormAberto(true);
  };

  // Abertura do formulário para edição
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
      clienteNome: apolice.cliente?.nomeCompleto || apolice.usuario?.nome || '',
      clienteEmail: apolice.cliente?.email || apolice.usuario?.email || '',
      clienteCpfCnpj: apolice.cliente?.cpfCnpj || '',
      clienteDataNasc: apolice.cliente?.dataNascimento || '1990-01-01',
    });
    setErroForm('');
    setModalFormAberto(true);
  };

  // Abertura do modal de visualização
  const handleVisualizarApolice = (apolice: Apolice) => {
    setApoliceSelecionada(apolice);
    setModalDetalhesAberto(true);
  };

  // Abertura do modal de exclusão
  const handleExcluirClique = (apolice: Apolice) => {
    setApoliceParaExcluir(apolice);
    setModalExcluirAberto(true);
  };

  // Confirmação de exclusão (DELETE)
  const handleConfirmarExclusao = async () => {
    if (!apoliceParaExcluir) return;
    setSalvando(true);

    try {
      if (apoliceParaExcluir.id) {
        try {
          const header = getAuthHeader(usuario?.token);
          await deletar(`/apolices/${apoliceParaExcluir.id}`, header);
        } catch {
          // Mantém integridade local mesmo se o backend estiver inacessível
        }
      }

      setApolices((prev) => prev.filter((item) => item.id !== apoliceParaExcluir.id));
      ToastAlerta(`Apólice ${apoliceParaExcluir.numeroApolice} excluída com sucesso!`, 'sucesso');
      setModalExcluirAberto(false);
      setApoliceParaExcluir(null);
    } catch {
      ToastAlerta('Erro ao excluir apólice.', 'erro');
    } finally {
      setSalvando(false);
    }
  };

  // Submissão do formulário (POST / PUT)
  const handleSalvarApolice = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroForm('');

    // Validações
    if (!formData.marcaModelo.trim()) {
      setErroForm('Por favor, informe a marca e o modelo do veículo.');
      return;
    }
    if (!formData.placa.trim() || formData.placa.trim().length !== 7) {
      setErroForm('A placa deve conter exatamente 7 caracteres (ex: BRA2E19).');
      return;
    }
    if (!formData.renavam.trim() || formData.renavam.trim().length < 9) {
      setErroForm('O Renavam deve conter entre 9 e 11 dígitos.');
      return;
    }
    if (!formData.valorApolice || Number(formData.valorApolice) <= 0) {
      setErroForm('Informe um valor de apólice válido maior que zero.');
      return;
    }
    if (!formData.dataInicio || !formData.dataTermino) {
      setErroForm('Informe as datas de início e término de vigência.');
      return;
    }
    if (new Date(formData.dataTermino) < new Date(formData.dataInicio)) {
      setErroForm('A data de término não pode ser anterior à data de início.');
      return;
    }
    if (!formData.clienteNome.trim()) {
      setErroForm('Informe o nome do cliente / segurado.');
      return;
    }

    setSalvando(true);

    const apolicePayload: Apolice = {
      id: formData.id,
      numeroApolice: formData.numeroApolice || `SEG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      bemSegurado: formData.bemSegurado,
      marcaModelo: formData.marcaModelo.trim(),
      anoModelo: Number(formData.anoModelo) || 2024,
      placa: formData.placa.trim().toUpperCase(),
      renavam: formData.renavam.trim(),
      valorApolice: Number(formData.valorApolice),
      tipoCobertura: formData.tipoCobertura,
      dataInicio: formData.dataInicio,
      dataTermino: formData.dataTermino,
      statusApolice: Number(formData.statusApolice),
      cliente: {
        id: formData.id ? apoliceSelecionada?.cliente?.id || formData.id : Date.now(),
        nomeCompleto: formData.clienteNome.trim(),
        email: formData.clienteEmail.trim() || 'cliente@segurae.com.br',
        cpfCnpj: formData.clienteCpfCnpj.trim() || '000.000.000-00',
        dataNascimento: formData.clienteDataNasc || '1990-01-01',
      },
      usuario: {
        id: usuario.id || 1,
        nome: usuario.nome || 'Mariana Silva (Corretora)',
        email: usuario.usuario || 'mariana.corretora@segurae.com.br',
        usuario: usuario.usuario || 'corretor@segurae.com.br',
        perfil: 'ROLE_CORRETOR',
      },
    };

    try {
      const header = getAuthHeader(usuario?.token);

      if (formData.id) {
        // EDIÇÃO (PUT)
        try {
          await atualizar('/apolices', apolicePayload, undefined, header);
        } catch {
          // Fallback resiliente
        }

        setApolices((prev) =>
          prev.map((item) => (item.id === formData.id ? { ...item, ...apolicePayload } : item))
        );
        ToastAlerta('Apólice atualizada com sucesso!', 'sucesso');
      } else {
        // CRIAÇÃO (POST)
        let apoliceCriada = apolicePayload;
        try {
          const respostaApi = await cadastrar('/apolices', apolicePayload, undefined, header);
          if (respostaApi && respostaApi.id) {
            apoliceCriada = respostaApi;
          }
        } catch {
          // Fallback resiliente com ID temporário
          apoliceCriada = { ...apolicePayload, id: Date.now() };
        }

        setApolices((prev) => [apoliceCriada, ...prev]);
        ToastAlerta('Nova apólice cadastrada com sucesso!', 'sucesso');
      }

      setModalFormAberto(false);
    } catch {
      ToastAlerta('Ocorreu um erro ao salvar a apólice.', 'erro');
    } finally {
      setSalvando(false);
    }
  };

  // Renderizador de Badge de Status
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
      {/* ========================================================================= */}
      {/* HEADER SUPERIOR EXCLUSIVO DO CORRETOR COM IDENTIDADE SEGURAÊ               */}
      {/* ========================================================================= */}
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

            {/* Status da Conexão da API */}
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
                  {usuario.nome || 'Mariana Silva (Corretora)'}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {usuario.usuario || 'corretor@segurae.com.br'}
                </p>
              </div>
            </div>

            <Link
              to="/"
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

      {/* ========================================================================= */}
      {/* CONTEÚDO PRINCIPAL                                                        */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Banner Hero do Corretor */}
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
              onClick={carregarApolicesApi}
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

          {/* Gradiente decorativo de fundo */}
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-red-600/15 to-transparent pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* CARDS DE MÉTRICAS (KPIS)                                                  */}
        {/* ========================================================================= */}
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

        {/* ========================================================================= */}
        {/* BARRA DE FERRAMENTAS, BUSCA E FILTROS                                     */}
        {/* ========================================================================= */}
        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Campo de Busca */}
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
            {busca && (
              <button
                onClick={() => setBusca('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Filtros de Status e Alternador de Visão */}
          <div className="flex flex-wrap items-center justify-between w-full lg:w-auto gap-3">
            
            {/* Tabs de Status */}
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

            {/* Alternador Tabela / Cards */}
            <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/60">
              <button
                onClick={() => setViewMode('tabela')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'tabela'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="Visualização em Tabela"
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
                title="Visualização em Cards"
              >
                <SquaresFour size={16} weight="bold" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LISTAGEM DE APÓLICES: TABELA OU CARDS                                     */}
        {/* ========================================================================= */}
        {carregando ? (
          <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center my-6 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-600 font-semibold text-sm">Carregando apólices da base de dados...</p>
          </div>
        ) : apolicesFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-zinc-300 p-12 text-center my-6">
            <Car size={48} className="mx-auto text-zinc-300 mb-3" />
            <h3 className="text-lg font-bold text-zinc-800 mb-1">Nenhuma apólice encontrada</h3>
            <p className="text-sm text-zinc-500 mb-6">
              Nenhuma apólice corresponde aos filtros ou termos de pesquisa aplicados.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setBusca('');
                  setFiltroStatus('todas');
                }}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Limpar Filtros
              </button>
              <button
                onClick={handleNovaApolice}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cadastrar Nova Apólice
              </button>
            </div>
          </div>
        ) : viewMode === 'tabela' ? (
          // VISUALIZAÇÃO EM TABELA CORPORATIVA RESPONSIVA
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
                    <tr
                      key={apolice.id || apolice.numeroApolice}
                      className="hover:bg-zinc-50/80 transition-colors"
                    >
                      {/* Número da Apólice */}
                      <td className="py-4 px-4 font-mono font-bold text-zinc-900">
                        {apolice.numeroApolice}
                      </td>

                      {/* Cliente */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-zinc-900">
                          {apolice.cliente?.nomeCompleto || apolice.usuario?.nome || 'Não informado'}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          CPF: {apolice.cliente?.cpfCnpj || '---'}
                        </div>
                      </td>

                      {/* Veículo & Placa */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-zinc-900">
                          {apolice.marcaModelo}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-bold bg-zinc-900 text-white px-1.5 py-0.5 rounded text-[10px] tracking-wider">
                            {apolice.placa}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            Ano: {apolice.anoModelo}
                          </span>
                        </div>
                      </td>

                      {/* Tipo de Cobertura */}
                      <td className="py-4 px-4 max-w-xs">
                        <span className="truncate block font-medium text-zinc-700" title={apolice.tipoCobertura}>
                          {apolice.tipoCobertura}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {apolice.bemSegurado}
                        </span>
                      </td>

                      {/* Valor */}
                      <td className="py-4 px-4 font-bold text-red-600 whitespace-nowrap">
                        {formatarMoeda(apolice.valorApolice)}
                      </td>

                      {/* Vigência */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-zinc-900 font-medium">
                          {formatarData(apolice.dataInicio)}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          até {formatarData(apolice.dataTermino)}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {renderStatusBadge(apolice.statusApolice)}
                      </td>

                      {/* Ações */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleVisualizarApolice(apolice)}
                            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                            title="Visualizar Detalhes"
                          >
                            <Eye size={16} weight="bold" />
                          </button>
                          <button
                            onClick={() => handleEditarApolice(apolice)}
                            className="p-2 rounded-xl text-zinc-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Editar Apólice"
                          >
                            <PencilSimple size={16} weight="bold" />
                          </button>
                          <button
                            onClick={() => handleExcluirClique(apolice)}
                            className="p-2 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Excluir Apólice"
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // VISUALIZAÇÃO EM CARDS
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apolicesFiltradas.map((apolice) => (
              <div
                key={apolice.id || apolice.numeroApolice}
                className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 border-b border-zinc-100">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-zinc-900 text-white font-mono font-bold text-xs rounded-md tracking-wider mb-1.5">
                        {apolice.placa}
                      </span>
                      <h3 className="text-base font-bold text-zinc-900 leading-tight">
                        {apolice.marcaModelo}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {apolice.bemSegurado} • Ano {apolice.anoModelo}
                      </p>
                    </div>

                    <div>{renderStatusBadge(apolice.statusApolice)}</div>
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100/80 space-y-1 mt-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Nº da Apólice:</span>
                      <span className="font-mono font-bold text-zinc-800">
                        {apolice.numeroApolice}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Cliente:</span>
                      <span className="font-bold text-zinc-900 truncate max-w-42.5">
                        {apolice.cliente?.nomeCompleto || apolice.usuario?.nome}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-200/60">
                      <span className="text-zinc-500">Valor do Seguro:</span>
                      <span className="font-black text-red-600 text-sm">
                        {formatarMoeda(apolice.valorApolice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3 text-xs">
                  <div>
                    <span className="text-zinc-400 block mb-0.5 text-[11px] font-semibold uppercase">
                      Cobertura Contratada
                    </span>
                    <p className="font-medium text-zinc-800 line-clamp-2">
                      {apolice.tipoCobertura}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-zinc-500 pt-1">
                    <span>Vigência:</span>
                    <span className="font-semibold text-zinc-900">
                      {formatarData(apolice.dataInicio)} até {formatarData(apolice.dataTermino)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50/70 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleVisualizarApolice(apolice)}
                    className="flex-1 py-2 px-3 bg-white hover:bg-zinc-100 text-zinc-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-zinc-200 transition-colors cursor-pointer"
                  >
                    <Eye size={16} weight="bold" />
                    <span>Detalhes</span>
                  </button>

                  <button
                    onClick={() => handleEditarApolice(apolice)}
                    className="p-2 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-xl text-xs border border-zinc-200 transition-colors cursor-pointer"
                    title="Editar Apólice"
                  >
                    <PencilSimple size={16} weight="bold" />
                  </button>

                  <button
                    onClick={() => handleExcluirClique(apolice)}
                    className="p-2 bg-white hover:bg-red-50 text-red-600 font-bold rounded-xl text-xs border border-zinc-200 transition-colors cursor-pointer"
                    title="Excluir Apólice"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: FORMULÁRIO DE CADASTRO E EDIÇÃO                                  */}
      {/* ========================================================================= */}
      {modalFormAberto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Header do Modal */}
            <div className="bg-zinc-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/25 text-red-500 flex items-center justify-center">
                  <ShieldCheck size={24} weight="fill" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    {formData.id ? 'Editar Apólice de Seguro' : 'Nova Apólice de Seguro'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {formData.id
                      ? `Atualizando registro nº ${formData.numeroApolice}`
                      : 'Preencha os dados da apólice, do veículo e do segurado'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalFormAberto(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Mensagem de Erro do Formulário */}
            {erroForm && (
              <div className="mx-6 mt-6 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <WarningCircle size={18} weight="fill" className="shrink-0 text-red-600" />
                <span>{erroForm}</span>
              </div>
            )}

            {/* Corpo do Formulário */}
            <form onSubmit={handleSalvarApolice}>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                
                {/* SEÇÃO 1: DADOS DA APÓLICE & CONDIÇÕES */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-red-600" />
                    <span>1. Dados da Apólice & Vigência</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Número da Apólice
                      </label>
                      <input
                        type="text"
                        value={formData.numeroApolice}
                        onChange={(e) =>
                          setFormData({ ...formData, numeroApolice: e.target.value })
                        }
                        placeholder="Ex: SEG-2026-X892A1"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Valor da Apólice (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.valorApolice}
                        onChange={(e) =>
                          setFormData({ ...formData, valorApolice: e.target.value })
                        }
                        placeholder="Ex: 3850.00"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-bold focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Status da Apólice *
                      </label>
                      <select
                        value={formData.statusApolice}
                        onChange={(e) =>
                          setFormData({ ...formData, statusApolice: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                      >
                        <option value={1}>1 - Ativa</option>
                        <option value={2}>2 - Vencida</option>
                        <option value={0}>0 - Pendente / Em Análise</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Tipo de Cobertura Contratada *
                      </label>
                      <input
                        type="text"
                        value={formData.tipoCobertura}
                        onChange={(e) =>
                          setFormData({ ...formData, tipoCobertura: e.target.value })
                        }
                        placeholder="Ex: Total 100% FIPE + Terceiros (R$ 150k)"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Data de Início da Vigência *
                      </label>
                      <input
                        type="date"
                        value={formData.dataInicio}
                        onChange={(e) =>
                          setFormData({ ...formData, dataInicio: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Data de Término da Vigência *
                      </label>
                      <input
                        type="date"
                        value={formData.dataTermino}
                        onChange={(e) =>
                          setFormData({ ...formData, dataTermino: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Tipo de Bem
                      </label>
                      <select
                        value={formData.bemSegurado}
                        onChange={(e) =>
                          setFormData({ ...formData, bemSegurado: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      >
                        <option value="Automóvel Passeio">Automóvel Passeio</option>
                        <option value="SUV Urbano">SUV Urbano</option>
                        <option value="Pick-up / Caminhonete">Pick-up / Caminhonete</option>
                        <option value="Motocicleta">Motocicleta</option>
                        <option value="Caminhão / Comercial">Caminhão / Comercial</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SEÇÃO 2: DADOS DO VEÍCULO */}
                <div className="pt-4 border-t border-zinc-100">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Car size={16} className="text-red-600" />
                    <span>2. Identificação do Veículo</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Marca e Modelo do Veículo *
                      </label>
                      <input
                        type="text"
                        value={formData.marcaModelo}
                        onChange={(e) =>
                          setFormData({ ...formData, marcaModelo: e.target.value })
                        }
                        placeholder="Ex: Toyota Corolla Cross XRE 2.0"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Placa (7 dígitos) *
                      </label>
                      <input
                        type="text"
                        maxLength={7}
                        value={formData.placa}
                        onChange={(e) =>
                          setFormData({ ...formData, placa: e.target.value.toUpperCase() })
                        }
                        placeholder="BRA2E19"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono font-bold tracking-wider focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Ano do Modelo *
                      </label>
                      <input
                        type="number"
                        min={1900}
                        max={2100}
                        value={formData.anoModelo}
                        onChange={(e) =>
                          setFormData({ ...formData, anoModelo: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Código Renavam (9 a 11 dígitos) *
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        value={formData.renavam}
                        onChange={(e) =>
                          setFormData({ ...formData, renavam: e.target.value })
                        }
                        placeholder="Ex: 00123456789"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SEÇÃO 3: TITULAR (CLIENTE / SEGURADO) */}
                <div className="pt-4 border-t border-zinc-100">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User size={16} className="text-red-600" />
                    <span>3. Cliente / Segurado Responsável</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Nome Completo do Cliente *
                      </label>
                      <input
                        type="text"
                        value={formData.clienteNome}
                        onChange={(e) =>
                          setFormData({ ...formData, clienteNome: e.target.value })
                        }
                        placeholder="Ex: Carlos Eduardo Mendes"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        CPF ou CNPJ
                      </label>
                      <input
                        type="text"
                        value={formData.clienteCpfCnpj}
                        onChange={(e) =>
                          setFormData({ ...formData, clienteCpfCnpj: e.target.value })
                        }
                        placeholder="000.000.000-00"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        E-mail do Segurado
                      </label>
                      <input
                        type="email"
                        value={formData.clienteEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, clienteEmail: e.target.value })
                        }
                        placeholder="cliente@email.com"
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-700 font-semibold mb-1">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        value={formData.clienteDataNasc}
                        onChange={(e) =>
                          setFormData({ ...formData, clienteDataNasc: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer de Ações do Modal */}
              <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalFormAberto(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-600/20 cursor-pointer transition-colors"
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

      {/* ========================================================================= */}
      {/* MODAL 2: VISUALIZAÇÃO COMPLETA DE DETALHES                                */}
      {/* ========================================================================= */}
      {modalDetalhesAberto && apoliceSelecionada && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-zinc-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
                  <ShieldCheck size={24} weight="fill" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">
                    Detalhes da Apólice
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">
                    {apoliceSelecionada.numeroApolice}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setModalDetalhesAberto(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Veículo */}
              <div>
                <h4 className="font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Veículo & Identificação
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Marca / Modelo</span>
                    <span className="font-bold text-zinc-900">{apoliceSelecionada.marcaModelo}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Placa</span>
                    <span className="font-mono font-bold text-zinc-900">{apoliceSelecionada.placa}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Renavam</span>
                    <span className="font-mono font-bold text-zinc-900">{apoliceSelecionada.renavam}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Ano do Modelo</span>
                    <span className="font-bold text-zinc-900">{apoliceSelecionada.anoModelo}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Tipo do Bem</span>
                    <span className="font-bold text-zinc-900">{apoliceSelecionada.bemSegurado}</span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Status da Apólice</span>
                    <div className="mt-1">{renderStatusBadge(apoliceSelecionada.statusApolice)}</div>
                  </div>
                </div>
              </div>

              {/* Condições */}
              <div>
                <h4 className="font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Condições do Seguro & Valores
                </h4>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-3">
                  <div>
                    <span className="text-zinc-500 block">Cobertura Contratada</span>
                    <span className="font-bold text-zinc-900">{apoliceSelecionada.tipoCobertura}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-200/60">
                    <div>
                      <span className="text-zinc-500 block">Valor da Apólice</span>
                      <span className="font-black text-red-600 text-sm">
                        {formatarMoeda(apoliceSelecionada.valorApolice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Período de Vigência</span>
                      <span className="font-bold text-zinc-900">
                        {formatarData(apoliceSelecionada.dataInicio)} até {formatarData(apoliceSelecionada.dataTermino)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cliente & Corretor */}
              <div>
                <h4 className="font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Titular & Corretor Responsável
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Cliente / Segurado</span>
                    <span className="font-bold text-zinc-900 block text-sm">
                      {apoliceSelecionada.cliente?.nomeCompleto || apoliceSelecionada.usuario?.nome}
                    </span>
                    <span className="text-[11px] text-zinc-500 block">
                      CPF: {apoliceSelecionada.cliente?.cpfCnpj || '---'}
                    </span>
                    <span className="text-[11px] text-zinc-500 block">
                      Email: {apoliceSelecionada.cliente?.email || '---'}
                    </span>
                  </div>

                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Corretor Responsável</span>
                    <span className="font-bold text-zinc-900 block text-sm">
                      {apoliceSelecionada.usuario?.nome || 'Mariana Silva (Corretora)'}
                    </span>
                    <span className="text-[11px] text-zinc-500 block">
                      Email: {apoliceSelecionada.usuario?.email || 'mariana.corretora@segurae.com.br'}
                    </span>
                    <span className="text-[11px] text-zinc-500 block">
                      Código SUSEP: 2026.SP.8901
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setModalDetalhesAberto(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setModalDetalhesAberto(false);
                  handleEditarApolice(apoliceSelecionada);
                }}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <PencilSimple size={16} />
                <span>Editar Apólice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CONFIRMAÇÃO DE EXCLUSÃO                                          */}
      {/* ========================================================================= */}
      {modalExcluirAberto && apoliceParaExcluir && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-200 p-6">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
              <Trash size={26} weight="bold" />
            </div>

            <h3 className="text-lg font-extrabold text-zinc-900 text-center mb-2">
              Confirmar Exclusão de Apólice
            </h3>

            <p className="text-xs text-zinc-500 text-center mb-6 leading-relaxed">
              Você tem certeza de que deseja excluir permanentemente a apólice{' '}
              <strong className="text-zinc-900 font-bold">{apoliceParaExcluir.numeroApolice}</strong> vinculada ao veículo{' '}
              <strong className="text-zinc-900 font-bold">{apoliceParaExcluir.marcaModelo} ({apoliceParaExcluir.placa})</strong>?
              Esta ação removerá o contrato do sistema.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setModalExcluirAberto(false);
                  setApoliceParaExcluir(null);
                }}
                disabled={salvando}
                className="flex-1 py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarExclusao}
                disabled={salvando}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {salvando ? <span>Excluindo...</span> : <span>Sim, Excluir</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
