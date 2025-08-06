import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { JSX } from "react";

interface Props {
  children: JSX.Element;
  rolesPermitidos: string[];
}

export default function RoleRoute({ children, rolesPermitidos }: Props) {
  const { isAuthenticated, rol } = useAuth() as { isAuthenticated: boolean; rol?: string };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!rolesPermitidos.includes(rol ?? "")) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}