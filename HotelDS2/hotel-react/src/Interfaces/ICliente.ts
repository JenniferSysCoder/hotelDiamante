import type { ReactNode } from "react";

export interface ICliente {
  documento: ReactNode;
  idCliente: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
}