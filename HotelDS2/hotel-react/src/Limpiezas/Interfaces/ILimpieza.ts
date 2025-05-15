export interface ILimpieza {
    idLimpieza: number;
    fecha: string; // La fecha como string
    observaciones?: string;
    idHabitacion: number;
    idEmpleado: number;
    numeroHabitacion: string; // Nombre de la habitación
    nombreEmpleado: string; // Nombre del empleado
}
