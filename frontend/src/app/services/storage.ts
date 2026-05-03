import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage = inject(Storage);
  private db = inject(Firestore);


  async subirFotoPerfil(file: File, uid: string): Promise<string> {
    try {

      const filePath = `perfiles/${uid}_${file.name}`;
      const storageRef = ref(this.storage, filePath);


      const uploadTask = await uploadBytesResumable(storageRef, file);


      const downloadURL = await getDownloadURL(uploadTask.ref);


      const userDocRef = doc(this.db, 'usuarios', uid);
      await updateDoc(userDocRef, {
        fotoPerfil: downloadURL
      });

      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }
  }
}