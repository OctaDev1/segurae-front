import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
import { AuthContext } from "../../contexts/AuthContext";
import { 
  Briefcase, 
  Users, 
  FilePlus, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  CurrencyCircleDollar,
  Handshake,
  ArrowCounterClockwise,
  CheckCircle,
  WarningCircle,
  Car,
  CaretRight
} from "@phosphor-icons/react";
import type Apolice from "../../models/Apolice";
import type Cliente from "../../models/Cliente";
import type Usuario from "../../models/Usuario";
import { buscar, getAuthHeaders } from "../../services/Service";
import { getClientesExcluidos, isClienteExcluido, getClientesCorretor, APOLICES_INICIAIS_SISTEMA } from "../../utils/corretorUtils";

export default function DashboardCorretor() {
  const navigate = useNavigate();
  const { usuario, handleLogout } = useContext(AuthContext);

  const nomeExibicao = usuario.nome || localStorage.getItem("nome") || "Corretor Parceiro";
  const emailExibicao = usuario.usuario || localStorage.getItem("usuario") || "corretor@segurae.com";

  // Estados com dados reais
  const [apolices, setApolices] = useState<Apolice[]>(() => {
    const salvasCompartilhadas = localStorage.getItem("segurae_apolices_compartilhadas");
    if (salvasCompartilhadas) {
      try {
        const parsed = JSON.parse(salvasCompartilhadas);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    const salvas = localStorage.getItem("segurae_apolices_corretor");
    if (salvas) {
      try {
        const parsed = JSON.parse(salvas);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return APOLICES_INICIAIS_SISTEMA;
  });

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    return getClientesCorretor();
  });
  const [usuariosClientes, setUsuariosClientes] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Carregar dados reais da API com resiliência para não sobrescrever dados locais
  const carregarDadosReais = useCallback(async () => {
    setCarregando(true);
    try {
      const header = getAuthHeaders(usuario?.token);
      const [resApolices, resClientes, resUsuarios] = await Promise.allSettled([
        buscar<Apolice[]>("/apolices", undefined, header),
        buscar<Cliente[]>("/clientes", undefined, header),
        buscar<Usuario[]>("/usuarios", undefined, header),
      ]);

      if (resApolices.status === "fulfilled" && Array.isArray(resApolices.value) && resApolices.value.length > 0) {
        const localApolicesRaw =
          localStorage.getItem("segurae_apolices_corretor") ||
          localStorage.getItem("segurae_apolices_compartilhadas");
        let localApolices: Apolice[] = [];
        if (localApolicesRaw) {
          try {
            localApolices = JSON.parse(localApolicesRaw);
          } catch {
            localApolices = [];
          }
        }
        const map = new Map<string | number, Apolice>();
        resApolices.value.forEach((a: Apolice) => {
          const k = a.id ?? a.numeroApolice;
          if (k !== undefined && k !== '') map.set(k, a);
        });
        localApolices.forEach((a: Apolice) => {
          const k = a.id ?? a.numeroApolice;
          if (k !== undefined && k !== '') map.set(k, a);
        });
        const merged = Array.from(map.values());
        setApolices(merged);
        localStorage.setItem("segurae_apolices_compartilhadas", JSON.stringify(merged));
        localStorage.setItem("segurae_apolices_corretor", JSON.stringify(merged));
      }

      if (resClientes.status === "fulfilled" && Array.isArray(resClientes.value)) {
        const listaDaApi = resClientes.value as Cliente[];
        setClientes((prev) => {
          const map = new Map<string, Cliente>();
          prev.forEach((c) => map.set((c.email || c.nomeCompleto || String(c.id)).toLowerCase().trim(), c));
          listaDaApi.forEach((c: Cliente) => {
            const k = (c.email || c.nomeCompleto || String(c.id)).toLowerCase().trim();
            if (!map.has(k)) map.set(k, c);
          });
          return Array.from(map.values());
        });
      }

      if (resUsuarios.status === "fulfilled" && Array.isArray(resUsuarios.value)) {
        setUsuariosClientes(resUsuarios.value.filter((u: Usuario) => u.perfil === "ROLE_CLIENTE"));
      }
    } catch (error) {
      console.warn("Aviso: Falha ao atualizar dados em tempo real da API:", error);
    } finally {
      setCarregando(false);
    }
  }, [usuario]);

  useEffect(() => {
    carregarDadosReais();
  }, [carregarDadosReais]);

  // Métricas calculadas dinamicamente com base nas apólices reais
  const metricas = useMemo(() => {
    const excluidos = getClientesExcluidos();

    const isExcluido = (id?: number, email?: string, nome?: string) => {
      return isClienteExcluido({ id, email, nomeCompleto: nome }, excluidos);
    };

    const apolicesValidas = apolices.filter((a) => {
      if (a.cliente && isExcluido(a.cliente.id, a.cliente.email, a.cliente.nomeCompleto)) return false;
      if (a.usuario && isExcluido(a.usuario.id, a.usuario.usuario || a.usuario.email, a.usuario.nome)) return false;
      return true;
    });

    const totalApolices = apolicesValidas.length;
    const ativas = apolicesValidas.filter((a) => a.statusApolice === 1).length;
    const vencidas = apolicesValidas.filter((a) => a.statusApolice === 2).length;
    const pendentes = apolicesValidas.filter((a) => a.statusApolice === 0).length;

    // Identificação de clientes únicos
    const mapClientesUnicos = new Set<string>();
    apolicesValidas.forEach((a) => {
      if (a.cliente?.email) {
        mapClientesUnicos.add(a.cliente.email.toLowerCase().trim());
      } else if (a.cliente?.nomeCompleto) {
        mapClientesUnicos.add(a.cliente.nomeCompleto.toLowerCase().trim());
      }
    });
    clientes.forEach((c) => {
      if (c.email && !isExcluido(c.id, c.email, c.nomeCompleto)) {
        mapClientesUnicos.add(c.email.toLowerCase().trim());
      }
    });
    usuariosClientes.forEach((u) => {
      const uEmail = u.usuario || u.email;
      if (uEmail && !isExcluido(u.id, uEmail, u.nome)) {
        mapClientesUnicos.add(uEmail.toLowerCase().trim());
      }
    });

    const totalClientes = mapClientesUnicos.size;

    // Soma total de valores segurados
    const valorTotalSobGestao = apolicesValidas.reduce(
      (acc, curr) => acc + (Number(curr.valorApolice) || 0),
      0
    );

    // Soma de apólices ativas
    const valorAtivas = apolicesValidas
      .filter((a) => a.statusApolice === 1)
      .reduce((acc, curr) => acc + (Number(curr.valorApolice) || 0), 0);

    // Repasse de comissão estimada do corretor (15% sobre as apólices ativas)
    const comissaoEstimada = valorAtivas * 0.15;

    return {
      totalApolices,
      ativas,
      vencidas,
      pendentes,
      totalClientes,
      valorTotalSobGestao,
      comissaoEstimada,
    };
  }, [apolices, clientes, usuariosClientes]);

  const formatarMoeda = (valor: number) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarData = (dataStr?: string) => {
    if (!dataStr) return "-";
    const partes = dataStr.split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
  };

  // As 5 apólices mais recentes para a tabela
  const apolicesRecentes = useMemo(() => {
    return [...apolices].reverse().slice(0, 5);
  }, [apolices]);

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
              Acompanhe sua carteira de segurados, comissões em tempo real e emissões de apólices.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={carregarDadosReais}
              disabled={carregando}
              title="Atualizar dados da API"
              className="p-2.5 rounded-full border border-zinc-300 hover:border-zinc-400 bg-white text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer shadow-xs"
            >
              <ArrowCounterClockwise
                size={18}
                className={carregando ? "animate-spin text-red-600" : ""}
              />
            </button>

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

        {/* Métricas de Performance Reais do Corretor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Card 1: Carteira Ativa (Link para Gestão de Clientes) */}
          <Link
            to="/corretor/apolices?aba=clientes"
            className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs hover:border-blue-500 hover:shadow-md transition-all group block cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 group-hover:text-blue-600 transition-colors">
                Carteira de Clientes
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users size={18} weight="bold" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-1">
              {metricas.totalClientes}{" "}
              <span className="text-xs font-normal text-zinc-500">segurado(s)</span>
            </h3>
            <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
              <span>Gerenciar e excluir clientes</span>
              <CaretRight size={12} weight="bold" />
            </p>
          </Link>

          {/* Card 2: Apólices Emitidas */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Apólices Vigentes
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldCheck size={18} weight="bold" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-1">
              {metricas.ativas}{" "}
              <span className="text-xs font-normal text-zinc-500">
                de {metricas.totalApolices} total
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">
              {metricas.vencidas} vencida(s) • {metricas.pendentes} em análise
            </p>
          </div>

          {/* Card 3: Volume Sob Gestão */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Volume sob Gestão
              </span>
              <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
                <Car size={18} weight="bold" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-zinc-900 mb-1">
              {formatarMoeda(metricas.valorTotalSobGestao)}
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">
              Prêmio total de veículos segurados
            </p>
          </div>

          {/* Card 4: Comissões Estimadas */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Comissão Estimada (15%)
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CurrencyCircleDollar size={18} weight="bold" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-emerald-600 mb-1">
              {formatarMoeda(metricas.comissaoEstimada)}
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium">
              Calculada sobre as apólices ativas
            </p>
          </div>
        </div>

        {/* Seção: Apólices Recentes em Tempo Real */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <span>Últimas Apólices em Gestão</span>
                <span className="text-xs bg-zinc-100 text-zinc-600 font-semibold px-2.5 py-0.5 rounded-full">
                  {apolices.length} no total
                </span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Contratos emitidos recentemente e sincronizados diretamente com a base Seguraê.
              </p>
            </div>

            <Link
              to="/corretor/apolices"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <span>Ver todas no painel</span>
              <CaretRight size={14} weight="bold" />
            </Link>
          </div>

          {apolicesRecentes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck size={24} />
              </div>
              <p className="text-sm font-bold text-zinc-700">Nenhuma apólice cadastrada ainda</p>
              <p className="text-xs text-zinc-400 mt-1 mb-4">
                Comece emitindo sua primeira apólice para seu segurado.
              </p>
              <Link
                to="/corretor/apolices"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-red-700 transition-colors"
              >
                <FilePlus size={16} />
                <span>Emitir Nova Apólice</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Nº Apólice</th>
                    <th className="pb-3 font-semibold">Cliente / Titular</th>
                    <th className="pb-3 font-semibold">Veículo</th>
                    <th className="pb-3 font-semibold">Cobertura</th>
                    <th className="pb-3 font-semibold">Valor</th>
                    <th className="pb-3 font-semibold">Vigência</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {apolicesRecentes.map((ap) => (
                    <tr key={ap.id || ap.numeroApolice} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-zinc-800">
                        {ap.numeroApolice || `SEG-${ap.id}`}
                      </td>
                      <td className="py-3.5">
                        <div className="font-bold text-zinc-900">
                          {ap.cliente?.nomeCompleto || "Carlos Eduardo Mendes"}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {ap.cliente?.email || "carlos.mendes@email.com"}
                        </div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-zinc-800">{ap.marcaModelo}</div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          {ap.placa || "BRA2E19"} • {ap.anoModelo || 2024}
                        </div>
                      </td>
                      <td className="py-3.5 text-zinc-600 max-w-[200px] truncate">
                        {ap.tipoCobertura || "Completo (Colisão e Terceiros)"}
                      </td>
                      <td className="py-3.5 font-black text-zinc-900">
                        {formatarMoeda(Number(ap.valorApolice) || 0)}
                      </td>
                      <td className="py-3.5 text-zinc-500 font-mono text-[11px]">
                        {formatarData(ap.dataTermino)}
                      </td>
                      <td className="py-3.5 text-center">
                        {ap.statusApolice === 1 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle size={12} weight="fill" />
                            <span>Ativa</span>
                          </span>
                        )}
                        {ap.statusApolice === 2 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                            <WarningCircle size={12} weight="fill" />
                            <span>Vencida</span>
                          </span>
                        )}
                        {ap.statusApolice === 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
                            <Clock size={12} weight="fill" />
                            <span>Em Análise</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
                Revise os 3 planos oficiais disponíveis na Seguraê para orientar a contratação ideal para seu cliente segurado.
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