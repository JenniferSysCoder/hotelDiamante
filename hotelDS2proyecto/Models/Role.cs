using System;
using System.Collections.Generic;

namespace hotelDS2proyecto.Models;

public partial class Role
{
    public int IdRol { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public virtual ICollection<RolPermiso> RolPermisos { get; set; } = new List<RolPermiso>();

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
