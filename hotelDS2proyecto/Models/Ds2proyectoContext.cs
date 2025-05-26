using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace hotelDS2proyecto.Models;

public partial class Ds2proyectoContext : DbContext
{
    public Ds2proyectoContext()
    {
    }

    public Ds2proyectoContext(DbContextOptions<Ds2proyectoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Empleado> Empleados { get; set; }

    public virtual DbSet<Factura> Facturas { get; set; }

    public virtual DbSet<Habitacione> Habitaciones { get; set; }

    public virtual DbSet<Hotele> Hoteles { get; set; }

    public virtual DbSet<Limpieza> Limpiezas { get; set; }

    public virtual DbSet<Pago> Pagos { get; set; }

    public virtual DbSet<Reserva> Reservas { get; set; }

    public virtual DbSet<ServiciosAdicionale> ServiciosAdicionales { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=localhost;Database=ds2proyecto;Trusted_Connection=True;Encrypt=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.IdCliente).HasName("PK__Clientes__885457EE19E8CF4B");

            entity.HasIndex(e => e.Documento, "UQ__Clientes__A25B3E61F367C782").IsUnique();

            entity.Property(e => e.IdCliente).HasColumnName("idCliente");
            entity.Property(e => e.Apellido)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("apellido");
            entity.Property(e => e.Correo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("correo");
            entity.Property(e => e.Documento)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("documento");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Telefono)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("telefono");
        });

        modelBuilder.Entity<Empleado>(entity =>
        {
            entity.HasKey(e => e.IdEmpleado).HasName("PK__Empleado__5295297C21A0EB8B");

            entity.Property(e => e.IdEmpleado).HasColumnName("idEmpleado");
            entity.Property(e => e.Apellido)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("apellido");
            entity.Property(e => e.Cargo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("cargo");
            entity.Property(e => e.IdHotel).HasColumnName("idHotel");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Telefono)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("telefono");

            entity.HasOne(d => d.IdHotelNavigation).WithMany(p => p.Empleados)
                .HasForeignKey(d => d.IdHotel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Empleados__idHot__3E1D39E1");
        });

        modelBuilder.Entity<Factura>(entity =>
        {
            entity.HasKey(e => e.IdFactura).HasName("PK__Facturas__3CD5687E4B6E88B0");

            entity.Property(e => e.IdFactura).HasColumnName("idFactura");
            entity.Property(e => e.FechaEmision).HasColumnName("fechaEmision");
            entity.Property(e => e.IdReserva).HasColumnName("idReserva");
            entity.Property(e => e.IdServicio).HasColumnName("idServicio");
            entity.Property(e => e.Total)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("total");

            entity.HasOne(d => d.IdReservaNavigation).WithMany(p => p.Facturas)
                .HasForeignKey(d => d.IdReserva)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Facturas__idRese__37703C52");

            entity.HasOne(d => d.IdServicioNavigation).WithMany(p => p.Facturas)
                .HasForeignKey(d => d.IdServicio)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Facturas__idServ__367C1819");
        });

        modelBuilder.Entity<Habitacione>(entity =>
        {
            entity.HasKey(e => e.IdHabitacion).HasName("PK__Habitaci__D9D53BE2B79F9CAF");

            entity.Property(e => e.IdHabitacion).HasColumnName("idHabitacion");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("estado");
            entity.Property(e => e.IdHotel).HasColumnName("idHotel");
            entity.Property(e => e.Numero)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("numero");
            entity.Property(e => e.PrecioNoche)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precioNoche");
            entity.Property(e => e.Tipo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("tipo");

            entity.HasOne(d => d.IdHotelNavigation).WithMany(p => p.Habitaciones)
                .HasForeignKey(d => d.IdHotel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Habitacio__idHot__2A164134");
        });

        modelBuilder.Entity<Hotele>(entity =>
        {
            entity.HasKey(e => e.IdHotel);

            entity.Property(e => e.IdHotel).HasColumnName("idHotel");
            entity.Property(e => e.Categoria).HasColumnName("categoria");
            entity.Property(e => e.Correo).HasColumnName("correo");
            entity.Property(e => e.Direccion).HasColumnName("direccion");
            entity.Property(e => e.Nombre).HasColumnName("nombre");
            entity.Property(e => e.Telefono).HasColumnName("telefono");
        });

        modelBuilder.Entity<Limpieza>(entity =>
        {
            entity.HasKey(e => e.IdLimpieza).HasName("PK__Limpieza__0487A13CF1C39B86");

            entity.Property(e => e.IdLimpieza).HasColumnName("idLimpieza");
            entity.Property(e => e.Fecha).HasColumnName("fecha");
            entity.Property(e => e.IdEmpleado).HasColumnName("idEmpleado");
            entity.Property(e => e.IdHabitacion).HasColumnName("idHabitacion");
            entity.Property(e => e.Observaciones)
                .HasColumnType("text")
                .HasColumnName("observaciones");

            entity.HasOne(d => d.IdEmpleadoNavigation).WithMany(p => p.Limpiezas)
                .HasForeignKey(d => d.IdEmpleado)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Limpiezas__idEmp__41EDCAC5");

            entity.HasOne(d => d.IdHabitacionNavigation).WithMany(p => p.Limpiezas)
                .HasForeignKey(d => d.IdHabitacion)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Limpiezas__idHab__40F9A68C");
        });

        modelBuilder.Entity<Pago>(entity =>
        {
            entity.HasKey(e => e.IdPago).HasName("PK__Pagos__BD2295AD1BC267E9");

            entity.Property(e => e.IdPago).HasColumnName("idPago");
            entity.Property(e => e.FechaPago).HasColumnName("fechaPago");
            entity.Property(e => e.IdFactura).HasColumnName("idFactura");
            entity.Property(e => e.MetodoPago)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("metodoPago");
            entity.Property(e => e.Monto)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("monto");

            entity.HasOne(d => d.IdFacturaNavigation).WithMany(p => p.Pagos)
                .HasForeignKey(d => d.IdFactura)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Pagos__idFactura__3B40CD36");
        });

        modelBuilder.Entity<Reserva>(entity =>
        {
            entity.HasKey(e => e.IdReserva).HasName("PK__Reservas__94D104C878D3D60D");

            entity.Property(e => e.IdReserva).HasColumnName("idReserva");
            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("estado");
            entity.Property(e => e.FechaFin).HasColumnName("fechaFin");
            entity.Property(e => e.FechaInicio).HasColumnName("fechaInicio");
            entity.Property(e => e.IdCliente).HasColumnName("idCliente");
            entity.Property(e => e.IdHabitacion).HasColumnName("idHabitacion");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.Reservas)
                .HasForeignKey(d => d.IdCliente)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reservas__idClie__30C33EC3");

            entity.HasOne(d => d.IdHabitacionNavigation).WithMany(p => p.Reservas)
                .HasForeignKey(d => d.IdHabitacion)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reservas__idHabi__31B762FC");
        });

        modelBuilder.Entity<ServiciosAdicionale>(entity =>
        {
            entity.HasKey(e => e.IdServicio).HasName("PK__servicio__CEB98119DAB63E30");

            entity.ToTable("serviciosAdicionales");

            entity.Property(e => e.IdServicio).HasColumnName("idServicio");
            entity.Property(e => e.Descripcion)
                .HasColumnType("text")
                .HasColumnName("descripcion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Precio)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Usuarios__3214EC077DF40696");

            entity.Property(e => e.Contrasenia)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Usuario1)
                .HasMaxLength(100)
                .HasColumnName("Usuario");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
