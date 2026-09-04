import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import Footer from "../../components/footer/Footer";
import { AuthContext } from "../../contexts/AuthContext";
import { 
  ShieldCheck, 
  Car, 
  Wrench, 
  FileText, 
  PhoneCall, 
  ClockCountdown, 
  User, 
  CheckCircle 
} from "@phosphor-icons/react";

export default function DashboardCliente() {
  const navigate = useNavigate();
  const { usuario, handleLogout } = useContext(AuthContext);

  const nomeExibicao = usuario.nome || localStorage.getItem("nome") || "Cliente Seguraê";
  const emailExibicao = usuario.usuario || localStorage.getItem("usuario") || "cliente@segurae.com";

  return (
    <div className="w-full min-h-screen bg-zinc-50 text-zinc-900 relative flex flex-col justify-between">
      <NavBar />

      <main className="max-w-7xl mx-auto px-6 lg:px-16 pt-36 pb-24 w-full">
        {/* Cabeçalho do Dashboard Cliente */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-100 mb-2">
              <ShieldCheck size={14} weight="bold" />
              <span>Painel Exclusivo do Segurado</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Olá, <span className="text-red-600">{nomeExibicao}</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Acompanhe suas proteções ativas, acione socorro 24 horas e gerencie sua apólice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/apolices"
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all shadow-md shadow-red-600/20"
            >
              Ver Minhas Apólices
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

        {/* Grid de Cards de Destaque */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Seguro Vigente */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Car size={16} weight="bold" className="text-red-600" />
                  Veículo Protegido
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1">
                  <CheckCircle size={12} weight="fill" />
                  Ativa
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-1">
                Seguro Auto Essencial Plus
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                Apólice digital vinculada ao CPF cadastrado
              </p>
            </div>
            
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
              <span className="flex items-center gap-1">
                <ClockCountdown size={14} weight="bold" />
                Vigência até:
              </span>
              <span className="font-semibold text-zinc-900">Dezembro / 2026</span>
            </div>
          </div>

          {/* Card 2: Assistência Rápida 24h */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Wrench size={16} weight="bold" className="text-amber-500" />
                  Socorro Emergencial
                </span>
                <span className="text-red-600 font-bold text-xs bg-red-50 px-2 py-0.5 rounded-full">
                  24h Online
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-1">
                Guincho, Chaveiro e Pane
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                Acione com geolocalização e acompanhe a chegada do profissional.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
              >
                <PhoneCall size={14} weight="bold" />
                <span>Chamar Guincho via WhatsApp &rarr;</span>
              </a>
            </div>
          </div>

          {/* Card 3: Dados da Conta */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <User size={16} weight="bold" className="text-zinc-600" />
                  Minha Conta
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                  Segurado
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-1 truncate">
                {emailExibicao}
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                Acesso verificado com criptografia JWT.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
              <span>Status:</span>
              <span className="font-semibold text-emerald-600">Sessão Autenticada</span>
            </div>
          </div>
        </div>

        {/* Resumo de Coberturas */}
        <div className="bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-xs mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">
                Coberturas Inclusas no seu Plano
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Proteções ativas contratadas na Seguraê
              </p>
            </div>
            <Link
              to="/coberturas"
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Ver detalhes do plano &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { titulo: "Colisão e Incêndio", status: "100% Tabela FIPE", icon: Car },
              { titulo: "Roubo e Furto", status: "Proteção Integral", icon: ShieldCheck },
              { titulo: "Danos a Terceiros", status: "Até R$ 150.000", icon: FileText },
              { titulo: "Carro Reserva", status: "Até 15 dias corridos", icon: ClockCountdown },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <IconComp size={16} weight="bold" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">{item.titulo}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}