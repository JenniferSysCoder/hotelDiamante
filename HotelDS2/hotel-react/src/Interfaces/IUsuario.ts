export interface IUsuario {
  idUsuario: number;
  usuario1: string;
  idRol: number;
  rolNombre: string;
  idEmpleado?: number | null;
  nombreEmpleado?: string | null;
  apellidoEmpleado?: string | null;
  contrasena?: string; // Opcional, pero normalmente no se usa en listados
}
