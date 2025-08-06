export function useAuth() {
  const usuario = sessionStorage.getItem("usuario");
  const rol = sessionStorage.getItem("rol");

  const isAuthenticated = usuario !== null && rol !== null;

  return {
    isAuthenticated,
    usuario,
    rol,
  };
}
