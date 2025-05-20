namespace hotelDS2proyecto.ModelsDTOs
{
    public class ReporteServiciosDTO
    {
        public string NombreServicio { get; set; } = null!;
        public int TotalSolicitudes { get; set; }
        public string EmpleadoMasActivo { get; set; } = "No registrado";
    }
}
