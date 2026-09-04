import axios from "axios";

export const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL || "https://segurae-1.onrender.com"

});
// Função Cadastrar Usuário
export const cadastrarUsuario = async (url: string, dados: Object, setDados: Function) => {
  const resposta = await api.post(url, dados);
  setDados(resposta.data);
  return resposta.data;
}

// Função Autenticar Usuário
export const login = async (url: string, dados: Object, setDados: Function) => {
  const resposta = await api.post(url, dados);
  setDados(resposta.data);
  return resposta.data;
}

// Função Consultar com token
export const buscar = async (url: string, setDados: Function, header: Object) => {
  const resposta = await api.get(url, header);
  setDados(resposta.data);
}

// Função Cadastrar com token
export const cadastrar = async (url: string, dados: Object, setDados: Function, header: Object) => {
  const resposta = await api.post(url, dados, header);
  setDados(resposta.data);
}

// Função Atualizar com token
export const atualizar = async (url: string, dados: Object, setDados: Function, header: Object) => {
  const resposta = await api.put(url, dados, header);
  setDados(resposta.data);
}

// Função Deletar com token
export const deletar = async (url: string, header: Object) => {
  await api.delete(url, header);
}