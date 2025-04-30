new Vue({
  el: '#app',
  data() {
    return {
      bootlectures: [
        {
          id: 1,
          name: "تقنيات وأدوات الذكاء الاصطناعي الأخضر Green AI",
          description: "نوع اللقاء: رقمي - الحالة: متاحة- الموعد: 2025-04-23 - التوقيت :05:00 مساءً",
          image: "./src/assets/images/Green AI.jpeg",
          category: "lecture",
          link: "https://webinar.attaa.sa/view/1129",
          showDescription: false  // حالة إخفاء/إظهار الوصف
        },
        {
          id: 2,
          name: "المعرض السعودي للتصنيع الذكي - Saudi Smart Manufacturing 2025",
          description: "من المقرر أن ينطلق المعرض السعودي للتصنيع الذكي في نسخته الثالثة في الفترة من 12 إلى 15 مايو 2025. المعرض جزء من أسبوع الرياض الدولي للصناعة، وهو أكبر تجمع للقطاعات الصناعية في منطقة الشرق الأوسط وشمال أفريقيا.",
          image: "./src/assets/images/Saudi Smart Manufacturing 2025.jpg",
          category: "lecture",
          lat: 24.7533, 
          lng: 46.7267,
          link: "https://x.com/SSMExhibition",
          showDescription: false
        },
        {
          id: 3,
          name: "قمة التحول الرقمي السعودية 2025",
          description: "قمة التحول الرقمي السعودية 2025، تُعقد في الرياض وتجمع كبار التنفيذيين ومديري التكنولوجيا لمناقشة موضوعات مثل الذكاء الاصطناعي، الويب 3.0، الحوسبة الكمية، والأمن السيبراني.",
          image: "./src/assets/images/قمة التحول الرقمي السعودية .png",
          category: "lecture",
          link: "https://digitransformationsummit.com/ksa/?utm_source=chatgpt.com",
          showDescription: false
        }
      ]
    };
  },
  methods: {
    toggleDescription(bootlectures) {
      bootlectures.showDescription = !bootlectures.showDescription;
    },
    
  }
});
