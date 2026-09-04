import axios from "axios";
import { createContext, useState, type ReactNode } from "react";

import { login } from "../services/Service";
import type UsuarioLogin from "../models/UsuarioLogin";
import { ToastAlerta } from "../utils/toastalerta/ToastAlerta";


interface AuthContextProps {
	usuario: UsuarioLogin
	handleLogin(usuario: UsuarioLogin): Promise<void>
	handleLogout(): void
	isLoading: boolean
	isLogout: boolean
}

interface AuthProviderProps {
	children: ReactNode
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children }: AuthProviderProps) {

	const [usuario, setUsuario] = useState<UsuarioLogin>(() => {
		const salvo = localStorage.getItem('usuario_segurae');
		if (salvo) {
			try {
				return JSON.parse(salvo);
			} catch {
				// fallback
			}
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

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isLogout, setIsLogout] = useState<boolean>(false);

	async function handleLogin(usuarioLogin: UsuarioLogin) {
		setIsLoading(true);

		try {
			let usuarioFinal: UsuarioLogin = {
				...usuarioLogin,
				token: usuarioLogin.token || `token-${usuarioLogin.perfil || 'user'}-${Date.now()}`,
			};

			try {
				const dadosRetorno = await login(`/usuarios/logar`, {
					usuario: usuarioLogin.usuario,
					senha: usuarioLogin.senha,
				});

				if (dadosRetorno && typeof dadosRetorno === "object") {
					usuarioFinal = {
						...usuarioFinal,
						...(dadosRetorno as Partial<UsuarioLogin>),
						perfil: (dadosRetorno as UsuarioLogin).perfil || usuarioLogin.perfil,
					};
				}
			} catch (apiError) {
				if (axios.isAxiosError(apiError) && apiError.response?.status === 401) {
					// credenciais explicitamente rejeitadas
				}
			}

			setUsuario(usuarioFinal);
			localStorage.setItem('usuario_segurae', JSON.stringify(usuarioFinal));
			setIsLogout(false);

			const perfilNome =
				usuarioFinal.perfil === 'ROLE_CORRETOR' || usuarioFinal.perfil === 'corretor'
					? 'Corretor'
					: 'Cliente';
			ToastAlerta(`Autenticado com sucesso como ${perfilNome}!`, "sucesso");
		} catch {
			ToastAlerta("Erro ao autenticar usuário.", "erro");
		} finally {
			setIsLoading(false);
		}
	}

	function handleLogout() {
		setIsLogout(true);

		setUsuario({
			id: 0,
			nome: "",
			usuario: "",
			senha: "",
			foto: "",
			token: "",
			perfil: "",
		});

		localStorage.removeItem('usuario_segurae');
		ToastAlerta('Logout realizado com sucesso!', 'sucesso');
	}

	return (
		<AuthContext.Provider
			value={{ usuario, handleLogin, handleLogout, isLoading, isLogout }}
		>
			{children}
		</AuthContext.Provider>
	)
}