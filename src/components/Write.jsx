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
        setImageBase64(reader.result);
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveData = async () => {
    const newData = {
      id: crypto.randomUUID(), // Genera un ID único para offline
      titulo: inputValue1,
      descripcion: inputValue2,
      categoria: inputValue3,
      image: imageBase64,
      timestamp: new Date().toISOString(),
    };

    try {
      // Intentar guardar en Firebase
      const db = getDatabase(appFirebase);
      const newDocRef = push(ref(db, "Pinterest/galeria"));
      await set(newDocRef, newData);
      newData.id = newDocRef.key; // Actualizar ID con el de Firebase

      alert("Guardado exitoso en Firebase");
    } catch (error) {
      console.warn("Guardando en IndexedDB debido a la falta de conexión:", error);
    } finally {
      // Guardar siempre en IndexedDB
      await guardarDatos(newData);

      // Actualizar estado local
      setImagenes((prevImagenes) => [...prevImagenes, newData]);
      setInputValue1("");
      setInputValue2("");
      setInputValue3("");
      setImageBase64("");
      setImageUrl("");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // Recuperar datos de Firebase
      const db = getDatabase(appFirebase);
      const imagenesRef = ref(db, "Pinterest/galeria");

      onValue(imagenesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const imagenesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setImagenes((prevImagenes) => {
            const mergedData = [...imagenesArray, ...prevImagenes];
            return mergedData.filter((item, index, self) => 
              index === self.findIndex((t) => t.id === item.id)
            );
          });
        }
      });

      // Recuperar datos de IndexedDB
      const offlineData = await obtenerDatos();
      setImagenes((prevImagenes) => {
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
      // Eliminar de Firebase
      await remove(imagenRef);
      alert("Imagen eliminada correctamente");
    } catch (error) {
      console.warn("No se pudo eliminar en Firebase, actualizando local:", error);
    } finally {
      // Actualizar estado local
      setImagenes(imagenes.filter((imagen) => imagen.id !== id));
    }
  };

  const handleUpdate = async (id, newTitulo, newDescripcion, newCategoria) => {
    const updatedData = {
      titulo: newTitulo,
      descripcion: newDescripcion,
      categoria: newCategoria,
    };

    try {
      // Actualizar en Firebase
      const db = getDatabase(appFirebase);
      const imagenRef = ref(db, `Pinterest/galeria/${id}`);
      await update(imagenRef, updatedData);

      alert("Imagen actualizada correctamente");
    } catch (error) {
      console.warn("No se pudo actualizar en Firebase:", error);
    } finally {
      // Actualizar estado local
      setImagenes(imagenes.map((imagen) => 
        imagen.id === id ? { ...imagen, ...updatedData } : imagen
      ));
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
          <li key={imagen.id}>
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
