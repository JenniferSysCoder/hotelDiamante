export interface IEmpleado {
  idEmpleado: number;
  nombre: string;
  apellido: string;
  cargo: string;
  telefono: string;
  idHotel: number;
  nombreHotel: string;
  documento?: string | undefined;
}