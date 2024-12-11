// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import appFirebase from "../credenciales";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { guardarDatos } from "../storage"; // Importa la función para guardar datos
import './Login.css'; // Archivo CSS importado correctamente

const auth = getAuth(appFirebase);

const Login = () => {
  const [registrando, setRegistrando] = useState(false);

  const functAutenticacion = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contrasena = e.target.password.value;

    if (registrando) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
        alert("Cuenta creada exitosamente");
        
        // Guardar datos en IndexedDB
        const userData = {
          id: userCredential.user.uid,
          email: correo,
          password: contrasena,
          timestamp: new Date()
        };
        await guardarDatos(userData);
        
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert("Asegúrate de que la contraseña tenga al menos 8 caracteres.");
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, correo, contrasena);
        alert("Inicio de sesión exitoso");
        
        // Guardar datos en IndexedDB
        const userData = {
          id: userCredential.user.uid,
          email: correo,
          password: contrasena,
          timestamp: new Date()
        };
        await guardarDatos(userData);

      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert("El correo o la contraseña son incorrectos.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="imagen"></div>
        <form onSubmit={functAutenticacion} className="login-form">
          <input type="email" placeholder="Ingresar Email" id="email" className="input-field" required />
          <input type="password" placeholder="Ingresar Password" id="password" className="input-field" required />
          <button type="submit" className="submit-button">
            {registrando ? "Regístrate" : "Inicia Sesión"}
          </button>
        </form>
        <h4>
          {registrando ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
          <button className="toggle-button" onClick={() => setRegistrando(!registrando)}>
            {registrando ? "Inicia Sesión" : "Regístrate"}
          </button>
        </h4>
      </div>
    </div>
  );
};

export default Login;
