import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { JSX } from "react";

interface PrivateRouteProps {
  children: JSX.Element;
  rolesPermitidos?: string[]; // Ej: ['Administrador', 'Recepcionista']
}

export default function PrivateRoute({ children, rolesPermitidos }: PrivateRouteProps) {
  const { isAuthenticated, rol } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se especificaron roles permitidos y el rol actual no está incluido
  if (rolesPermitidos && !rolesPermitidos.includes(rol || "")) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}
