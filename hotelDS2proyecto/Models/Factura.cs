using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Factura
{
    public int IdFactura { get; set; }

    public DateTime FechaEmision { get; set; }

    public decimal Total { get; set; }

    public int IdServicio { get; set; }

    public int IdReserva { get; set; }

    public virtual Reserva IdReservaNavigation { get; set; } = null!;

    public virtual ServiciosAdicionale IdServicioNavigation { get; set; } = null!;

    public virtual ICollection<Pago> Pagos { get; set; } = new List<Pago>();
}
