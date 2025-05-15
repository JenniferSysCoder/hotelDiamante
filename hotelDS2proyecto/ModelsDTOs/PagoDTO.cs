namespace hotelDS2proyecto.ModelsDTOs
{
    public class PagoDTO
    {
        public int IdPago { get; set; }
        public decimal Monto { get; set; }
        public DateTime FechaPago { get; set; }
        public string? MetodoPago { get; set; }
        public int IdFactura { get; set; }

        // Campo adicional para mostrar el nombre del cliente relacionado
        public string? NombreCliente { get; set; }
    }
}

