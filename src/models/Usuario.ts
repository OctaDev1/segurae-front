import type Apolice from './Apolice';

export default interface Usuario {
  id?: number;
  nome: string;
  email: string;
  usuario?: string;
  senha?: string;
  fotoUrl?: string;
  foto?: string;
  apolices?: Apolice[] | null;
}