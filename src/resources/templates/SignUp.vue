<template>
  <div class="container">
    <div class="card">
      <h2 style="text-align:center;">إنشاء حساب جديد</h2>
      <input type="text" v-model="name" placeholder="الاسم كامل" />
      <input type="email" v-model="email" placeholder="البريد الإلكتروني" />
      <input type="password" v-model="password" placeholder="كلمة المرور" />
      <input type="password" v-model="confirmPassword" placeholder="تأكيد كلمة المرور" />
      <input type="text" v-model="latitude" placeholder="خط العرض (Latitude)" />
      <input type="text" v-model="longitude" placeholder="خط الطول (Longitude)" />

      <p>اختر اهتماماتك:</p>
      <div class="interests">
        <label v-for="interest in allInterests" :key="interest">
          <input type="checkbox" :value="interest" v-model="selectedInterests" />
          {{ interest }}
        </label>
      </div>

      <button @click="signup">تسجيل</button>
      <p class="error" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth, db } from './firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

// المتغيرات
const email = ref('');
const name = ref('');
const password = ref('');
const confirmPassword = ref('');
const latitude = ref('');
const longitude = ref('');
const selectedInterests = ref([]);
const error = ref('');

const allInterests = [
  'برمجة',
  'ذكاء اصطناعي',
  'أمن سيبراني',
  'تحليل بيانات',
  'تصميم',
  'artificial intelligence',
  'machine learning course',
  'Science & Technology',
  'Master/Certification',
  'Master/Science'
];

// الدالة الخاصة بالتسجيل
const signup = async () => {
  error.value = '';

  if (!email.value || !password.value || !confirmPassword.value || !name.value) {
    error.value = 'يرجى ملء جميع الحقول.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'كلمة المرور وتأكيدها غير متطابقتين.';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.';
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      name: name.value,
      email: email.value,
      latitude: parseFloat(latitude.value),
      longitude: parseFloat(longitude.value),
      interests: selectedInterests.value,
      createdAt: new Date()
    });

    alert('تم إنشاء الحساب بنجاح!');
    window.location.href = 'login.html';
  } catch (e) {
    if (e.code === 'auth/email-already-in-use') {
      error.value = 'البريد الإلكتروني مستخدم بالفعل.';
    } else if (e.code === 'auth/invalid-email') {
      error.value = 'البريد الإلكتروني غير صالح.';
    } else if (e.code === 'auth/weak-password') {
      error.value = 'كلمة المرور ضعيفة.';
    } else {
      error.value = 'حدث خطأ: ' + e.message;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 100px 20px 20px;
  font-family: 'Tajawal', sans-serif;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: right;
}

input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  direction: rtl;
}

button {
  background: linear-gradient(135deg, #4a0b72, #2f0e54);
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

button:hover {
  background: #f39c12;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.interests {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  direction: rtl;
}

.interests label {
  background: #eee;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
