export default interface UsuarioLogin {
  id: number;
  nome: string;
  usuario: string;
  email?: string;
  senha: string;
  foto: string;
  fotoUrl?: string;
  token: string;
}