namespace hotelDS2proyecto.ModelsDTOs
{
    public class HabitacionDTO
    {
        public int IdHabitacion { get; set; }
        public string Numero { get; set; } = null!;
        public string Tipo { get; set; } = null!;
        public decimal PrecioNoche { get; set; }
        public string? Estado { get; set; }
        public int IdHotel { get; set; }
        public string NombreHotel { get; set; } = null!;
    }
}
