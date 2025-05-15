namespace hotelDS2proyecto.ModelsDTOs
{
    public class EmpleadoDTO
    {
        public int IdEmpleado { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Cargo { get; set; } = null!;
        public string? Telefono { get; set; }
        public int IdHotel { get; set; }
        public string NombreHotel { get; set; } = null!;
    }
}

