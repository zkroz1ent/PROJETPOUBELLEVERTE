<template>
  <div>
    <AppNavbar />
    <div class="container mx-auto my-8 bg-white rounded shadow-md min-h-screen p-4 relative overflow-hidden">
      <h2 class="text-3xl font-semibold mb-8 text-center">Plan Transport de la Ville</h2>

      <div
        ref="mapContainer"
        class="map-container relative overflow-hidden cursor-grab"
        @wheel="zoomMap"
        @mousedown="startPanning"
        @mousemove="movePanning"
        @mouseup="endPanning"
      >
        <svg xmlns="http://www.w3.org/2000/svg" :style="{ transform: mapTransform }" :viewBox="viewBox">
          <g v-for="(rue, rueIndex) in rues" :key="rueIndex">
            <polyline
              :points="getPolylinePoints(rue.arrets, rueIndex)"
              :stroke="colors[rueIndex % colors.length]"
              stroke-width="4"
              fill="none"
            />
            <g>
              <circle
                v-for="(arret, index) in rue.arrets"
                :key="index"
                :cx="calculateAdjustedPosition(rueIndex, index, 'x')"
                :cy="calculateAdjustedPosition(rueIndex, index, 'y')"
                r="5"
                fill="white"
                stroke="black"
                stroke-width="1"
              />
              <text
                v-for="(arret, index) in rue.arrets"
                :key="`text-${index}`"
                :x="calculateAdjustedPosition(rueIndex, index, 'x')"
                :y="calculateAdjustedPosition(rueIndex, index, 'y')"
                dx="6"
                dy="-6"
                font-size="10"
                text-anchor="start"
                fill="black"
              >
                {{ arret.nom }}
              </text>
            </g>
          </g>

          <path
            v-for="(path, index) in intersectionPaths"
            :key="index"
            :d="path"
            fill="none"
            stroke="black"
            stroke-width="1"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AppNavbar from '@/components/AppNavbar.vue';

export default {
  components: {
    AppNavbar
  },
  data() {
    return {
      rues: [],
      intersectionPaths: [],
      intersections: {},
      mapTransform: 'scale(1)',
      panning: false,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
      colors: ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'],
      viewBox: '0 0 2000 1500' // Define initial viewBox size
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

        const data = response.data;
        this.rues = this.formatData(data);
        this.calculateIntersections();
        this.calculateIntersectionPaths();
        this.calculateAndSetViewBox();
      } catch (error) {
        console.error('Error fetching rues et arrets:', error);
      }
    },
    formatData(data) {
      const rues = data.reduce((acc, arret) => {
        if (!acc[arret.rueId]) {
          acc[arret.rueId] = {
            name: arret.nomRue,
            arrets: []
          };
        }
        acc[arret.rueId].arrets.push({
          id: arret.id,
          nom: arret.nom,
          position: arret.position
        });
        return acc;
      }, {});

      return Object.values(rues);
    },
    calculatePositionBase(rueIndex, arretIndex, axis) {
      const gridSize = 100; // Standard grid size
      const offset = 50; // Standard offset
      return (axis === 'x')
        ? (arretIndex * gridSize) + offset
        : (rueIndex * gridSize) + offset;
    },
    calculateAdjustedPosition(rueIndex, arretIndex, axis) {
      const arret = this.rues[rueIndex].arrets[arretIndex];
      const intersection = this.intersections[arret.nom];

      if (intersection) {
        return axis === 'x' ? intersection.x : intersection.y;
      } else {
        return this.calculatePositionBase(rueIndex, arretIndex, axis);
      }
    },
    getPolylinePoints(arrets, rueIndex) {
      return arrets.map((arret, index) => `${this.calculateAdjustedPosition(rueIndex, index, 'x')},${this.calculateAdjustedPosition(rueIndex, index, 'y')}`).join(' ');
    },
    calculateIntersections() {
      const arretMap = {};

      this.rues.forEach((rue, rueIndex) => {
        rue.arrets.forEach((arret, arretIndex) => {
          if (!arretMap[arret.nom]) {
            arretMap[arret.nom] = [];
          }
          arretMap[arret.nom].push({ rueIndex, arretIndex });
        });
      });

      this.intersections = {};
      Object.keys(arretMap).forEach(nom => {
        if (arretMap[nom].length > 1) {
          const x = arretMap[nom].reduce((sum, point) => sum + this.calculatePositionBase(point.rueIndex, point.arretIndex, 'x'), 0) / arretMap[nom].length;
          const y = arretMap[nom].reduce((sum, point) => sum + this.calculatePositionBase(point.rueIndex, point.arretIndex, 'y'), 0) / arretMap[nom].length;
          this.intersections[nom] = { x, y };
        }
      });
    },
    calculateIntersectionPaths() {
      const arretMap = {};

      this.rues.forEach(rue => {
        rue.arrets.forEach(arret => {
          if (!arretMap[arret.nom]) {
            arretMap[arret.nom] = [];
          }
          arretMap[arret.nom].push(arret);
        });
      });

      this.intersectionPaths = [];
      Object.values(arretMap).forEach(points => {
        if (points.length > 1) {
          for (let i = 0; i < points.length - 1; i++) {
            for (let j = i + 1; j < points.length; j++) {
              const pathString = this.getPathString(points[i], points[j]);
              if (pathString) this.intersectionPaths.push(pathString);
            }
          }
        }
      });
    },
    getPathString(point1, point2) {
      const x1 = this.calculateAdjustedPosition(point1.rueIndex, point1.arretIndex, 'x');
      const y1 = this.calculateAdjustedPosition(point1.rueIndex, point1.arretIndex, 'y');
      const x2 = this.calculateAdjustedPosition(point2.rueIndex, point2.arretIndex, 'x');
      const y2 = this.calculateAdjustedPosition(point2.rueIndex, point2.arretIndex, 'y');
      return `M${x1} ${y1} L${x2} ${y2}`;
    },
    zoomMap(event) {
      const scaleDelta = 0.1;
      const [x, y, width, height] = this.viewBox.split(' ').map(Number);
      if (event.deltaY < 0) {
        this.viewBox = this.calculateZoom(scaleDelta, [x, y, width, height]);
      } else {
        this.viewBox = this.calculateZoom(-scaleDelta, [x, y, width, height]);
      }
    },
    calculateZoom(delta, viewBoxValues) {
      const [x, y, width, height] = viewBoxValues;
      const newWidth = Math.max(width + delta * 400, 400);
      const newHeight = Math.max(height + delta * 300, 300);
      return `${x} ${y} ${newWidth} ${newHeight}`;
    },
    startPanning(event) {
      this.panning = true;
      this.startX = event.clientX - this.offsetX;
      this.startY = event.clientY - this.offsetY;
    },
    movePanning(event) {
      if (!this.panning) return;
      this.offsetX = event.clientX - this.startX;
      this.offsetY = event.clientY - this.startY;
      this.$refs.mapContainer.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) ${this.mapTransform}`;
    },
    endPanning() {
      this.panning = false;
    },
    calculateAndSetViewBox() {
      let maxX = 0;
      let maxY = 0;

      this.rues.forEach((rue, rueIndex) => {
        rue.arrets.forEach((arret, arretIndex) => {
          const x = this.calculateAdjustedPosition(rueIndex, arretIndex, 'x');
          const y = this.calculateAdjustedPosition(rueIndex, arretIndex, 'y');

          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        });
      });

      this.viewBox = `0 0 ${maxX + 100} ${maxY + 100}`;
    },
  }
};
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
.map-container {
  position: relative;
  transition: transform 0.3s ease;
}
.cursor-grab {
  cursor: grab;
}
.cursor-grabbing {
  cursor: grabbing;
}
</style>