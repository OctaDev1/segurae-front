import axios from "axios";

export const api = axios.create({
    baseURL: "https://segurae-1.onrender.com"
});

// Utilitário para formatar cabeçalho com token JWT
export const getAuthHeader = (token?: string) => {
  if (!token) return {};
  const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  return {
    headers: {
      Authorization: formattedToken,
    },
  };
};

// Função Cadastrar Usuário
export const cadastrarUsuario = async <T = unknown>(url: string, dados: object, setDados?: (dados: T) => void) => {
  const resposta = await api.post(url, dados);
  if (typeof setDados === "function") {
    setDados(resposta.data);
  }
  return resposta.data;
}

// Função Autenticar Usuário
export const login = async <T = unknown>(url: string, dados: object, setDados?: (dados: T) => void) => {
  const resposta = await api.post(url, dados);
  if (typeof setDados === "function") {
    setDados(resposta.data);
  }
  return resposta.data;
}

// Função Consultar com token
export const buscar = async <T = unknown>(url: string, setDados?: (dados: T) => void, header: object = {}) => {
  const resposta = await api.get(url, header);
  if (typeof setDados === "function") {
    setDados(resposta.data);
  }
  return resposta.data;
}

// Função Cadastrar com token
export const cadastrar = async <T = unknown>(url: string, dados: object, setDados?: (dados: T) => void, header: object = {}) => {
  const resposta = await api.post(url, dados, header);
  if (typeof setDados === "function") {
    setDados(resposta.data);
  }
  return resposta.data;
}

// Função Atualizar com token
export const atualizar = async <T = unknown>(url: string, dados: object, setDados?: (dados: T) => void, header: object = {}) => {
  const resposta = await api.put(url, dados, header);
  if (typeof setDados === "function") {
    setDados(resposta.data);
  }
  return resposta.data;
}

// Função Deletar com token
export const deletar = async (url: string, header: object = {}) => {
  const resposta = await api.delete(url, header);
  return resposta.data;
}