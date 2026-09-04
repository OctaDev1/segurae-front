import type Apolice from './Apolice';

export default interface Usuario {
  id?: number;
  nome: string;
  email: string;
  usuario?: string; // Mantido para compatibilidade com o front-end existente
  senha?: string;
  fotoUrl?: string;
  foto?: string; // Mantido para compatibilidade com o front-end existente
  apolices?: Apolice[] | null;
}