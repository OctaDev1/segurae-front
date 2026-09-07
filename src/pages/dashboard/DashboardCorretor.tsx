import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
import { AuthContext } from "../../contexts/AuthContext";
import type Apolice from "../../models/Apolice";
import type Cliente from "../../models/Cliente";
import { buscar } from "../../services/Service";
import { 
  Briefcase, 
  Users, 
  FilePlus, 
  TrendUp, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  CurrencyCircleDollar,
  Handshake
} from "@phosphor-icons/react";

const getAuthHeader = (token?: string) => {
  const tokenFinal = token || localStorage.getItem("token") || "";
  if (!tokenFinal) return {};
  const tokenFormatado = tokenFinal.startsWith("Bearer ") ? tokenFinal : `Bearer ${tokenFinal}`;
  return { headers: { Authorization: tokenFormatado } };
};

export default function DashboardCorretor() {
  const navigate = useNavigate();
  const { usuario, handleLogout } = useContext(AuthContext);

  const nomeExibicao = usuario?.nome || localStorage.getItem("nome") || "Corretor Parceiro";
  const emailExibicao = usuario?.usuario || localStorage.getItem("usuario") || "corretor@segurae.com";

  // Estados para dados reais do Render
  const [apolices, setApolices] = useState<Apolice[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Buscar dados da API do Render ao carregar o dashboard
  const carregarDadosReais = useCallback(async () => {
    setCarregando(true);
    try {
      const header = getAuthHeader(usuario?.token);
      const [resApolices, resClientes] = await Promise.all([
        buscar("/apolices", undefined, header).catch(() => []),
        buscar("/clientes", undefined, header).catch(() => [])
      ]);

      if (Array.isArray(resApolices)) {
        setApolices(resApolices);
      }
      if (Array.isArray(resClientes)) {
        setClientes(resClientes);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  useEffect(() => {
    carregarDadosReais();
  }, [carregarDadosReais]);

  // Cálculos dinâmicos baseados estritamente na API do Render
  const statsReais = useMemo(() => {
    const totalClientes = clientes.length;
    const totalApolices = apolices.length;
    const apolicesAtivas = apolices.filter((a) => a.statusApolice === 1).length;
    const apolicesPendentes = apolices.filter((a) => a.statusApolice === 0).length;
    
    // Soma do valor das apólices ativas para a comissão/prêmio
    const valorPrêmioTotal = apolices
      .filter((a) => a.statusApolice === 1)
      .reduce((acc, curr) => acc + (Number(curr.valorApolice) || 0), 0);

    return {
      totalClientes,
      totalApolices,
      apolicesAtivas,
      apolicesPendentes,
      valorPrêmioTotal
    };
  }, [apolices, clientes]);

  const formatarMoeda = (valor: number) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 text-zinc-900 relative flex flex-col justify-between">
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 lg:px-16 pt-36 pb-24 w-full">
        {/* Cabeçalho do Dashboard Corretor */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-zinc-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              <Briefcase size={14} weight="bold" className="text-red-500" />
              <span>Painel de Gestão do Corretor</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Bem-vindo, <span className="text-red-600">{nomeExibicao}</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Gerencie sua carteira de segurados, acompanhe comissões e emita novas apólices em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/corretor/apolices"
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
            >
              <FilePlus size={16} weight="bold" />
              <span>Gerenciar Apólices</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                handleLogout();
                navigate("/");
              }}
              className="px-5 py-2.5 rounded-full border border-zinc-300 hover:border-red-600 text-zinc-700 hover:text-red-600 text-sm font-medium transition-colors cursor-pointer"
            >
              Encerrar Sessão
            </button>
          </div>
        </div>

        {/* Métricas de Performance do Corretor (Dinâmicas do Render) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Card 1: Carteira Ativa */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Carteira de Clientes
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={18} weight="bold" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-1">
              {carregando ? "..." : statsReais.totalClientes}{" "}
              <span className="text-xs font-normal text-zinc-500">segurados</span>
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendUp size={14} weight="bold" /> Sincronizado com API
            </p>
          </div>

          {/* Card 2: Apólices Emitidas */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Apólices Emitidas
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldCheck size={18} weight="bold" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-1">
              {carregando ? "..." : statsReais.apolicesAtivas}{" "}
              <span className="text-xs font-normal text-zinc-500">vigentes</span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">
              Total cadastradas: {statsReais.totalApolices}
            </p>
          </div>

          {/* Card 3: Comissões Estimadas */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Prêmio / Comissão Ativa
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CurrencyCircleDollar size={18} weight="bold" />
              </div>
            </div>
            <h3 className="text-xl lg:text-2xl font-black text-emerald-600 mb-1 truncate">
              {carregando ? "..." : formatarMoeda(statsReais.valorPrêmioTotal)}
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">
              Baseado nas apólices ativas
            </p>
          </div>

          {/* Card 4: Cotações em Análise */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Cotações Abertas
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={18} weight="bold" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-amber-600 mb-1">
              {carregando ? "..." : statsReais.apolicesPendentes}{" "}
              <span className="text-xs font-normal text-zinc-500">pendentes</span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">
              Aguardando fechamento
            </p>
          </div>
        </div>

        {/* Seção de Ações e Ferramentas do Corretor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Card Ação: Gestão de Apólices */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <FilePlus size={20} weight="bold" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-1">
                Central de Apólices
              </h4>
              <p className="text-xs text-zinc-500 mb-6">
                Consulte o banco de dados completo de apólices, emita novas coberturas e efetue alterações contratuais.
              </p>
            </div>
            <Link
              to="/corretor/apolices"
              className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <span>Acessar listagem e cadastros</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          {/* Card Ação: Simulador de Coberturas */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Handshake size={20} weight="bold" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-1">
                Tabela de Coberturas
              </h4>
              <p className="text-xs text-zinc-500 mb-6">
                Revise os planos disponíveis na Seguraê para orientar a contratação ideal para seu cliente segurado.
              </p>
            </div>
            <Link
              to="/coberturas"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>Consultar modalidades</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          {/* Card Ação: Perfil Profissional */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-zinc-100 text-zinc-800 flex items-center justify-center mb-4">
                <Briefcase size={20} weight="bold" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-1">
                Credencial de Corretor
              </h4>
              <p className="text-xs text-zinc-500 mb-2 truncate">
                {emailExibicao}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Habilitado SUSEP / Seguraê</span>
              </div>
            </div>
            <div className="text-[11px] text-zinc-400">
              Permissões completas de criação e edição liberadas via RBAC.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}