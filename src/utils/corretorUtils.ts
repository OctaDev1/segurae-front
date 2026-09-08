import type Cliente from '../models/Cliente';
import type Apolice from '../models/Apolice';

export interface ClienteExcluido {
  id?: number;
  email?: string;
  nome?: string;
}

export const getClientesExcluidos = (): ClienteExcluido[] => {
  try {
    const raw = localStorage.getItem('segurae_clientes_excluidos');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [];
};

export const isClienteExcluido = (
  cliente: { id?: number; email?: string; nomeCompleto?: string; nome?: string; usuario?: string },
  excluidos: ClienteExcluido[]
): boolean => {
  if (!excluidos || excluidos.length === 0) return false;
  const cId = cliente.id ? Number(cliente.id) : undefined;
  const cEmail = (cliente.email || cliente.usuario || '').toLowerCase().trim();
  const cNome = (cliente.nomeCompleto || cliente.nome || '').toLowerCase().trim();

  return excluidos.some((exc) => {
    if (exc.id && cId && Number(exc.id) === cId) return true;
    if (exc.email && cEmail && exc.email.toLowerCase().trim() === cEmail) return true;
    if (exc.nome && cNome && exc.nome.toLowerCase().trim() === cNome) return true;
    return false;
  });
};

export interface OpcaoCobertura {
  id: string;
  nome: string;
  badge: string;
  valorSugerido: number;
  descricao: string;
}

export const OPCOES_COBERTURA: OpcaoCobertura[] = [
  {
    id: 'essencial',
    nome: 'Essencial (Roubo e Furto)',
    badge: 'Mais Econômico',
    valorSugerido: 1850.0,
    descricao: '100% Tabela FIPE, Furto qualificado e Assistência 24h básica',
  },
  {
    id: 'completo',
    nome: 'Completo (Colisão e Terceiros)',
    badge: 'Mais Popular',
    valorSugerido: 2950.0,
    descricao: 'Colisão total/parcial, danos a terceiros, guincho ilimitado e carro reserva',
  },
  {
    id: 'premium',
    nome: 'Premium VIP (Proteção Total)',
    badge: 'Máxima Proteção',
    valorSugerido: 4250.0,
    descricao: 'Proteção total sem franquia para vidros/faróis e carro reserva executivo',
  },
];

export const gerarSenhaInicial = (nomeCompleto: string): string => {
  if (!nomeCompleto || !nomeCompleto.trim()) return 'cliente1234';
  const primeiroNome = nomeCompleto
    .trim()
    .split(/\s+/)[0]
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return `${primeiroNome || 'cliente'}1234`;
};

export const CLIENTES_INICIAIS_SISTEMA: Cliente[] = [
  {
    id: 1,
    nomeCompleto: 'Carlos Eduardo Mendes',
    email: 'carlos.mendes@email.com',
    cpfCnpj: '123.456.789-00',
    dataNascimento: '1988-04-12',
  },
  {
    id: 2,
    nomeCompleto: 'Ana Beatriz Souza',
    email: 'ana.souza@email.com',
    cpfCnpj: '234.567.890-11',
    dataNascimento: '1992-09-21',
  },
  {
    id: 3,
    nomeCompleto: 'Rodrigo Fernandes Lima',
    email: 'rodrigo.lima@email.com',
    cpfCnpj: '345.678.901-22',
    dataNascimento: '1985-11-05',
  },
  {
    id: 4,
    nomeCompleto: 'Juliana Castro Vasconcelos',
    email: 'juliana.vasconcelos@email.com',
    cpfCnpj: '456.789.012-33',
    dataNascimento: '1995-07-18',
  },
  {
    id: 202,
    nomeCompleto: 'Thiago Oliveira (Cliente)',
    email: 'thiago@email.com',
    cpfCnpj: '567.890.123-44',
    dataNascimento: '1994-03-22',
  },
];

export const APOLICES_INICIAIS_SISTEMA: Apolice[] = [
  {
    id: 1,
    numeroApolice: 'SEG-2026-X892A1',
    marcaModelo: 'Toyota Corolla Cross XRE 2.0',
    bemSegurado: 'Automóvel Passeio',
    anoModelo: 2024,
    placa: 'BRA2E19',
    renavam: '00123456789',
    valorApolice: 3850.0,
    tipoCobertura: 'Completo (Colisão e Terceiros)',
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
    tipoCobertura: 'Premium VIP (Proteção Total)',
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
    tipoCobertura: 'Essencial (Roubo e Furto)',
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
    tipoCobertura: 'Completo (Colisão e Terceiros)',
    dataInicio: '2026-03-01',
    dataTermino: '2027-03-01',
    statusApolice: 0,
    cliente: {
      id: 4,
      nomeCompleto: 'Juliana Castro Vasconcelos',
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

export interface UsuarioSimulado {
  id: number;
  nome: string;
  usuario: string;
  senha?: string;
  perfil: 'ROLE_CLIENTE' | 'ROLE_CORRETOR';
}

export const getClientesCorretor = (): Cliente[] => {
  const excluidos = getClientesExcluidos();
  try {
    const raw = localStorage.getItem('segurae_clientes_corretor');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((c: Cliente) => !isClienteExcluido(c, excluidos));
      }
    }
  } catch {
    // fallback
  }
  return CLIENTES_INICIAIS_SISTEMA.filter((c) => !isClienteExcluido(c, excluidos));
};

export const salvarClientesCorretor = (clientes: Cliente[]): void => {
  try {
    localStorage.setItem('segurae_clientes_corretor', JSON.stringify(clientes));
  } catch (err) {
    console.error('Erro ao salvar clientes no localStorage:', err);
  }
};

export const formatarDataBR = (valor: string): string => {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4, 8)}`;
};

export const calcularIdade = (dataStr: string): number => {
  if (!dataStr) return -1;
  let dia: number;
  let mes: number;
  let ano: number;
  if (dataStr.includes('/')) {
    const partes = dataStr.split('/');
    if (partes.length !== 3) return -1;
    dia = parseInt(partes[0], 10);
    mes = parseInt(partes[1], 10);
    ano = parseInt(partes[2], 10);
  } else if (dataStr.includes('-')) {
    const partes = dataStr.split('-');
    if (partes.length !== 3) return -1;
    ano = parseInt(partes[0], 10);
    mes = parseInt(partes[1], 10);
    dia = parseInt(partes[2], 10);
  } else {
    return -1;
  }

  if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return -1;
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31 || ano < 1900) return -1;

  const dataNasc = new Date(ano, mes - 1, dia);
  if (
    isNaN(dataNasc.getTime()) ||
    dataNasc.getDate() !== dia ||
    dataNasc.getMonth() !== mes - 1 ||
    dataNasc.getFullYear() !== ano
  ) {
    return -1;
  }

  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  const diferencaMes = hoje.getMonth() - (mes - 1);
  if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < dia)) {
    idade--;
  }
  return idade;
};

export const converterDataBrParaIso = (dataBr: string): string => {
  if (!dataBr) return '';
  if (dataBr.includes('-')) return dataBr;
  const partes = dataBr.split('/');
  if (partes.length === 3) {
    const dia = partes[0].padStart(2, '0');
    const mes = partes[1].padStart(2, '0');
    const ano = partes[2];
    return `${ano}-${mes}-${dia}`;
  }
  return dataBr;
};

export const converterDataIsoParaBr = (dataIso: string): string => {
  if (!dataIso) return '';
  if (dataIso.includes('/')) return dataIso;
  const partes = dataIso.split('-');
  if (partes.length === 3) {
    const ano = partes[0];
    const mes = partes[1].padStart(2, '0');
    const dia = partes[2].padStart(2, '0');
    return `${dia}/${mes}/${ano}`;
  }
  return dataIso;
};

