import axios from "axios";
import { createContext, useState, type ReactNode } from "react";

import { login } from "../services/Service";
import type UsuarioLogin from "../models/UsuarioLogin";
import { ToastAlerta } from "../utils/toastalerta/ToastAlerta";


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

// eslint-disable-next-line react-refresh/only-export-components
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

		try {
			const payload = {
				...usuarioLogin,
				usuario: usuarioLogin.usuario || usuarioLogin.email || "",
			};

			const data: UsuarioLogin = await login(`/usuarios/logar`, payload, setUsuario);

			if (data && data.token) {
				const resolvedPerfil = data.perfil || usuarioLogin.perfil || localStorage.getItem("perfil") || "ROLE_CLIENTE";
				const resolvedNome = data.nome || usuarioLogin.nome || "";
				const resolvedUsuario = data.usuario || usuarioLogin.usuario || "";
				const resolvedId = String(data.id || usuarioLogin.id || "0");
				const resolvedFoto = data.foto || data.fotoUrl || usuarioLogin.foto || "";

				localStorage.setItem("token", data.token);
				localStorage.setItem("perfil", resolvedPerfil);
				localStorage.setItem("nome", resolvedNome);
				localStorage.setItem("usuario", resolvedUsuario);
				localStorage.setItem("id", resolvedId);
				localStorage.setItem("foto", resolvedFoto);

				const usuarioFinal: UsuarioLogin = {
					...data,
					id: Number(resolvedId),
					perfil: resolvedPerfil,
					nome: resolvedNome,
					usuario: resolvedUsuario,
					foto: resolvedFoto,
				};

				setUsuario(usuarioFinal);
				setIsLogout(false);
				ToastAlerta("Usuário Autenticado com sucesso!", "sucesso");
				return usuarioFinal;
			}
			return null;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const status = error.response?.status;
				if (status === 401) {
					ToastAlerta("Credenciais inválidas! Verifique usuário e senha.", "erro");
				} else {
					ToastAlerta(`Erro ao autenticar o usuário (${status || "rede"})`, "erro");
				}
			} else {
				ToastAlerta("Erro inesperado ao realizar login.", "erro");
			}
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