
new Vue({
  el: '#app',
  data() {
    return {
      bootcamps: [
        {
          id: 1,
          name: "معسكر Git",
          description: "📣 انطلق معنا في معسكر Git التعاوني – خطوتك الأولى نحو احتراف إدارة المشاريع البرمجية! 🚀 هل أنت طالب حاسب مبتدئ وتتطلع لفهم Git بطريقة سهلة وممتعة وتطبيقية؟ 🤔 تعال لنا في معسكر Git التعاوني واكتشف كيف تتحكم في إصدارات مشاريعك والشغل مع فريقك بكل سلاسة!",
          image: "./src/assets/images/Git.jpg",
          category: "camp",
          lat: 24.8169,
          lng: 46.7105, // مثلاً: الرياض
          link: "https://docs.google.com/forms/d/e/1FAIpQLSeRAkM59yvvxU6RT1CPnLaCHzq1lQNt7a7rjlR4rxymJmWTgw/viewform",
          showDescription: false
        },
        {
          id: 2,
          name: "معسكر هندسة البنية التحتية (عن بعد)",
          description: "يهدف المعسكر إلى تزويد المشاركين بالمعرفة والمهارات اللازمة لتصميم وبناء وإدارة البنية التحتية الرقمية الحديثة بالاضافة للجوانب الأساسية والمتقدمة للبنية التحتية التقنية، بدءًا من إدارة الشبكات وقواعد البيانات إلى الحوسبة السحابية وأمن المعلومات",
          image: "./src/assets/images/saudidigital.academy.jpg",
          category: "camp",
          lat: 24.7488, 
          lng: 46.6885,
          link: "https://sda.edu.sa/ar/bootcamp/212",
          showDescription: false
        },
        {
          id: 3,
          name: "شهادة Google Data Analytics",
          description: "احصل على شهادة احترافية في تحليل البيانات من Google عبر Coursera.",
          image: "./src/assets/images/Google Data Analytics Professional Certificate.jpg",
          category: "camp",
          link: "https://www.coursera.org/professional-certificates/google-data-analytics",
          showDescription: false
        },
        {
          id: 4,
          name: "Apple Developer Academy Program",
          description: "The Apple Developer Academy is a 9 month program. Learners will use the Apple ecosystem to learn Coding, Design Fundamentals, App Business, Artificial Intelligence, Marketing, Process and Professional skills.",
          image: "./src/assets/images/Apple Academy.jpg",
          category: "camp",
          lat: 24.8616,  
          lng: 46.7254,
          link: "https://developeracademy.tuwaiq.edu.sa/#programs-section",
          showDescription: false
        },
        {
          id: 5,
          name: "تحليل البيانات وإعداد التقارير باستخدام مايكروسوفت Power BI",
          description: "برنامج Power BI من مايكروسوفت يُعد من أهم أدوات التحليل ودعم إتخاذ القرار، حيث يوفر رؤية شاملة للبيانات الأساسية في المنظمة عبر لوحات قياس وتقارير تفاعلية. يهدف هذا البرنامج التدريبي لتزويد المشاركين بمهارات تصميم نماذج بيانات قابلة للتطوير، وتصفية ومعالجة البيانات، وإنشاء وتحسين التقارير، بالإضافة إلى إدارة مساحات العمل.",
          image: "./src/assets/images/Power BI.jpg",
          category: "camp",
          lat: 24.7671, 
          lng: 46.6413,
          link: "https://fa.gov.sa/Services/ProgramDetails/17ce658d-32b1-4345-9e54-aebc00ec8e60",
          showDescription: false
        }
        
      ]
    };
  },
  methods: {
    toggleDescription(bootcamp) {
      bootcamp.showDescription = !bootcamp.showDescription;
    }
    
  }
}).mount('#app');



