namespace hotelDS2proyecto.ModelsDTOs
{
    public class FacturaDTO
    {
        public int IdFactura { get; set; }

        public DateTime FechaEmision { get; set; }

        public decimal Total { get; set; }

        public int IdServicio { get; set; }

        public int IdReserva { get; set; }

        public string? NombreServicio { get; set; }

        public string? NombreCliente { get; set; }
    }
}
