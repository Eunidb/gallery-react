// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import appFirebase from "../credenciales";
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database";
import { obtenerDatos, guardarDatos } from '../storage'; // Importa las funciones de IndexedDB
import './Write.css';

const Write = () => {
  const [inputValue1, setInputValue1] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [inputValue3, setInputValue3] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagenes, setImagenes] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); // Incluye automáticamente el prefijo MIME
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveData = async () => {
    const db = getDatabase(appFirebase);
    const newDocRef = push(ref(db, "Pinterest/galeria"));

    const newData = {
      id: newDocRef.key, // Ensure a unique ID
      titulo: inputValue1,
      descripcion: inputValue2,
      categoria: inputValue3,
      image: imageBase64,
      timestamp: new Date().toISOString(),
    };

    try {
      // Guarda los datos en Firebase
      await set(newDocRef, newData);
      alert("Guardado exitoso");

      // Guarda los datos en IndexedDB
      await guardarDatos(newData);

      // Actualiza el estado local
      setImagenes(prevImagenes => [...prevImagenes, newData]);
      setInputValue1("");
      setInputValue2("");
      setInputValue3("");
      setImageBase64("");
      setImageUrl("");
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Recupera los datos de Firebase
      const db = getDatabase(appFirebase);
      const imagenesRef = ref(db, "Pinterest/galeria");

      onValue(imagenesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const imagenesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setImagenes(imagenesArray);
        } else {
          setImagenes([]);
        }
      });

      // Recupera los datos de IndexedDB para offline
      const offlineData = await obtenerDatos();
      setImagenes(prevImagenes => {
        // Merge and deduplicate data
        const mergedData = [...prevImagenes, ...offlineData];
        return mergedData.filter((item, index, self) => 
          index === self.findIndex((t) => t.id === item.id)
        );
      });
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const db = getDatabase(appFirebase);
    const imagenRef = ref(db, `Pinterest/galeria/${id}`);

    try {
      // Elimina el nodo seleccionado de Firebase
      await remove(imagenRef);
      alert("Imagen eliminada correctamente");

      // Actualiza el estado local
      setImagenes(imagenes.filter(imagen => imagen.id !== id));
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
    }
  };

  const handleUpdate = async (id, newTitulo, newDescripcion, newCategoria) => {
    const db = getDatabase(appFirebase);
    const imagenRef = ref(db, `Pinterest/galeria/${id}`);

    const updatedData = {
      titulo: newTitulo,
      descripcion: newDescripcion,
      categoria: newCategoria,
    };

    try {
      // Actualiza los datos en Firebase
      await update(imagenRef, updatedData);
      alert("Imagen actualizada correctamente");

      // Actualiza el estado local
      setImagenes(imagenes.map(imagen => 
        imagen.id === id 
          ? { ...imagen, ...updatedData } 
          : imagen
      ));
    } catch (error) {
      console.error("Error al actualizar la imagen:", error);
    }
  };

  return (
    <div>
      <h2>Galería de Imágenes de Pinterest</h2>
      <input 
        type="text" 
        placeholder="Título" 
        value={inputValue1} 
        onChange={(e) => setInputValue1(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Descripción" 
        value={inputValue2} 
        onChange={(e) => setInputValue2(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Categoría" 
        value={inputValue3} 
        onChange={(e) => setInputValue3(e.target.value)} 
      />
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
      />
      <button onClick={saveData}>Guardar</button>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Imagen seleccionada" 
          style={{ width: "200px" }} 
        />
      )}
      <h3>Imágenes Guardadas:</h3>
      <ul>
        {imagenes.map((imagen) => (
          <li key={imagen.id || imagen.timestamp}>
            <h4>{imagen.titulo}</h4>
            <p>{imagen.descripcion}</p>
            <p>Categoría: {imagen.categoria}</p>
            {imagen.image && (
              <img 
                src={imagen.image} 
                alt={imagen.titulo} 
                style={{ width: "150px" }} 
              />
            )}
            <button onClick={() => handleDelete(imagen.id)}>Eliminar</button>
            <button 
              onClick={() => handleUpdate(
                imagen.id, 
                "Nuevo Título", 
                "Nueva Descripción", 
                "Nueva Categoría"
              )}
            >
              Actualizar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Write;