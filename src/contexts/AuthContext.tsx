/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useState, type ReactNode } from "react";

import { api, login } from "../services/Service";
import type UsuarioLogin from "../models/UsuarioLogin";
import { ToastAlerta } from "../utils/toastalerta/ToastAlerta";
import { autenticarUsuarioLocal } from "../utils/authUtils";

interface AuthContextProps {
	usuario: UsuarioLogin;
	handleLogin(usuario: UsuarioLogin): Promise<UsuarioLogin | null>;
	handleLogout(): void;
	isLoading: boolean;
	isLogout: boolean;
}

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
	const [usuario, setUsuario] = useState<UsuarioLogin>(() => {
		const token = localStorage.getItem("token");
		if (token) {
			return {
				id: Number(localStorage.getItem("id")) || 0,
				nome: localStorage.getItem("nome") || "",
				usuario: localStorage.getItem("usuario") || "",
				senha: "",
				foto: localStorage.getItem("foto") || "",
				token: token,
				perfil: localStorage.getItem("perfil") || "",
			};
		}
		return {
			id: 0,
			nome: "",
			usuario: "",
			senha: "",
			foto: "",
			token: "",
			perfil: "",
		};
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLogout, setIsLogout] = useState<boolean>(false);

	async function handleLogin(usuarioLogin: UsuarioLogin): Promise<UsuarioLogin | null> {
		setIsLoading(true);

		const identificador = (usuarioLogin.usuario || '').trim();
		const senha = (usuarioLogin.senha || '').trim();
		const perfilSolicitado =
			usuarioLogin.perfil === 'ROLE_CORRETOR' ? 'ROLE_CORRETOR' : 'ROLE_CLIENTE';

		try {
			// 1. Tenta autenticação local / fake consumo prioritária (instantânea e determinística)
			const resultadoLocal = autenticarUsuarioLocal(identificador, senha, perfilSolicitado);

			if (resultadoLocal.sucesso && resultadoLocal.usuario) {
				const data = resultadoLocal.usuario;
				localStorage.setItem("token", data.token);
				localStorage.setItem("perfil", data.perfil || "");
				localStorage.setItem("nome", data.nome || "");
				localStorage.setItem("usuario", data.usuario || "");
				localStorage.setItem("id", String(data.id || "0"));
				localStorage.setItem("foto", data.foto || "");

				setUsuario(data);
				setIsLogout(false);
				ToastAlerta(`Bem-vindo, ${data.nome}!`, "sucesso");

				// Sincronização em segundo plano não-bloqueante com o backend (fire-and-forget)
				(async () => {
					try {
						await login(`/usuarios/logar`, usuarioLogin);
					} catch {
						// Ignora erro do backend offline
					}
				})();

				return data;
			}

			// Se o usuário existe mas a senha está incorreta
			if (resultadoLocal.erro === 'SENHA_INCORRETA') {
				ToastAlerta(resultadoLocal.mensagem, "erro");
				return null;
			}

			// 2. Se não encontrou nas contas locais, tenta bater na API do Render com timeout controlado (5s)
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 5000);

				const resposta = await api.post('/usuarios/logar', usuarioLogin, {
					signal: controller.signal,
				});
				clearTimeout(timeoutId);

				const data: UsuarioLogin = resposta.data;
				if (data && data.token) {
					localStorage.setItem("token", data.token);
					localStorage.setItem("perfil", data.perfil || "");
					localStorage.setItem("nome", data.nome || "");
					localStorage.setItem("usuario", data.usuario || "");
					localStorage.setItem("id", String(data.id || "0"));
					localStorage.setItem("foto", data.foto || "");

					setUsuario(data);
					setIsLogout(false);
					ToastAlerta("Usuário Autenticado com sucesso!", "sucesso");
					return data;
				}
			} catch (apiError) {
				if (axios.isAxiosError(apiError) && apiError.response?.status === 401) {
					ToastAlerta("Credenciais inválidas! Verifique usuário e senha.", "erro");
					return null;
				}
			}

			// 3. Se não foi possível encontrar a conta
			ToastAlerta(resultadoLocal.mensagem, "erro");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	function handleLogout() {
		setIsLogout(true);

		localStorage.removeItem("token");
		localStorage.removeItem("perfil");
		localStorage.removeItem("nome");
		localStorage.removeItem("usuario");
		localStorage.removeItem("id");
		localStorage.removeItem("foto");

		setUsuario({
			id: 0,
			nome: "",
			usuario: "",
			senha: "",
			foto: "",
			token: "",
			perfil: "",
		});

		ToastAlerta("Logout realizado com sucesso!", "sucesso");
	}

	return (
		<AuthContext.Provider
			value={{ usuario, handleLogin, handleLogout, isLoading, isLogout }}
		>
			{children}
		</AuthContext.Provider>
	);
}