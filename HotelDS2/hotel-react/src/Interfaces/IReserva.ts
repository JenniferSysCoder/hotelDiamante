export interface IReserva {
    idReserva: number;
    fechaInicio: string; 
    fechaFin: string;
    estado: string;
    idCliente: number;
    idHabitacion: number;
    nombreCliente?: string;
    numeroHabitacion?: string;
}


