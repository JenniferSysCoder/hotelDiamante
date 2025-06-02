namespace hotelDS2proyecto.ModelsDTOs
{
    public class ReservaDTO
    {
        public int IdReserva { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string? Estado { get; set; }
        public int IdCliente { get; set; }
        public int IdHabitacion { get; set; }

        public string NombreCliente { get; set; } = null!;
        public string NumeroHabitacion { get; set; } = null!;

    }
}
