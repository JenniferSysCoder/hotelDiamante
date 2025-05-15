namespace hotelDS2proyecto.ModelsDTOs
{
    public class LimpiezaDTO
    {
        public int IdLimpieza { get; set; }
        public DateTime Fecha { get; set; }
        public string? Observaciones { get; set; }

        public int IdHabitacion { get; set; }
        public string NumeroHabitacion { get; set; } = null!;

        public int IdEmpleado { get; set; }
        public string NombreEmpleado { get; set; } = null!;
    }
}

