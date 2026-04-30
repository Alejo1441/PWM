import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(Storage);
  private db = inject(Firestore);

  // Método para subir una foto de perfil
  async subirFotoPerfil(file: File, uid: string): Promise<string> {
    try {
      // 1. Crear una referencia en Storage. Lo guardaremos en la carpeta 'perfiles/' con el nombre del UID.
      const filePath = `perfiles/${uid}_${file.name}`;
      const storageRef = ref(this.storage, filePath);

      // 2. Subir el archivo
      const uploadTask = await uploadBytesResumable(storageRef, file);

      // 3. Obtener la URL de descarga pública de la imagen
      const downloadURL = await getDownloadURL(uploadTask.ref);

      // 4. Guardar esa URL en el documento del usuario en Firestore
      const userDocRef = doc(this.db, 'usuarios', uid);
      await updateDoc(userDocRef, {
        fotoPerfil: downloadURL
      });

      return downloadURL; // Devolvemos la URL por si la necesitamos de inmediato
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  }
}