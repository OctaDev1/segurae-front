import type Apolice from './Apolice';
import type Cliente from './Cliente';

export default interface Usuario {
  id?: number;
  nome: string;
  email?: string;
  usuario?: string;
  senha?: string;
  fotoUrl?: string;
  foto?: string;
  perfil?: 'ROLE_CLIENTE' | 'ROLE_CORRETOR' | string;
  apolices?: Apolice[] | null;
  apolice?: Apolice[] | string[] | null;
  cliente?: Cliente | null;
}