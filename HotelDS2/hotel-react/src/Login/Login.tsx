import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7287/api/Login/Validar', {
        usuario,
        contrasenia,
      });

      if (response.status === 200) {
        sessionStorage.setItem('usuario', response.data.usuario);
        window.location.href = '/dashboard';
      } else {
        setError(response.data.mensaje || 'Error desconocido');
      }
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error de conexión con el servidor');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: 'url("/fondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow text-center bg-white bg-opacity-75" style={{ minWidth: '300px', maxWidth: '400px', width: '100%' }}>
                <img
                src="/logoHotelDiamante.png"
                alt="Logo del hotel"
                className="mb-3"
                style={{ maxWidth: '120px', margin: '0 auto' }}
                />

                <h3 className="mb-4">Iniciar sesión</h3>

                <form onSubmit={handleLogin}>
                <div className="mb-3 text-start">
                    <label className="form-label">Usuario</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese su usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                    />
                </div>
                <div className="mb-3 text-start">
                    <label className="form-label">Contraseña</label>
                    <input
                    type="password"
                    className="form-control"
                    placeholder="Ingrese su contraseña"
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">Entrar</button>
                </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default Login;
