export function useAuth() {
  const usuario = sessionStorage.getItem('usuario');
  return { isAuthenticated: !!usuario };
}
