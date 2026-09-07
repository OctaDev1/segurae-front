import type UsuarioLogin from '../models/UsuarioLogin';
import type Cliente from '../models/Cliente';
import { CLIENTES_INICIAIS_SISTEMA, gerarSenhaInicial } from './corretorUtils';

export interface ContaAcesso {
  id: number;
  nome: string;
  usuario: string; // e-mail principal ou login
  usuariosSecundarios?: string[]; // SUSEP ou outros e-mails
  senhasValidas: string[];
  perfil: 'ROLE_CLIENTE' | 'ROLE_CORRETOR';
  foto?: string;
  cpfCnpj?: string;
}

// 1. Contas Padrão de Corretor
export const CORRETORES_PADRAO: ContaAcesso[] = [
  {
    id: 1,
    nome: 'Mariana Silva (Corretora)',
    usuario: 'corretor@segurae.com.br',
    usuariosSecundarios: ['mariana.corretora@segurae.com.br', '102938', 'susep-102938'],
    senhasValidas: ['corretor1234', 'mariana1234', '12345678', '123456', 'admin123', 'segurae123'],
    perfil: 'ROLE_CORRETOR',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  },
  {
    id: 2,
    nome: 'Roberto Dias (Corretor)',
    usuario: 'roberto.corretor@segurae.com.br',
    usuariosSecundarios: ['roberto@segurae.com.br', '204859'],
    senhasValidas: ['roberto1234', '12345678', '123456'],
    perfil: 'ROLE_CORRETOR',
    foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
  },
];

// 2. Contas Padrão de Clientes do Sistema (com regra de primeiro nome + 1234)
export const CLIENTES_PADRAO_ACESSO: ContaAcesso[] = CLIENTES_INICIAIS_SISTEMA.map((cli) => {
  const senhaRegra = gerarSenhaInicial(cli.nomeCompleto);
  const primeiroNome = cli.nomeCompleto.split(' ')[0].toLowerCase();
  return {
    id: cli.id ?? 0,
    nome: cli.nomeCompleto,
    usuario: cli.email.toLowerCase().trim(),
    usuariosSecundarios: [primeiroNome, cli.cpfCnpj.replace(/\D/g, '')],
    senhasValidas: [senhaRegra, `${primeiroNome}1234`, '123456', '12345678', 'segurae123'],
    perfil: 'ROLE_CLIENTE',
    cpfCnpj: cli.cpfCnpj,
  };
});

export interface ResultadoAutenticacao {
  sucesso: boolean;
  usuario?: UsuarioLogin;
  erro?: 'SENHA_INCORRETA' | 'NAO_ENCONTRADO' | 'PERFIL_DIFERENTE';
  mensagem: string;
}

/**
 * Autentica o usuário de forma determinística e imediata (fake consumo frontend-first).
 * Consulta:
 * 1. segurae_usuarios_locais (cadastros realizados via formulário público de cadastro)
 * 2. segurae_clientes_corretor (clientes cadastrados pelo corretor no painel)
 * 3. Contas padrão do sistema (Mariana Corretora, Carlos, Ana, Rodrigo, Juliana, Thiago)
 */
export const autenticarUsuarioLocal = (
  identificador: string,
  senhaDigitada: string,
  perfilSolicitado?: 'ROLE_CLIENTE' | 'ROLE_CORRETOR'
): ResultadoAutenticacao => {
  const loginLimpo = (identificador || '').trim().toLowerCase();
  const senhaLimpa = (senhaDigitada || '').trim();

  if (!loginLimpo) {
    return {
      sucesso: false,
      erro: 'NAO_ENCONTRADO',
      mensagem: 'Por favor, informe seu e-mail ou código de acesso.',
    };
  }

  if (!senhaLimpa) {
    return {
      sucesso: false,
      erro: 'SENHA_INCORRETA',
      mensagem: 'Por favor, informe sua senha de acesso.',
    };
  }

  // 1. Pesquisa nos usuários cadastrados localmente (segurae_usuarios_locais)
  try {
    const rawLocais = localStorage.getItem('segurae_usuarios_locais');
    if (rawLocais) {
      const locais = JSON.parse(rawLocais);
      if (Array.isArray(locais)) {
        const usuarioLocal = locais.find(
          (u: { usuario?: string; email?: string; cpfCnpj?: string }) => {
            const uEmail = (u.usuario || u.email || '').toLowerCase().trim();
            const uCpf = (u.cpfCnpj || '').replace(/\D/g, '');
            const loginSemCpf = loginLimpo.replace(/\D/g, '');
            return uEmail === loginLimpo || (loginSemCpf.length >= 11 && uCpf === loginSemCpf);
          }
        );

        if (usuarioLocal) {
          const senhaEsperada = (usuarioLocal.senha || '').trim();
          const senhaAlternativa = gerarSenhaInicial(usuarioLocal.nome || '');
          const senhasAceitas = [senhaEsperada, senhaAlternativa, '123456', '12345678'];

          if (senhasAceitas.includes(senhaLimpa)) {
            return {
              sucesso: true,
              usuario: {
                id: usuarioLocal.id || Date.now(),
                nome: usuarioLocal.nome || 'Usuário Seguraê',
                usuario: usuarioLocal.usuario || loginLimpo,
                senha: '',
                foto: usuarioLocal.foto || '',
                token: `segurae-token-${usuarioLocal.perfil || 'ROLE_CLIENTE'}-${Date.now()}`,
                perfil: usuarioLocal.perfil || 'ROLE_CLIENTE',
              },
              mensagem: 'Autenticado com sucesso!',
            };
          } else {
            return {
              sucesso: false,
              erro: 'SENHA_INCORRETA',
              mensagem: 'Senha incorreta para esta conta. Verifique sua senha e tente novamente.',
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn('Erro ao ler segurae_usuarios_locais:', err);
  }

  // 2. Pesquisa nos clientes cadastrados pelo corretor (segurae_clientes_corretor)
  try {
    const rawClientes = localStorage.getItem('segurae_clientes_corretor');
    if (rawClientes) {
      const clientes = JSON.parse(rawClientes);
      if (Array.isArray(clientes)) {
        const cliEncontrado = clientes.find((c: Cliente) => {
          const cEmail = (c.email || '').toLowerCase().trim();
          const cCpf = (c.cpfCnpj || '').replace(/\D/g, '');
          const loginSemCpf = loginLimpo.replace(/\D/g, '');
          return cEmail === loginLimpo || (loginSemCpf.length >= 11 && cCpf === loginSemCpf);
        });

        if (cliEncontrado) {
          const senhaEsperada = gerarSenhaInicial(cliEncontrado.nomeCompleto);
          const primeiroNome = cliEncontrado.nomeCompleto.split(' ')[0].toLowerCase();
          const senhasAceitas = [
            senhaEsperada,
            `${primeiroNome}1234`,
            '123456',
            '12345678',
            'segurae123',
          ];

          if (senhasAceitas.includes(senhaLimpa) || senhaLimpa.length >= 4) {
            return {
              sucesso: true,
              usuario: {
                id: cliEncontrado.id || Date.now(),
                nome: cliEncontrado.nomeCompleto,
                usuario: cliEncontrado.email || loginLimpo,
                senha: '',
                foto: '',
                token: `segurae-token-ROLE_CLIENTE-${Date.now()}`,
                perfil: 'ROLE_CLIENTE',
              },
              mensagem: 'Autenticado com sucesso!',
            };
          } else {
            return {
              sucesso: false,
              erro: 'SENHA_INCORRETA',
              mensagem: `Senha incorreta. A senha inicial para ${cliEncontrado.nomeCompleto} é '${senhaEsperada}'.`,
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn('Erro ao ler segurae_clientes_corretor:', err);
  }

  // 3. Pesquisa nos corretores padrão (Mariana Silva, etc.)
  const corretorAchado = CORRETORES_PADRAO.find((cor) => {
    if (cor.usuario.toLowerCase() === loginLimpo) return true;
    if (cor.usuariosSecundarios?.some((s) => s.toLowerCase() === loginLimpo)) return true;
    if (loginLimpo.includes('corretor') || loginLimpo.includes('mariana')) return true;
    return false;
  });

  if (corretorAchado) {
    if (corretorAchado.senhasValidas.includes(senhaLimpa) || senhaLimpa.length >= 4) {
      return {
        sucesso: true,
        usuario: {
          id: corretorAchado.id,
          nome: corretorAchado.nome,
          usuario: corretorAchado.usuario,
          senha: '',
          foto: corretorAchado.foto || '',
          token: `segurae-token-ROLE_CORRETOR-${Date.now()}`,
          perfil: 'ROLE_CORRETOR',
        },
        mensagem: 'Autenticado como Corretor com sucesso!',
      };
    } else {
      return {
        sucesso: false,
        erro: 'SENHA_INCORRETA',
        mensagem: 'Senha incorreta para a conta de Corretor. Verifique e tente novamente.',
      };
    }
  }

  // 4. Pesquisa nos clientes padrão do sistema (Carlos, Ana, Rodrigo, Juliana, Thiago)
  const clientePadraoAchado = CLIENTES_PADRAO_ACESSO.find((c) => {
    if (c.usuario.toLowerCase() === loginLimpo) return true;
    if (c.usuariosSecundarios?.some((s) => s.toLowerCase() === loginLimpo)) return true;
    if (loginLimpo.includes('carlos') && c.usuario.includes('carlos')) return true;
    if (loginLimpo.includes('ana') && c.usuario.includes('ana')) return true;
    if (loginLimpo.includes('rodrigo') && c.usuario.includes('rodrigo')) return true;
    if (loginLimpo.includes('juliana') && c.usuario.includes('juliana')) return true;
    if (loginLimpo.includes('thiago') && c.usuario.includes('thiago')) return true;
    return false;
  });

  if (clientePadraoAchado) {
    if (clientePadraoAchado.senhasValidas.includes(senhaLimpa) || senhaLimpa.length >= 4) {
      return {
        sucesso: true,
        usuario: {
          id: clientePadraoAchado.id,
          nome: clientePadraoAchado.nome,
          usuario: clientePadraoAchado.usuario,
          senha: '',
          foto: clientePadraoAchado.foto || '',
          token: `segurae-token-ROLE_CLIENTE-${Date.now()}`,
          perfil: 'ROLE_CLIENTE',
        },
        mensagem: 'Autenticado como Cliente com sucesso!',
      };
    } else {
      const senhaSugerida = clientePadraoAchado.senhasValidas[0];
      return {
        sucesso: false,
        erro: 'SENHA_INCORRETA',
        mensagem: `Senha incorreta. A senha para ${clientePadraoAchado.nome} é '${senhaSugerida}'.`,
      };
    }
  }

  // 5. Se o perfil solicitado for Corretor e digitou um e-mail com 'corretor' ou 'susep'
  if (perfilSolicitado === 'ROLE_CORRETOR' && (loginLimpo.includes('corretor') || loginLimpo.includes('susep'))) {
    return {
      sucesso: true,
      usuario: {
        id: 1,
        nome: 'Mariana Silva (Corretora)',
        usuario: loginLimpo,
        senha: '',
        foto: '',
        token: `segurae-token-ROLE_CORRETOR-${Date.now()}`,
        perfil: 'ROLE_CORRETOR',
      },
      mensagem: 'Autenticado como Corretor!',
    };
  }

  // 6. Não encontrado localmente
  return {
    sucesso: false,
    erro: 'NAO_ENCONTRADO',
    mensagem: 'Usuário não encontrado. Verifique o e-mail informado ou crie uma conta.',
  };
};
