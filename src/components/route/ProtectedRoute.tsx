import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/toastalerta/ToastAlerta";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<"ROLE_CLIENTE" | "ROLE_CORRETOR" | string>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { usuario, isLoading } = useContext(AuthContext);

  const token = usuario.token || localStorage.getItem("token");
  const perfil = usuario.perfil || localStorage.getItem("perfil") || "ROLE_CLIENTE";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!token) {
    ToastAlerta("Você precisa estar autenticado para acessar esta área.", "info");
    return <Navigate to="/login" replace />;
  }

  // Se a rota requer perfis específicos e o perfil do usuário não estiver incluído
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(perfil)) {
    ToastAlerta("Acesso restrito! Redirecionando para seu painel autorizado.", "erro");

    if (perfil === "ROLE_CORRETOR") {
      return <Navigate to="/dashboard/corretor" replace />;
    }
    return <Navigate to="/dashboard/cliente" replace />;
  }

  return <>{children}</>;
}