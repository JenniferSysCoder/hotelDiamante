export default function NoAutorizado() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "80vh" }}>
      <h1 className="text-danger display-4 mb-3">403 - No autorizado</h1>
      <p className="text-muted fs-5">No tienes permiso para acceder a esta sección.</p>
    </div>
  );
}