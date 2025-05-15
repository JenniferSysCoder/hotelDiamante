export interface IReserva {
    idReserva: number;
    fechaInicio: string; // <-- en formato "YYYY-MM-DD" o "YYYY-MM-DDTHH:mm:ss"
    fechaFin: string;
    estado: string;
    idCliente: number;
    idHabitacion: number;
    nombreCliente?: string;
    numeroHabitacion?: string;
}


