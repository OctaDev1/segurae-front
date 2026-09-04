import type Cliente from './Cliente';
import type Usuario from './Usuario';

export default interface Apolice {
  id?: number;
  numeroApolice?: string;
  marcaModelo: string;
  bemSegurado: string;
  anoModelo: number;
  placa: string;
  renavam: string;
  valorApolice: number;
  tipoCobertura: string;
  dataInicio: string;
  dataTermino: string;
  statusApolice: number;
  usuario?: Usuario | null;
  cliente?: Cliente | null;
}
