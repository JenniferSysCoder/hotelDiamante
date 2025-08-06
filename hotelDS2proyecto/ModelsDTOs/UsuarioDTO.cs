namespace hotelDS2proyecto.Models.DTOs
{
    public class UsuarioDTO
    {
        public int IdUsuario { get; set; }  // 0 o omitido para nuevo
        public string Usuario1 { get; set; } = null!;
        public string? Contrasena { get; set; }  // para recibir y guardar (no mostrar)
        public int IdRol { get; set; }
        public int? IdEmpleado { get; set; }

        // Solo para mostrar en GET, puedes ignorar en POST/PUT
        public string? RolNombre { get; set; }
        public string? NombreEmpleado { get; set; }

        public string? ApellidoEmpleado { get; set; }
    }
}
