import { Routes, Route } from "react-router-dom";
import { ListarReporteServicios } from "./components/ListaReporteServicio";


function AppReportes() {
    return (
        <Routes>
            <Route path="/" element={<ListarReporteServicios />} />
            {}
        </Routes>
    );
}

export default AppReportes;