import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://segurae-1.onrender.com"
});

// Interceptor para garantir que o token JWT seja sempre injetado e formatado sem duplicação de "Bearer "
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    const tokenFormatado = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    config.headers.Authorization = tokenFormatado;
  } else if (config.headers.Authorization && typeof config.headers.Authorization === "string") {
    // Corrige duplicações acidentais como "Bearer Bearer ..."
    config.headers.Authorization = config.headers.Authorization.replace(/^(Bearer\s+)+/i, "Bearer ");
  }
  return config;
});

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
  try {
    const resposta = await api.post(url, dados, header);
    if (typeof setDados === "function") {
      setDados(resposta.data);
    }
    return resposta.data;
  } catch (error: any) {
    console.error("DETALHE DO ERRO DA API:", error.response || error);
    throw error;
  }
};

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