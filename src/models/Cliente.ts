import type Apolice from './Apolice';

export default interface Cliente {
  id?: number;
  nomeCompleto: string;
  email: string;
  cpfCnpj: string;
  dataNascimento: string;
  apolices?: Apolice[] | null;
}
