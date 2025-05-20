namespace hotelDS2proyecto.ModelsDTOs
{
    public class ReporteReservaDTO
    {
        public int IdReserva { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string Estado { get; set; } = string.Empty;
        public string Nombre { get; set; } = null!;
        public string Tipo { get; set; } = null!;
    }
}
