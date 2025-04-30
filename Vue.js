import { getFirestore, collection, addDoc } from "firebase/firestore";  
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";  

const db = getFirestore();
const auth = getAuth();

const signup = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // تخزين بيانات المستخدم في Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
      createdAt: new Date(),
    });

    console.log("تم تسجيل المستخدم وإضافته إلى Firestore بنجاح!");
  } catch (error) {
    console.error("حدث خطأ أثناء التسجيل:", error.message);
  }
};
