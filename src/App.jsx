import { useState, useEffect } from 'react';
import appFirebase from './credenciales';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Write from './components/Write';
import Login from './components/Login';
import { guardarDatos, obtenerDatos } from './storage';
import './App.css'; // Importar estilos

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase);
        await guardarDatos({ id: 'usuario', email: usuarioFirebase.email });
      } else {
        setUsuario(null);
      }
    });
  }, []);

  useEffect(() => {
    const fetchUsuario = async () => {
      const datos = await obtenerDatos();
      const usuarioGuardado = datos.find((dato) => dato.id === 'usuario');
      if (usuarioGuardado) {
        setUsuario({ email: usuarioGuardado.email });
      }
    };
    
    fetchUsuario();
  }, []);

  return (
    <div>
      {usuario ? <Write correoUsuario={usuario.email} /> : <Login />}
    </div>
  );
}

export default App;
