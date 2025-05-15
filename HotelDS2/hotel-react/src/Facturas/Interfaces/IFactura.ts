export interface IFactura {
    idFactura: number;
    fechaEmision: string; // La fecha como string
    total: number;
    idServicio: number;
    idReserva: number;
    nombreServicio: string; // Nombre o descripción del servicio
    nombreCliente: string;  // Nombre del cliente asociado a la reserva
}
