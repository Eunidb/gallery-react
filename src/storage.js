// src/storage.js

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('miBaseDeDatos', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('miObjeto')) {
        db.createObjectStore('miObjeto', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject('Error al abrir la base de datos:', event);
    };
  });
};

export const guardarDatos = async (datos) => {
  const db = await openDatabase();
  const tx = db.transaction(['miObjeto'], 'readwrite');
  const store = tx.objectStore('miObjeto');
  store.put(datos);

  tx.oncomplete = () => {
    console.log('Datos guardados exitosamente en IndexedDB');
  };

  tx.onerror = (event) => {
    console.log('Error al guardar los datos:', event);
  };
};

export const obtenerDatos = async () => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['miObjeto'], 'readonly');
    const store = tx.objectStore('miObjeto');
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject('Error al obtener los datos:', event);
    };
  });
};
