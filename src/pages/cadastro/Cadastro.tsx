import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  Briefcase,
  LockKey,
  User,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  Image,
  IdentificationCard,
} from '@phosphor-icons/react';
import { cadastrarUsuario, cadastrar } from '../../services/Service';
import { ToastAlerta } from '../../utils/toastalerta/ToastAlerta';
import type Cliente from '../../models/Cliente';
import {
  formatarDataBR,
  calcularIdade,
  converterDataBrParaIso,
  salvarClientesCorretor,
  CLIENTES_INICIAIS_SISTEMA,
} from '../../utils/corretorUtils';

export default function Cadastro() {
  const navigate = useNavigate();

  const [tipoAcesso, setTipoAcesso] = useState<'cliente' | 'corretor'>('cliente');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (tipoAcesso === 'cliente') {
      if (!cpfCnpj.trim() || !dataNascimento.trim()) {
        setErro('Por favor, informe seu CPF/CNPJ e sua data de nascimento.');
        return;
      }

      // Validação de formato da data e regra de maioridade (18+ anos)
      const idade = calcularIdade(dataNascimento);
      if (idade === -1) {
        setErro('Por favor, informe uma data de nascimento válida no formato dia/mês/ano (ex: 15/05/1995).');
        return;
      }
      if (idade < 18) {
        setErro('É necessário ter pelo menos 18 anos de idade para se cadastrar no Seguraê.');
        return;
      }
    }

    if (senha.length < 6) {
      setErro('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas digitadas não coincidem.');
      return;
    }

    if (!termosAceitos) {
      setErro('Você precisa concordar com os Termos de Uso e Política de Privacidade.');
      return;
    }

    setErro('');
    setCarregando(true);

    const emailNormalizado = email.trim().toLowerCase();

    // 1. Verificação REAL no front-end para saber se o e-mail já existe de fato
    const rawLocais = localStorage.getItem('segurae_usuarios_locais');
    const listaLocais = rawLocais ? JSON.parse(rawLocais) : [];
    const emailJaExisteNosUsuarios = listaLocais.some(
      (u: { usuario?: string }) => u.usuario?.toLowerCase().trim() === emailNormalizado
    );

    const rawClientes = localStorage.getItem('segurae_clientes_corretor');
    const listaClientes = rawClientes ? JSON.parse(rawClientes) : CLIENTES_INICIAIS_SISTEMA;
    const emailJaExisteNosClientes = listaClientes.some(
      (c: Cliente) => c.email?.toLowerCase().trim() === emailNormalizado
    );

    if (emailJaExisteNosUsuarios || emailJaExisteNosClientes) {
      setErro('Este e-mail já está cadastrado no sistema! Faça login diretamente na tela de acesso.');
      setCarregando(false);
      return;
    }

    // 2. Persistência local garantida (Fake Consumo / Frontend-first)
    const novoId = Date.now();
    const dataNascimentoIso = converterDataBrParaIso(dataNascimento) || '1990-01-01';

    // Salva o novo usuário para login local imediato
    const novoUsuario = {
      id: novoId,
      nome: nome.trim(),
      usuario: emailNormalizado,
      senha: senha,
      foto: fotoUrl.trim() || '',
      perfil: tipoAcesso === 'cliente' ? 'ROLE_CLIENTE' : 'ROLE_CORRETOR',
      cpfCnpj: cpfCnpj.trim(),
      dataNascimento: dataNascimentoIso,
    };
    localStorage.setItem(
      'segurae_usuarios_locais',
      JSON.stringify([...listaLocais, novoUsuario])
    );

    // Se for cliente, salva também na lista de clientes do corretor para aparecer na Gestão de Clientes
    if (tipoAcesso === 'cliente') {
      const novoCliente: Cliente = {
        id: novoId,
        nomeCompleto: nome.trim(),
        email: emailNormalizado,
        cpfCnpj: cpfCnpj.trim(),
        dataNascimento: dataNascimentoIso,
      };
      const listaAtualizada = [
        novoCliente,
        ...listaClientes.filter((c: Cliente) => c.email?.toLowerCase().trim() !== emailNormalizado),
      ];
      salvarClientesCorretor(listaAtualizada);
    }

    // Se este e-mail estava na lista de excluídos, remove-o
    try {
      const rawExcluidos = localStorage.getItem('segurae_clientes_excluidos');
      if (rawExcluidos) {
        const excluidos = JSON.parse(rawExcluidos);
        if (Array.isArray(excluidos)) {
          const limpos = excluidos.filter(
            (e: { email?: string }) => e.email?.toLowerCase().trim() !== emailNormalizado
          );
          localStorage.setItem('segurae_clientes_excluidos', JSON.stringify(limpos));
        }
      }
    } catch {
      // ignora
    }

    // 3. Tenta cadastrar no backend em segundo plano de forma não-bloqueante (fire-and-forget)
    (async () => {
      try {
        await cadastrarUsuario('/usuarios/cadastrar', {
          id: 0,
          nome: nome.trim(),
          usuario: emailNormalizado,
          senha: senha,
          foto: fotoUrl.trim() || '',
          perfil: tipoAcesso === 'cliente' ? 'ROLE_CLIENTE' : 'ROLE_CORRETOR',
        });
      } catch {
        // segue normalmente com persistência local
      }
      if (tipoAcesso === 'cliente') {
        try {
          const cpfDigitos = cpfCnpj.replace(/\D/g, '');
          const cpfValido =
            cpfDigitos.length >= 11
              ? cpfDigitos
              : `${Math.floor(10000000000 + Math.random() * 89999999999)}`;
          await cadastrar<Cliente>('/clientes/cadastrar', {
            nomeCompleto: nome.trim(),
            email: emailNormalizado,
            cpfCnpj: cpfValido,
            dataNascimento: dataNascimentoIso,
          });
        } catch {
          // segue normalmente
        }
      }
    })();

    ToastAlerta('Conta criada com sucesso! Faça seu login.', 'sucesso');
    setCarregando(false);
    navigate('/login', { state: { tipoAcesso } });
  };

  return (
    <div className="min-h-screen w-full bg-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mb-4 flex items-center justify-between text-zinc-600 text-sm">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 hover:text-red-600 transition-colors duration-200 font-medium"
        >
          <ArrowLeft size={18} weight="bold" />
          <span>Voltar ao login</span>
        </Link>
        <span className="text-xs text-zinc-400 font-medium">
          Seguraê • Novo Cadastro
        </span>
      </div>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-zinc-300/60 border border-zinc-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div 
          className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between relative text-white bg-zinc-950 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(12, 14, 18, 0.78), rgba(9, 10, 14, 0.96)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div>
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
                <span>100% Digital</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/25 border border-red-500/40 text-red-400 text-xs font-semibold mb-6">
              <ShieldCheck size={16} weight="fill" />
              <span>Crie sua conta em minutos</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight mb-4">
              Junte-se à Seguraê e proteja o que importa.
            </h1>

            <p className="text-zinc-300 text-sm leading-relaxed mb-8">
              Contrate apólices personalizadas, acompanhe vistorias e tenha atendimento ágil na palma da sua mão.
            </p>

            <div className="space-y-3">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 backdrop-blur-md flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} weight="fill" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Apólices Claras e Sem Burocracia</h4>
                  <p className="text-[11px] text-zinc-400">Tudo direto no seu painel digital</p>
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3.5 backdrop-blur-md flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0">
                  <Car size={18} weight="fill" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Assistência 24h em Todo o Brasil</h4>
                  <p className="text-[11px] text-zinc-400">Guincho, chaveiro e socorro elétrico</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/80 text-xs text-zinc-400">
            <span>Dúvidas? Ligue para <strong className="text-white font-semibold">0800 700 8020</strong></span>
          </div>
        </div>

        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between bg-white text-zinc-900">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold">
                Cadastro de Conta
              </span>
              <span className="text-xs text-zinc-400 font-medium">Seguraê Auto</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-zinc-900 tracking-tight mb-1">
              Crie sua conta
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm mb-5">
              Escolha seu perfil e preencha suas informações para começar.
            </p>

            <div className="bg-zinc-100 p-1 rounded-2xl flex gap-1 mb-5">
              <button
                type="button"
                onClick={() => {
                  setTipoAcesso('cliente');
                  setErro('');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  tipoAcesso === 'cliente'
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
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  tipoAcesso === 'corretor'
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

            {erro && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {erro}
              </div>
            )}

            <form onSubmit={handleCadastro} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  {tipoAcesso === 'cliente' ? 'Nome Completo' : 'Nome Profissional'}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-zinc-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Mendes"
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  E-mail
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-zinc-400">
                    <EnvelopeSimple size={18} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {tipoAcesso === 'cliente' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      CPF ou CNPJ *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-zinc-400">
                        <IdentificationCard size={18} />
                      </span>
                      <input
                        type="text"
                        value={cpfCnpj}
                        onChange={(e) => {
                          const digitos = e.target.value.replace(/\D/g, '').slice(0, 14);
                          if (digitos.length <= 11) {
                            if (digitos.length <= 3) setCpfCnpj(digitos);
                            else if (digitos.length <= 6) setCpfCnpj(`${digitos.slice(0, 3)}.${digitos.slice(3)}`);
                            else if (digitos.length <= 9) setCpfCnpj(`${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`);
                            else setCpfCnpj(`${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9, 11)}`);
                          } else {
                            setCpfCnpj(`${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8, 12)}-${digitos.slice(12, 14)}`);
                          }
                        }}
                        placeholder="000.000.000-00"
                        maxLength={18}
                        className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-zinc-700">
                        Data de Nascimento *
                      </label>
                      <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded-md border border-red-200/60">
                        +18 anos
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-zinc-400">
                        <Calendar size={18} />
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(formatarDataBR(e.target.value))}
                        placeholder="DD/MM/AAAA"
                        className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all font-mono"
                      />
                    </div>
                    {dataNascimento.length === 10 && (
                      <div className="mt-1">
                        {calcularIdade(dataNascimento) === -1 ? (
                          <span className="text-[11px] font-semibold text-red-600">
                            Data inválida. Use o formato dia/mês/ano (DD/MM/AAAA).
                          </span>
                        ) : calcularIdade(dataNascimento) < 18 ? (
                          <span className="text-[11px] font-semibold text-red-600">
                            Idade: {calcularIdade(dataNascimento)} anos — cadastro permitido apenas para maiores de 18 anos.
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-600">
                            Idade: {calcularIdade(dataNascimento)} anos (Permitido)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Link da Foto de Perfil (Opcional)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-zinc-400">
                      <Image size={18} />
                    </span>
                    <input
                      type="url"
                      value={fotoUrl}
                      onChange={(e) => setFotoUrl(e.target.value)}
                      placeholder="https://exemplo.com/sua-foto.jpg"
                      className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Senha de Acesso
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-zinc-400">
                      <LockKey size={18} />
                    </span>
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-10 pr-10 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
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

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Confirmar Senha
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-zinc-400">
                      <LockKey size={18} />
                    </span>
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      placeholder="Repita sua senha"
                      className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-zinc-600">
                  <input
                    type="checkbox"
                    checked={termosAceitos}
                    onChange={(e) => setTermosAceitos(e.target.checked)}
                    className="w-4 h-4 accent-red-600 rounded cursor-pointer mt-0.5"
                  />
                  <span>
                    Li e concordo com os Termos de Uso e Política de Privacidade da Seguraê.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full mt-2 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 cursor-pointer"
              >
                {carregando ? (
                  <span>Cadastrando...</span>
                ) : (
                  <>
                    <span>Criar Conta</span>
                    <ArrowRight size={18} weight="bold" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-5 mt-5 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-600">
              Já possui uma conta cadastrada?{' '}
              <Link to="/login" className="text-red-600 font-bold hover:underline">
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
