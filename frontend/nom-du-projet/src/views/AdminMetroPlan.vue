<template>
    <div>
      <AppNavbar />
      <div class="container mx-auto my-8 bg-white rounded shadow-md min-h-screen p-4">
        <h2 class="text-3xl font-semibold mb-8 text-center">Plan Métro des Arrêts</h2>
  
        <!-- Afficher chaque rue avec une couleur différente -->
        <div v-for="(rue, rueIndex) in rues" :key="rueIndex" class="relative mb-10 flex items-center">
          <div class="relative h-6 w-full" :class="getLineColorClass(rueIndex)">
            <div
              v-for="(arret, index) in rue.arrets"
              :key="arret.id"
              class="marker relative flex justify-center items-center rounded-full text-white"
              :style="{ left: `${(index / (rue.arrets.length - 1)) * 100}%` }"
            >
              <span class="tooltip absolute bottom-full mb-2 p-2 rounded-md shadow-md bg-gray-700 text-white text-xs" :style="{ transform: 'translateX(-50%)' }">
                {{ arret.nom }}
              </span>
            </div>
          </div>
        </div>
  
        <!-- Lignes pour les intersections -->
        <svg class="absolute top-0 left-0 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path v-for="(path, index) in intersectionPaths" :key="index"
                :d="path"
                fill="none" stroke="#3490dc" stroke-width="2"
          />
        </svg>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    components: {
      AppNavbar: () => import('@/components/AppNavbar.vue')
    },
    data() {
      return {
        rues: [],
        intersectionPaths: []
      };
    },
    mounted() {
      this.fetchRuesEtArrets();
    },
    methods: {
      async fetchRuesEtArrets() {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
  
          const response = await axios.get('http://localhost:3000/arrets', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          if (response.status !== 200) {
            throw new Error(`Failed to fetch rues et arrets: ${response.statusText}`);
          }
  
          this.rues = this.formatData(response.data);
          this.calculateIntersectionPaths();
        } catch (error) {
          console.error('Error fetching rues et arrets:', error);
        }
      },
      formatData(data) {
        const rues = {};
        data.forEach(arret => {
          if (!rues[arret.rueId]) {
            rues[arret.rueId] = {
              name: arret.nomRue,
              arrets: []
            };
          }
          rues[arret.rueId].arrets.push({
            id: arret.id,
            nom: arret.nom,
            position: arret.position
          });
        });
        return Object.values(rues);
      },
      calculateIntersectionPaths() {
        const arretMap = {};
        this.rues.forEach((rue, rueIndex) => {
          rue.arrets.forEach((arret, arretIndex) => {
            if (!arretMap[arret.nom]) {
              arretMap[arret.nom] = [];
            }
            arretMap[arret.nom].push({ rueIndex, arretIndex });
          });
        });
  
        this.intersectionPaths = [];
        Object.values(arretMap).forEach(points => {
          if (points.length > 1) {
            for (let i = 0; i < points.length - 1; i++) {
              for (let j = i + 1; j < points.length; j++) {
                this.intersectionPaths.push(this.getPathString(points[i], points[j]));
              }
            }
          }
        });
      },
      getPathString(point1, point2) {
        const x1 = (point1.arretIndex / (this.rues[point1.rueIndex].arrets.length - 1)) * 100;
        const y1 = (point1.rueIndex * 50) + 25; // Ajuster ici pour espacer les lignes verticalement
        const x2 = (point2.arretIndex / (this.rues[point2.rueIndex].arrets.length - 1)) * 100;
        const y2 = (point2.rueIndex * 50) + 25; // Même ici
        return `M${x1} ${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`;  // Utiliser une courbe de Bézier pour une ligne plus fluide
      },
      getLineColorClass(rueIndex) {
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-800'];
        return colors[rueIndex % colors.length];
      },
      getMarkerClass(rueIndex) {
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-800'];
        return `h-4 w-4 absolute transform -translate-x-1/2 ${colors[rueIndex % colors.length]}`;
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  .marker {
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
  }
  .marker .tooltip {
    position: absolute;
    bottom: 150%;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 8px;
    background: #333;
    color: white;
    border-radius: 4px;
    font-size: 0.875rem;
    white-space: nowrap;
  }
  </style>