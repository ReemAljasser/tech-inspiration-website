<template>
  <div class="container">
    <h1>📍 محاضرات ومعسكرات تقنية</h1>

    <!-- 🔎 فلترة حسب التخصص -->
    <div class="category">
      <label for="category">اختر الفئة:</label>
      <select id="category" v-model="selectedCategory">
        <option value="">الكل</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- إدخال الإحداثيات من قبل المستخدم -->
    <div class="coordinates-input">
      <label for="latitude">خط العرض:</label>
      <input type="number" id="latitude" v-model="userCoordinates.latitude" placeholder="مثال: 24.7136">

      <label for="longitude">خط الطول:</label>
      <input type="number" id="longitude" v-model="userCoordinates.longitude" placeholder="مثال: 46.6753">

      <button @click="addUserMarker">إضافة دبوس</button>
    </div>

    <!-- 🔍 البحث عن فعالية -->
  <div class="search-event">
  <label for="search">ابحث باسم الفعالية:</label>
  <input type="text" id="search" v-model="searchQuery" placeholder="مثال: محاضرة الأمن السيبراني">
  <button @click="searchEventByName">🔎 بحث</button>
   
   <input
  v-model="searchQuery2"
  placeholder="ابحث عن مكان مثل النخيل مول"
  class="search-input"/>
<button @click="searchLocation">🔍 بحث</button>
<ul v-if="searchResults.length > 0">
  <li v-for="result in searchResults" :key="result.display_name" @click="selectLocation(result)">
    {{ result.display_name }}
  </li>
</ul>
</div>

    
    <!-- 🗺️ عرض الخريطة -->
    <div id="map"></div>

     <!-- 📅 قائمة الفعاليات كجدول زمني -->
     <div class="events">  
  <h2>📆 الفعاليات القادمة:</h2>  
  <table>  
    <thead>  
      <tr>  
        <th>اسم الفعالية</th>  
        <th>التاريخ</th>  
      </tr>  
    </thead>  
    <tbody>  
      <tr v-for="event in filteredEvents" :key="event.id">  
        <td><strong>{{ event.name }}</strong></td>  
        <td>{{ event.date }}</td>  
      </tr>  
    </tbody>  
  </table>  
</div>  
  </div>
</template>

<script>
import L from "leaflet";
import eventsData from "./events.json";
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';


export default {
  data() {
    return {
      selectedCategory: '',
      categories: ['lecture', 'camp', 'fair'], // إضافة الفئات المناسبة
      events: eventsData.events || [],
      map: null,
      markers: [],
      userCoordinates: {
        latitude: null,
        longitude: null
      },
      searchQuery: '', // ✨ النص اللي المستخدم يكتبه
      searchQuery2: '', // ✨ النص اللي المستخدم يكتبه
      searchMarker: null,      // ✨ لتخزين الدبوس الناتج عن البحث (عشان نقدر نحذفه لو بحث ثاني)
      searchResults: [], // هنا بنخزن نتائج البحث
      layersMap: {
      lectures: L.layerGroup(),
      bootcamps: L.layerGroup(),
      fairs: L.layerGroup()
    },

    };
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([24.7136, 46.6753], 10);

// طبقة الأساس
const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap'
}).addTo(this.map);

// مثال لطبقة أخرى (ما هو ضروري لكن ممكن تضيفينها)
const satellite = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap HOT'
});

// 🟣 تعريف الطبقات الثابتة
const staticFairsLayer = L.layerGroup([
  L.marker([24.7533, 46.7267]).bindPopup("المعرض السعودي للتصنيع الذكي - Saudi Smart Manufacturing 2025"),
  L.marker([24.6897, 46.7173]).bindPopup("قمة التحول الرقمي السعودية 2025")
  
]);

// 🟣 تعريف الطبقات الديناميكية من JSON
const staticBootcamps = L.layerGroup([
  L.marker([24.7135517, 46.6752957]).bindPopup("Day Consulting ISTQB® accredited training provider"),
  L.marker([24.691647, 46.6829431]).bindPopup("ISTQB® Foundation Exam and Training Course (3 days, English) - Riyadh")
  
]);
const staticLectures = L.layerGroup();

// 🟣 تحميل الأحداث من events.json
eventsData.events.forEach(event => {
  const cat = event.tags?.find(tag => tag.category)?.category || '';
  const venue = event.primary_venue?.address;

  if (venue && venue.latitude && venue.longitude) {
    const marker = L.marker([
      parseFloat(venue.latitude),
      parseFloat(venue.longitude)
    ]).bindPopup(`
      <strong>${event.name}</strong><br>
      ${venue.localized_address_display}<br>
      <a href="${event.url}" target="_blank">تفاصيل</a>
    `);

    if (cat === 'lecture') {
      staticLectures.addLayer(marker);
    } else if (cat === 'camp') {
      staticBootcamps.addLayer(marker);
    }
  }
});
  
let destinationLat = null;
let destinationLng = null;
let routingControl = null;
let userLat = null;
let userLng = null;

// تحديد موقع المستخدم الحالي
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;

      const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // وضع علامة لموقع المستخدم
      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(this.map)
        .bindPopup("📍 موقعك الحالي");

      // تحريك الخريطة إلى موقع المستخدم
      this.map.setView([userLat, userLng], 13);

      // ✅ عرض جميع الفعاليات اللي تحتوي على إحداثيات صحيحة
      const validEvents = eventsData.events.filter(event =>
        event.primary_venue &&
        event.primary_venue.address &&
        event.primary_venue.address.latitude &&
        event.primary_venue.address.longitude && event.customCategory
      );

      validEvents.forEach(event => {
        const lat = parseFloat(event.primary_venue.address.latitude);
        const lng = parseFloat(event.primary_venue.address.longitude);

        const marker = L.marker([lat, lng])
          .addTo(this.map)
          .bindPopup(`
            <strong>${event.primary_venue.name}</strong><br>
            <a href="${event.tickets_url}" target="_blank">للحجز / شراء التذاكر</a>
            <a href="${event.url}" target="_blank">تفاصيل الحدث</a>
          `);

        // عند الضغط على الماركر، ارسم المسار
        marker.on('click', () => {
          destinationLat = lat;
          destinationLng = lng;

          if (routingControl) {
            this.map.removeControl(routingControl);
          }

          routingControl = L.Routing.control({
            waypoints: [
              L.latLng(userLat, userLng),
              L.latLng(destinationLat, destinationLng)
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            createMarker: function () {
              return null; // منع رسم دبابيس تلقائية
            },
            lineOptions: {
              styles: [{ color: 'blue', weight: 4 }]
            }
          }).addTo(this.map);
        });
      });
    },
    error => {
      console.error("فشل في جلب الموقع:", error);
    }
  );
} else {
  alert("المتصفح لا يدعم تحديد الموقع الجغرافي.");
}

this.events = eventsData.events.map(event => {
  const categoryTag = event.tags?.find(tag => tag.category);
  event.customCategory = categoryTag ? categoryTag.category.toLowerCase() : '';
  return event;
});

 
  // إضافة باقي الأحداث كمواقع
  eventsData.events.forEach((event) => {
    if (event.primary_venue && event.primary_venue.address) {
      const { latitude, longitude, localized_address_display } = event.primary_venue.address;

      if (latitude && longitude) {
        L.marker([parseFloat(latitude), parseFloat(longitude)])
          .addTo(this.map)
          .bindPopup(`
            <strong>${event.primary_venue.name}</strong><br>
            ${localized_address_display}<br>
            <a href="${event.tickets_url}" target="_blank">للحجز / شراء التذاكر</a>
            <a href="${event.url}" target="_blank">تفاصيل الحدث</a>
          `);
      }
    }
  });

  

 // إنشاء مجموعات الطبقات الأساسية (Base Maps) والطبقات التكميلية (Overlay Maps)
 const baseMaps = {
    "🗺 الخريطة العادية": streets,

    // يمكنك إضافة طبقة أقمار صناعية إذا حبيتي:
     "🛰 خريطة الأقمار الصناعية": satellite
  };
  
  const overlayMaps = {
    "محاضرات": staticLectures,
  "معسكرات": staticBootcamps,
  "معارض تقنية": staticFairsLayer
  };

  // إضافة Layers Control إلى الخريطة
  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(this.map);
  
  // يمكنك اختيار إظهار جميع الطبقات مبدئيًا:
  this.layersMap.lectures.addTo(this.map);
  this.layersMap.bootcamps.addTo(this.map);
  this.layersMap.fairs.addTo(this.map);

// 🟣 عرض بعض الطبقات تلقائيًا
staticFairsLayer.addTo(this.map);
staticLectures.addTo(this.map);
staticBootcamps.addTo(this.map);

  
},
selectLocation(result) {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    // حذف العلامات السابقة إذا فيه
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // إضافة ماركر جديد على الموقع المحدد
    const marker = L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup(`<strong>${result.display_name}</strong>`)
      .openPopup();

    this.markers.push(marker);

    // تغيير عرض الخريطة للموقع
    this.map.setView([lat, lon], 14);

    // مسح النتائج بعد ما يختار المستخدم وحدة
    this.searchResults = [];

    // رسم مسار بين موقع المستخدم والمكان المحدد (مثال):
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // إذا فيه خط سابق نزيله
        if (this.routingControl) {
          this.map.removeControl(this.routingControl);
        }
        
        this.routingControl = L.Routing.control({
          waypoints: [
            L.latLng(userLat, userLng),
            L.latLng(lat, lon)
          ],
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
          createMarker: () => null,
          lineOptions: {
            styles: [{ color: 'blue', weight: 4 }]
          }
        }).addTo(this.map);
      });
    }
  },
async searchLocation() {
    if (!this.searchQuery2) return;

    const query2 = encodeURIComponent(this.searchQuery2);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query2}&addressdetails=1&limit=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
         // نخزن النتائج في searchResults
      this.searchResults = data.map(result => ({
        display_name: result.display_name,
        lat: result.lat,
        lon: result.lon
      }));
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);

        
        const marker = L.marker([lat, lon])
          .addTo(this.map)
          .bindPopup(`<strong>${place.display_name}</strong>`)
          .openPopup();

        this.markers.push(marker);
        this.map.setView([lat, lon], 14);
       // 🧭 خذي موقع المستخدم الحالي
       if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          const userIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

          // ماركر للمستخدم
          const userMarker = L.marker([userLat, userLon], { icon: userIcon })
            .addTo(this.map)
            .bindPopup("📍 موقعك الحالي")
            .openPopup();

          this.markers.push(userMarker);

            // 🛣️ ارسم المسار باستخدام Routing Machine
            if (this.routingControl) {
            this.map.removeControl(this.routingControl);
          }

          this.routingControl = L.Routing.control({
            waypoints: [
              L.latLng(userLat, userLon),
              L.latLng(lat, lon)
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            createMarker: () => null,
            lineOptions: {
              styles: [{ color: 'blue', weight: 4 }]
            }
          }).addTo(this.map);

        }, error => {
          alert("تعذر تحديد موقعك");
          console.error(error);
        });
      } else {
        alert("المتصفح لا يدعم تحديد الموقع الجغرافي");
      }

    } else {
      alert("📍 لم يتم العثور على المكان");
    }
  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء البحث");
  }
  },

  async getEventsFromEventbrite() {
  const url = "https://www.eventbriteapi.com/v3/events/search/?q=tech&location.address=Riyadh&token=BWSL3BPJXVGNWE7M7B3A";

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();

    console.log(data); // يحتوي على قائمة الأحداث
  } catch (error) {
    console.error("Error fetching Eventbrite events:", error);
  }
},

    // إضافة دبوس جديد بناءً على إحداثيات المستخدم
    addUserMarker() {
      const { latitude, longitude } = this.userCoordinates;

      if (latitude && longitude) {
        const purpleIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([parseFloat(latitude), parseFloat(longitude)], { icon: purpleIcon })
          .addTo(this.map)
          .bindPopup(`
            <strong>موقع مخصص:</strong><br>
            خط العرض: ${latitude}<br>
            خط الطول: ${longitude}
          `);
        
        // إعادة تعيين الإحداثيات بعد إضافة الدبوس
        this.userCoordinates.latitude = null;
        this.userCoordinates.longitude = null;
      } else {
        alert('يرجى إدخال الإحداثيات بشكل صحيح!');
      }
    },
    
    
     // 🔍 دالة البحث عن فعالية وتحديد موقعها
  searchEventByName() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      alert("يرجى إدخال اسم الفعالية!");
      return;
    }

    const foundEvent = this.events.find(event =>
      event.name && event.name.toLowerCase().includes(query) &&
      event.primary_venue && event.primary_venue.address &&
      event.primary_venue.address.latitude && event.primary_venue.address.longitude
    );

    if (foundEvent) {
      const lat = parseFloat(foundEvent.primary_venue.address.latitude);
      const lng = parseFloat(foundEvent.primary_venue.address.longitude);

      // إذا في دبوس بحث سابق، نحذفه
      if (this.searchMarker) {
        this.map.removeLayer(this.searchMarker);
      }

      const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      // نضيف الدبوس الجديد
      this.searchMarker = L.marker([lat, lng], { icon: greenIcon })
        .addTo(this.map)
        .bindPopup(`<strong>${foundEvent.name}</strong><br>${foundEvent.primary_venue.address.localized_address_display}`)
        .openPopup();

      this.map.setView([lat, lng], 15); // نحرك الخريطة للفعالية
    } else {
      alert("لم يتم العثور على فعالية بهذا الاسم.");
    }
  }
    
  },
  mounted() {
    this.initMap();
  },
  computed: {
    filteredEvents() {
  if (this.selectedCategory) {
    return this.events.filter(event => event.customCategory === this.selectedCategory);
  }
  return this.events;
}
  }
};
</script>



<style  scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Tajawal:wght@400;700&display=swap');


.container {
  text-align: center;
  font-family: 'Tajawal', sans-serif;
  background: linear-gradient(to right, #531e8d, #4e81da);
  color: white;
  padding: 20px;
  max-width:"344"; 
}

h1 {
  
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #813bac, #642397);
    padding: 20 10px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
    font-family: 'Tajawal', sans-serif;
    position: fixed;
    width: 100%;
    top: 0;
    max-width:"344"; 
    z-index: 1000;
  font-size: 26px;
  margin-bottom: 15px;
  margin-top: 140px;
}

select {
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: none;
  align-items: center;
  
}

#map {
  height: 400px;
  border-radius: 10px;
  margin-top:100px ;
  margin-bottom: 20px;
  max-width:"344";
  color: #000; 
}

.events {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 10px;
  font-family: 'Tajawal', sans-serif;
  align-items: center;
  margin-top: 8px;

  
}

ul {
  list-style: none;
  padding: 0;
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  

}

li {
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  margin: 5px 0;
  justify-self: start;
  direction: rtl;
  align-items: center;
  margin-top: 8px;
  justify-content: space-between;
  display: inline-block;  
}
.events table {  
  width: 100%; /* استخدام كامل عرض الحاوية */  
  border-collapse: collapse; /* دمج حدود الجدول */  
}  

.events th, .events td {  
  padding: 10px;  
  background: rgba(255, 255, 255, 0.2);  
  border: 1px solid rgba(255, 255, 255, 0.5); /* إضافة حدود خفيفة */  
  text-align: right; /* محاذاة النص إلى اليمين */  
}  

.events th {  
  background: rgba(255, 255, 255, 0.5); /* لون خلفية لرؤوس الأعمدة */  
  font-weight: bold; /* جعل النص أكبر */  
}  

.events tr:hover {  
  background: rgba(255, 255, 255, 0.3); /* تأثير عند التمرير */  
}

/* تنسيق المدخلات */
.coordinates-input {

text-align: center;
direction: rtl;
display: flex;
flex-direction: column;
align-items: center; /* هذا يخلي العناصر تكون بالنص أفقيًا */
justify-content: center; /* مفيد لو كانت داخل كونتينر أكبر */
}

.coordinates-input input {
  padding: 8px;
  margin: 10px 0;
  border-radius: 5px;
  border: none;
  width: 200px;
}

.coordinates-input button {
  padding: 8px 15px;
  background-color: #531e8d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Tajawal', sans-serif;

}

.coordinates-input button:hover {
  background-color: #735bac;
}
label{

  direction: rtl;
  display: grid;
}
.search-event {
  margin-top: 20px;
  direction: rtl;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-event input {
  padding: 8px;
  margin: 5px 0;
  width: 250px;
  border-radius: 5px;
  border: none;
}

.search-event button {
  padding: 6px 15px;
  background-color: #531e8d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Tajawal', sans-serif;

}

.search-event button:hover {
  background-color: #375c9e;
}



</style>
