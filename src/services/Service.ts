import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://segurae-1.onrender.com"
});

// Interceptor de requisição para injetar automaticamente o token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta para tratar sessão expirada (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && !error?.config?.url?.includes("/usuarios/logar")) {
      localStorage.removeItem("token");
      localStorage.removeItem("perfil");
    }
    return Promise.reject(error);
  }
);

// Helper para obter cabeçalho de autenticação Bearer
export const getAuthHeader = (token?: string) => {
  const authToken = token || localStorage.getItem("token") || "";
  if (!authToken) return {};
  const bearerToken = authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`;
  return {
    headers: {
      Authorization: bearerToken,
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