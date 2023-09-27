import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import { getDatabase, ref, set } from "firebase/database"
// import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
};

class Firebase {

    constructor() {
        this.app = initializeApp(firebaseConfig)
        this.db = getDatabase(this.app)
        this.auth = getAuth();
        this.isLogged = false;
        this.credentials =null;
    }

    // *** AUTH API ***
    async doCreateUserWithEmailAndPassword(email, password) {
        try {
           
            const credentials = await createUserWithEmailAndPassword(this.auth, email, password);
            
            console.log({"CREATED USER ":{"uid":credentials.user.uid, "email":email}});
            
            const newUser = await set(ref(this.db,'users/' 
            + credentials.user.uid), {
                "email": email,
                "password": password,
            })
            console.log("USUARIO REGISTRADO NO REALTIME: " + newUser);
        } catch (error) {
            console.error(error.message)
            throw error;
        }
    }

    async doSignInWithEmailAndPassword(email, password) {
        try {
            /**
            Quando o usuário estiver logado atribua o valor TRUE
            ao atributo this.isLogged e as credenciais ao atributo this.credentials
            deverá retornar a propriedade user do atributo this.credentials.user
            */
           
           this.isLogged = true;
           const user = {
            "email": email,
            "password": password
        } 
            console.log({"token": this.auth.currentUser?.accessToken});
            const credentials = await signInWithEmailAndPassword(this.auth, user.email, user.password);
            console.log({"token": this.auth.currentUser?.accessToken});
            console.log({"uid":credentials.user?.uid});
           return this.credentials = credentials.user;
        } catch (error) {
            console.error(error.message)
            throw error;
        }
    }

    doSignOut = () => {
        try {
           signOut(this.auth);
           console.log("desconectado.");
           console.log({"token": this.auth.currentUser?.accessToken});   
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log({errorCode, errorMessage});
            process.exit(0);
        }
    };
}

export default Firebase;
