import axios from "axios";
import { createContext, useRef, useState, type ReactNode } from "react";

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
	const isLogout = useRef(false);

	async function handleLogin(usuarioLogin: UsuarioLogin): Promise<UsuarioLogin | null> {
		setIsLoading(true);

		try {
			const data: UsuarioLogin = await login(`/usuarios/logar`, usuarioLogin, setUsuario);

			if (data && data.token) {
				localStorage.setItem("token", data.token);
				localStorage.setItem("perfil", data.perfil || "");
				localStorage.setItem("nome", data.nome || "");
				localStorage.setItem("usuario", data.usuario || "");
				localStorage.setItem("id", String(data.id || "0"));
				localStorage.setItem("foto", data.foto || "");

				setUsuario(data);
				isLogout.current = false;
				ToastAlerta("Usuário Autenticado com sucesso!", "sucesso");
				return data;
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
		isLogout.current = true;

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