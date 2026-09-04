import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  ShieldCheck,
  FileText,
  Lightning,
  MagnifyingGlass,
  CalendarCheck,
  PhoneCall,
  X,
  SignOut,
  Info,
  CheckCircle,
  WarningCircle,
  ArrowSquareOut,
} from '@phosphor-icons/react';
import { AuthContext } from '../../contexts/AuthContext';
import type Apolice from '../../models/Apolice';
import { ToastAlerta } from '../../utils/toastalerta/ToastAlerta';

const APOLICES_INICIAIS: Apolice[] = [
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
      id: 1,
      nomeCompleto: 'Carlos Eduardo Mendes',
      email: 'carlos.mendes@email.com',
      cpfCnpj: '123.456.789-00',
      dataNascimento: '1988-04-12',
    },
    usuario: {
      id: 2,
      nome: 'Roberto Dias (Corretor)',
      email: 'roberto.corretor@segurae.com.br',
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
];

export default function ListagemApolices() {
  const navigate = useNavigate();
  const { usuario, handleLogout } = useContext(AuthContext);

  const isAutenticado = Boolean(usuario && usuario.token && usuario.token.trim() !== '');
  const isCliente = isAutenticado && (usuario.perfil === 'ROLE_CLIENTE' || usuario.perfil === 'cliente');

  // Proteção da rota da Área do Cliente
  useEffect(() => {
    if (!isAutenticado) {
      ToastAlerta('Você precisa estar logado para acessar a Área do Cliente.', 'info');
      navigate('/login', { state: { tipoAcesso: 'cliente' }, replace: true });
    } else if (!isCliente) {
      ToastAlerta('Acesso negado: Seu perfil é de Corretor e não possui permissão para a Área do Cliente.', 'erro');
      navigate('/corretor', { replace: true });
    }
  }, [isAutenticado, isCliente, navigate]);

  const [apolices] = useState<Apolice[]>(APOLICES_INICIAIS);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativas' | 'vencidas'>('todas');
  const [apoliceSelecionada, setApoliceSelecionada] = useState<Apolice | null>(null);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarData = (dataStr: string) => {
    if (!dataStr) return '-';
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
  };

  const apolicesFiltradas = apolices.filter((apolice) => {
    const termo = busca.toLowerCase();
    const bateBusca =
      apolice.marcaModelo.toLowerCase().includes(termo) ||
      apolice.placa.toLowerCase().includes(termo) ||
      (apolice.numeroApolice && apolice.numeroApolice.toLowerCase().includes(termo));

    if (filtroStatus === 'ativas') {
      return bateBusca && apolice.statusApolice === 1;
    }
    if (filtroStatus === 'vencidas') {
      return bateBusca && apolice.statusApolice === 2;
    }
    return bateBusca;
  });

  const totalAtivas = apolices.filter((a) => a.statusApolice === 1).length;

  if (!isAutenticado || !isCliente) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 px-6 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://ik.imagekit.io/JohnnieDiniz/segurae/escudo-segurade%20(1).svg"
              alt="Logo Seguraê"
              className="w-8 h-8"
            />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 leading-none">
                Seguraê
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-600">
                Área do Cliente
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-zinc-200">
              <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm uppercase">
                {usuario.nome ? usuario.nome.charAt(0) : 'C'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-zinc-900">{usuario.nome || 'Carlos Eduardo'}</p>
                <p className="text-[11px] text-zinc-500">{usuario.usuario || usuario.email || 'carlos.mendes@email.com'}</p>
              </div>
            </div>

            <button
              onClick={() => {
                handleLogout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-red-600 hover:bg-red-50 border border-zinc-200 transition-colors cursor-pointer"
            >
              <SignOut size={16} weight="bold" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-zinc-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Proteção Ativa • Assistência 24 Horas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Minhas Apólices de Seguro
            </h1>
            <p className="text-zinc-300 text-sm">
              Consulte seus veículos segurados, emita segundas vias e acione guincho ou assistência 24h a qualquer momento.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={() =>
                alert(
                  '🚨 Central de Guincho e Emergência acionada!\n\nUm atendente entrará em contato ou você pode ligar diretamente para 0800 700 8020.'
                )
              }
              className="w-full sm:w-auto px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-red-600/40 transition-all cursor-pointer"
            >
              <Lightning size={20} weight="fill" />
              <span>Acionar Guincho 24h</span>
            </button>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Car size={26} weight="fill" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Veículos Segurados</p>
              <p className="text-2xl font-black text-zinc-900">{apolices.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={26} weight="fill" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Apólices Ativas</p>
              <p className="text-2xl font-black text-emerald-600">{totalAtivas}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <PhoneCall size={26} weight="fill" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-medium">Sinistro e Suporte</p>
              <p className="text-base font-bold text-zinc-900">0800 700 8020</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <MagnifyingGlass size={18} />
            </span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por placa, modelo ou apólice..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setFiltroStatus('todas')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filtroStatus === 'todas'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Todas ({apolices.length})
            </button>

            <button
              onClick={() => setFiltroStatus('ativas')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filtroStatus === 'ativas'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Ativas ({totalAtivas})
            </button>

            <button
              onClick={() => setFiltroStatus('vencidas')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filtroStatus === 'vencidas'
                  ? 'bg-amber-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Vencidas ({apolices.length - totalAtivas})
            </button>
          </div>
        </div>

        {apolicesFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-zinc-300 p-12 text-center my-6">
            <Car size={48} className="mx-auto text-zinc-300 mb-3" />
            <h3 className="text-lg font-bold text-zinc-800 mb-1">Nenhuma apólice encontrada</h3>
            <p className="text-sm text-zinc-500 mb-6">
              Não encontramos apólices com os termos ou filtros selecionados.
            </p>
            <button
              onClick={() => {
                setBusca('');
                setFiltroStatus('todas');
              }}
              className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apolicesFiltradas.map((apolice) => {
              const isAtiva = apolice.statusApolice === 1;

              return (
                <div
                  key={apolice.id}
                  className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 border-b border-zinc-100">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="inline-block px-2.5 py-1 bg-zinc-900 text-white font-mono font-black text-xs rounded-md tracking-wider mb-2 border border-zinc-700">
                          {apolice.placa}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-zinc-900 leading-tight">
                          {apolice.marcaModelo}
                        </h3>
                        <p className="text-xs text-zinc-500">
                          Ano: {apolice.anoModelo} • Renavam: {apolice.renavam}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          isAtiva
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isAtiva ? (
                          <>
                            <CheckCircle size={14} weight="fill" />
                            <span>Ativa</span>
                          </>
                        ) : (
                          <>
                            <WarningCircle size={14} weight="fill" />
                            <span>Vencida</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                        <span className="text-zinc-500 block">Nº da Apólice</span>
                        <span className="font-mono font-bold text-zinc-800">
                          {apolice.numeroApolice}
                        </span>
                      </div>
                      <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                        <span className="text-zinc-500 block">Valor do Seguro</span>
                        <span className="font-bold text-red-600">
                          {formatarMoeda(apolice.valorApolice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-3 text-xs">
                    <div>
                      <span className="text-zinc-500 font-semibold block mb-1">
                        Cobertura Contratada
                      </span>
                      <p className="font-medium text-zinc-800 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                        {apolice.tipoCobertura}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-zinc-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <CalendarCheck size={16} className="text-zinc-400" />
                        <span>Vigência:</span>
                      </div>
                      <span className="font-semibold text-zinc-900">
                        {formatarData(apolice.dataInicio)} até {formatarData(apolice.dataTermino)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setApoliceSelecionada(apolice)}
                      className="flex-1 py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Info size={16} weight="bold" />
                      <span>Ver Detalhes</span>
                    </button>

                    <button
                      onClick={() =>
                        alert(
                          `Gerando 2ª via da Apólice ${apolice.numeroApolice} em formato PDF...`
                        )
                      }
                      className="py-2.5 px-4 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-zinc-200 transition-colors cursor-pointer"
                    >
                      <FileText size={16} />
                      <span>2ª Via (PDF)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {apoliceSelecionada && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-zinc-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-zinc-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center">
                  <ShieldCheck size={22} weight="fill" />
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
                onClick={() => setApoliceSelecionada(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Veículo e Identificação
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Marca / Modelo</span>
                    <span className="font-bold text-zinc-900">
                      {apoliceSelecionada.marcaModelo}
                    </span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Placa</span>
                    <span className="font-mono font-bold text-zinc-900">
                      {apoliceSelecionada.placa}
                    </span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Renavam</span>
                    <span className="font-mono font-bold text-zinc-900">
                      {apoliceSelecionada.renavam}
                    </span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Ano do Modelo</span>
                    <span className="font-bold text-zinc-900">
                      {apoliceSelecionada.anoModelo}
                    </span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Bem Segurado</span>
                    <span className="font-bold text-zinc-900">
                      {apoliceSelecionada.bemSegurado}
                    </span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Status Atual</span>
                    <span
                      className={`font-bold ${
                        apoliceSelecionada.statusApolice === 1
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {apoliceSelecionada.statusApolice === 1 ? 'Ativa' : 'Vencida'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Condições do Seguro
                </h4>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-3 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Cobertura</span>
                    <span className="font-bold text-zinc-900">
                      {apoliceSelecionada.tipoCobertura}
                    </span>
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
                        {formatarData(apoliceSelecionada.dataInicio)} até{' '}
                        {formatarData(apoliceSelecionada.dataTermino)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                  Titular & Corretor Responsável
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Segurado (Cliente)</span>
                    <span className="font-bold text-zinc-900 block">
                      {apoliceSelecionada.cliente?.nomeCompleto}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      CPF: {apoliceSelecionada.cliente?.cpfCnpj}
                    </span>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <span className="text-zinc-500 block">Corretor Responsável</span>
                    <span className="font-bold text-zinc-900 block">
                      {apoliceSelecionada.usuario?.nome}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {apoliceSelecionada.usuario?.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setApoliceSelecionada(null)}
                className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert(`Iniciando download do espelho da Apólice ${apoliceSelecionada.numeroApolice}...`);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowSquareOut size={16} />
                <span>Imprimir Apólice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
