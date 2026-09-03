import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/toastalerta/ToastAlerta";

export default function Dashboard() {
  const navigate = useNavigate();
  const { usuario, handleLogout } = useContext(AuthContext);

  // Proteção da rota de Dashboard: caso não autenticado, avisa e redireciona
  useEffect(() => {
    if (!usuario.token) {
      ToastAlerta("Você precisa estar logado para acessar o Dashboard.", "info");
      navigate("/");
    }
  }, [usuario.token, navigate]);

  if (!usuario.token) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50 text-zinc-900 relative flex flex-col justify-between">
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 lg:px-16 pt-36 pb-24 w-full">
        {/* Cabeçalho do Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-100 mb-2">
              Painel do Segurado
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Bem-vindo,{" "}
              <span className="text-red-600">
                {usuario.nome ? usuario.nome : "Cliente Seguraê"}
              </span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Acompanhe suas proteções ativas, acione serviços e gerencie seus dados.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              handleLogout();
              navigate("/");
            }}
            className="self-start md:self-auto px-5 py-2.5 rounded-full border border-zinc-300 hover:border-red-600 text-zinc-700 hover:text-red-600 text-sm font-medium transition-colors cursor-pointer"
          >
            Encerrar Sessão
          </button>
        </div>

        {/* Grid de Cards do Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Apólice Ativa */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Apólice Vigente
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                Ativa
              </span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-1">
              Seguro Auto Completo
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Apólice nº 849.204.112-00
            </p>
            <div className="pt-4 border-t border-zinc-100 flex justify-between text-xs text-zinc-600">
              <span>Validade:</span>
              <span className="font-semibold text-zinc-900">Dezembro / 2026</span>
            </div>
          </div>

          {/* Card 2: Assistência 24 Horas */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Suporte Imediato
              </span>
              <span className="text-red-600 font-bold text-xs">24h / 7 dias</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-1">
              Guincho & Chaveiro
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Acione socorro com rastreamento em tempo real.
            </p>
            <div className="pt-4 border-t border-zinc-100">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5"
              >
                Solicitar Guicho Agora &rarr;
              </a>
            </div>
          </div>

          {/* Card 3: Dados Cadastrais */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Sua Conta
              </span>
              <span className="text-zinc-400 text-xs">ID #{usuario.id || 1}</span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-1 truncate">
              {usuario.usuario || "usuario@segurae.com"}
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Cadastro verificado e protegido.
            </p>
            <div className="pt-4 border-t border-zinc-100 flex justify-between text-xs text-zinc-600">
              <span>Status do Token:</span>
              <span className="font-semibold text-emerald-600">Autenticado</span>
            </div>
          </div>
        </div>

        {/* Resumo de Coberturas */}
        <div className="bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">
            Suas Coberturas Inclusas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { titulo: "Colisão e Incêndio", status: "100% Tabela FIPE" },
              { titulo: "Roubo e Furto", status: "Proteção Integral" },
              { titulo: "Danos a Terceiros", status: "Até R$ 150.000" },
              { titulo: "Carro Reserva", status: "Até 15 dias" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-50 border border-zinc-100"
              >
                <p className="text-sm font-semibold text-zinc-900">
                  {item.titulo}
                </p>
                <p className="text-xs text-zinc-500 mt-1">{item.status}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
