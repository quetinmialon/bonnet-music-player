// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, setDoc }
  from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyCZPH84egyMPJ4e76NXveKoYY0UWRzw4X4",
    authDomain: "bonnet-music-player.firebaseapp.com",
    databaseURL: "https://bonnet-music-player-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bonnet-music-player",
    storageBucket: "bonnet-music-player.appspot.com",
    messagingSenderId: "1043915959737",
    appId: "1:1043915959737:web:fb7f1af503c57c0a2d9a68"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);

const createUser = async (email, password) => {

  try {
    // Signed up 
    const user = await createUserWithEmailAndPassword(auth, email, password);

    return user;

  } catch (e) {
    const errorCode = e.code;
    const errorMessage = e.message;
  }
}

/* Création d'une fonction d'un objet "utilisateur connécté" */

const signIn = async (email, password) => {

  try {

    // Signed in
    const authenticatedUser = await signInWithEmailAndPassword(auth, email, password)
   
    return authenticatedUser;
    
  } catch (e) {
    const errorCode = e.code;
    const errorMessage = e.message;
  }
}

const ajouterUnObjet = async (obj, dataBase) => {

  try {
    const docRef = await addDoc(collection(db, dataBase), obj)

    console.log(`Le document a bien été ajouté la base de donnée : ${dataBase}`, docRef.id);
    obj.id = docRef.id;
    return obj

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

const ajouterUnObjetAvecIdSpécifique = async (obj, dataBase, customId) => {
  try {
    // Specify a custom document ID using `doc()` method
    const docRef = doc(collection(db, dataBase), customId);

    // Set the data for the document
    await setDoc(docRef, obj);

    console.log(`Le document a bien été ajouté à la base de données : ${dataBase} avec l'ID : ${customId}`);
    obj.id = customId;
    return obj;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const ajouterUnObjetNommé = async (obj, dataBase) => {

  try {
    const docRef = await addDoc(collection(db, dataBase), obj)

    console.log(`Le document a bien été ajouté la base de donnée : ${dataBase}`, docRef.id);
    obj.id = docRef.id;
    return obj

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


//!!!!!   PROMESSE !!!  obtenir la collection :  let maCollection = await obtenirTouteLaCollection("base-de-donnée")
const obtenirTouteLaCollection = async (dataBase) => {
  try {
    const _collection = collection(db, dataBase);
    const querySnapshot = await getDocs(_collection);

    const tableau = await querySnapshot.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id
      return data
    })
    return tableau

  } catch (error) {
    console.error("An error occurred:", error);
  }
}


const mettreAJourUnDocument = async (dataBase, id, obj) => {
  const docRef = doc(db, dataBase, id);

  try {
    await updateDoc(docRef, obj);
    console.log("Le document a bien été modifié");
  } catch (error) {
    console.log(error);
  }
};


const supprimerUnDocument = async (dataBase, id) => {
  const docRef = doc(db, dataBase, id);

  try {
    await deleteDoc(docRef);
    console.log("Le document a bien été supprimé");
  } catch (error) {
    console.log(error);
  }
};


const supprimerTousLesDocumentsDeLaCollection = async (collectionName) => {
  const collectionRef = collection(db, collectionName);

  try {
    const querySnapshot = await getDocs(collectionRef);

    querySnapshot.forEach(async (doc) => {

      await deleteDoc(doc.ref);
    });

    console.log("Tous les documents de la collection ont été supprimés.");
  } catch (error) {
    console.log("Une erreur s'est produite : ", error);
  }
};


const trouverDocumentsAvecValeur = async (collectionName, fieldName, targetValue) => {
  const collectionRef = collection(db, collectionName);
  
  try {
    const querySnapshot = await getDocs(query(collectionRef, where(fieldName, '==', targetValue)));

    querySnapshot.forEach((doc) => {
      //console.log('Document ID: ', doc.id);
      //console.log('Document data: ', doc.data());
      let collection = doc.data();
      console.log(collection)
      return collection;
    });
  } catch (error) {
    console.log("Une erreur s'est produite : ", error);
  }
};


const telDocumentExiste = async (collectionName, fieldName, targetValue) => {
  const collectionRef = collection(db, collectionName);
  let documentExists = false;

  try {
    const querySnapshot = await getDocs(query(collectionRef, where(fieldName, '==', targetValue)));

    querySnapshot.forEach((doc) => {

      documentExists = true;
    });

    return documentExists;
  } catch (error) {
    console.log("Une erreur s'est produite : ", error);
    return false; // Handle any errors and return false
  }
};


const mettreAJourDocumentsAvecValeurParticulière = async (collectionName, updateObject, propriété, valeur) => {
  const collectionRef = collection(db, collectionName);

  try {
    const querySnapshot = await getDocs(collectionRef);

    querySnapshot.forEach(async (document) => {
      const data = document.data();
      if (data && data[propriété] === valeur) {
        const docRef = doc(db, `${collectionName}/${document.id}`); // Corrected line
        await updateDoc(docRef, updateObject);
        console.log('Document ID:', document.id, 'has been updated with', updateObject);
      }
    });
  } catch (error) {
    console.log("Une erreur s'est produite : ", error);
  }
};


const deleteCollection = async (collectionPath) => {
  const q = query(collection(db, collectionPath));

  try {
    const querySnapshot = await getDocs(q);

    // Delete all documents in the collection
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Delete the collection itself
    await deleteCollection(collection(db, collectionPath));

    console.log(`Collection '${collectionPath}' and all its documents have been deleted.`);
  } catch (error) {
    console.error("Error deleting collection: ", error);
  }
};/* Récupération d'un objet en fonction de son Id */
const RécupérerObjet = async (database, objectId) => {
  let retour;
  const collection = await obtenirTouteLaCollection(database)
  //console.log(collection)
  collection.forEach(element => { 
    if (element.id == objectId) {
      retour = element
      return retour;
    }
  });
  return retour;
}




export {
  ajouterUnObjet,
  ajouterUnObjetAvecIdSpécifique,
  obtenirTouteLaCollection,
  trouverDocumentsAvecValeur,
  mettreAJourUnDocument,
  supprimerUnDocument,
  supprimerTousLesDocumentsDeLaCollection,
  mettreAJourDocumentsAvecValeurParticulière,
  telDocumentExiste,
  deleteCollection,
  createUser,
  signIn,
  RécupérerObjet
}