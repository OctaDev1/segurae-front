import axios from "axios";
import { createContext, useRef, useState, type ReactNode } from "react";

import { login } from "../services/Service";
import type UsuarioLogin from "../models/UsuarioLogin";
import { ToastAlerta } from "../utils/toastalerta/ToastAlerta";


interface AuthContextProps {
	usuario: UsuarioLogin
	handleLogin(usuario: UsuarioLogin): void
	handleLogout(): void
	isLoading: boolean
	isLogout: boolean
}


interface AuthProviderProps {
	children: ReactNode
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children }: AuthProviderProps) {

	const [usuario, setUsuario] = useState<UsuarioLogin>({
		id: 0,
		nome: "",
		usuario: "",
		senha: "",
		foto: "",
		token: "",
	})

	const [isLoading, setIsLoading] = useState<boolean>(false)

	 
   const isLogout=useRef(false)

	async function handleLogin(usuarioLogin: UsuarioLogin) {
		setIsLoading(true)

		try {
			await login(`/usuarios/logar`, usuarioLogin, setUsuario)
			ToastAlerta("Usuário Autenticado com sucesso!", "sucesso")

			isLogout.current = false

		} catch (error) {
			if (axios.isAxiosError(error)) {
				ToastAlerta(`Erro ao autenticar o usuário (${error.response?.status})`, "erro")
				return
			}
		} finally {
			setIsLoading(false)
		}
	}

	function handleLogout() {

		isLogout.current=true

		setUsuario({
			id: 0,
			nome: "",
			usuario: "",
			senha: "",
			foto: "",
			token: "",
		})

		ToastAlerta('Usuário desconectado com sucesso!', 'sucesso');

	}

	return (
		<AuthContext.Provider
			value={{ usuario, handleLogin, handleLogout, isLoading, isLogout: isLogout.current }}
		>
			{children}
		</AuthContext.Provider>
	)
}