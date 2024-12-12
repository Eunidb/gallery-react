import { useState, useEffect } from 'react';
import appFirebase from './credenciales';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Write from './components/Write';
import Login from './components/Login';
import { guardarDatos, obtenerDatos } from './storage';
import './App.css'; // Importar estilos


// index.js o App.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado exitosamente:', registration.scope);
      })
      .catch(error => {
        console.log('Registro de Service Worker fallido:', error);
      });
  });
}

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
