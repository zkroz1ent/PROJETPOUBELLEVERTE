<template>
  <div>
    <AppNavbar />
    
      <h2 class="text-3xl font-semibold mb-8 text-center">Plan Transport de la Ville</h2>
      <div ref="mapContainer" class="map-container relative overflow-hidden cursor-grab" @wheel="zoomMap"
           @mousedown="startPanning" @mousemove="movePanning" @mouseup="endPanning" @mouseleave="endPanning">
        <svg xmlns="http://www.w3.org/2000/svg" :style="{ transform: mapTransform }" :viewBox="viewBox">
          <g v-for="(rue, rueIndex) in rues" :key="rueIndex">
            <polyline :points="getPolylinePoints(rue.arrets, rueIndex)" :stroke="colors[rueIndex % colors.length]"
                      stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            <g>
              <circle v-for="(arret, index) in rue.arrets" :key="index"
                      :cx="calculateAdjustedPosition(rueIndex, index, 'x')"
                      :cy="calculateAdjustedPosition(rueIndex, index, 'y')" r="8" fill="white" stroke="black"
                      stroke-width="2" @mouseover="showTooltip($event, arret.nom)" @mouseleave="hideTooltip" />
              <text v-for="(arret, index) in rue.arrets" :key="`text-${index}`"
                    :x="calculateAdjustedPosition(rueIndex, index, 'x')" :y="calculateAdjustedPosition(rueIndex, index, 'y')"
                    dx="10" dy="-10" font-size="8" text-anchor="start" fill="gray">
                {{ arret.nom.substring(0, 5) }}
              </text>
            </g>
          </g>
        </svg>
        <div v-if="tooltip.visible" :style="{ top: tooltip.top + 'px', left: tooltip.left + 'px' }" class="tooltip">
          {{ tooltip.content }}
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
      mapTransform: 'scale(1)',
      panning: false,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
      tooltip: {
        visible: false,
        content: '',
        top: 0,
        left: 0
      },
      colors: ['#FF6347', '#008080', '#FFD700', '#800080', '#4682B4', '#ADFF2F', '#FF69B4', '#CD5C5C', '#4B0082', '#FF4500'],
      viewBox: '0 0 1000 700' // Adjust initial viewBox for a better fit
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
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch rues et arrets: ${response.statusText}`);
        }

        const data = response.data;
        this.rues = this.formatData(data);
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
          coordinates: JSON.parse(arret.coordinates),  // Parse coordinates JSON string
          position: arret.position
        });
        return acc;
      }, {});
      return Object.values(rues);
    },
    calculatePositionBase(coordinates, axis) {
      const gridSize = 10000; // Base grid size adjusted for large plan
      const offsetX = 0;
      const offsetY = 0;

      const latNorm = (coordinates.lat - 48.82) * gridSize;
      const lonNorm = (coordinates.lon - 2.26) * gridSize;

      return (axis === 'y') ? latNorm + offsetY : lonNorm + offsetX;
    },
    calculateAdjustedPosition(rueIndex, arretIndex, axis) {
      const arret = this.rues[rueIndex].arrets[arretIndex];
      const coordinates = arret.coordinates;

      if (coordinates) {
        return this.calculatePositionBase(coordinates, axis);
      } else {
        return this.calculatePositionBase({ lat: rueIndex, lon: arretIndex }, axis); // If no coordinates, fallback to this
      }
    },
    getPolylinePoints(arrets, rueIndex) {
      return arrets.map((arret, index) =>
        `${this.calculateAdjustedPosition(rueIndex, index, 'x')},${this.calculateAdjustedPosition(rueIndex, index, 'y')}`
      ).join(' ');
    },
    zoomMap(event) {
      event.preventDefault();
      const scaleAmount = 0.1;
      const scaleFactor = event.deltaY < 0 ? 1 - scaleAmount : 1 + scaleAmount;
      const [x, y, width, height] = this.viewBox.split(' ').map(Number);
      const newWidth = width * scaleFactor;
      const newHeight = height * scaleFactor;

      this.viewBox = `${x} ${y} ${newWidth} ${newHeight}`;
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
      this.mapTransform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(1)`;
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
    showTooltip(event, content) {
      this.tooltip.visible = true;
      this.tooltip.content = content;
      this.tooltip.top = event.clientY + 10;
      this.tooltip.left = event.clientX + 10;
    },
    hideTooltip() {
      this.tooltip.visible = false;
    }
  }
};
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

svg {
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: calc(100vh - 60px); /* Adjust height based on header */
  position: relative;
  background: #e5e5e5;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

.polyline {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.circle {
  fill: white;
  stroke: black;
  stroke-width: 3;
}

.text {
  font-size: 4px;
  fill: gray;
}

.tooltip {
  position: absolute;
  background: #333;
  color: white;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
}
</style>