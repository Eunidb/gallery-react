// src/storage.js

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('miBaseDeDatos', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('miObjeto')) {
        db.createObjectStore('miObjeto', { keyPath: 'id' }); // No es necesario autoIncrement si ya usas un ID único
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.error('Error al abrir la base de datos:', event.target.error);
      reject(new Error('No se pudo abrir la base de datos.'));
    };
  });
};

export const guardarDatos = async (datos) => {
  try {
    const db = await openDatabase();
    const tx = db.transaction(['miObjeto'], 'readwrite');
    const store = tx.objectStore('miObjeto');

    store.put(datos); // `put` sobrescribe datos con la misma clave, si existe

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        console.log('Datos guardados exitosamente en IndexedDB');
        resolve();
      };

      tx.onerror = (event) => {
        console.error('Error al guardar los datos:', event.target.error);
        reject(new Error('No se pudieron guardar los datos en IndexedDB.'));
      };
    });
  } catch (error) {
    console.error('Error al interactuar con IndexedDB:', error);
    throw error;
  }
};

export const obtenerDatos = async () => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['miObjeto'], 'readonly');
      const store = tx.objectStore('miObjeto');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error('Error al obtener los datos:', event.target.error);
        reject(new Error('No se pudieron obtener los datos de IndexedDB.'));
      };
    });
  } catch (error) {
    console.error('Error al interactuar con IndexedDB:', error);
    throw error;
  }
};
