<template>
  <AppNavbarhome />
  <h2 class="text-3xl font-semibold mb-8 text-center">Plan Transport de la Ville</h2>
  <div ref="mapContainer" :class="{ 'cursor-grab': !panning, 'cursor-grabbing': panning }" class="map-container relative w-full h-full" @wheel="zoomMap" @mousedown="startPanning" @mousemove="movePanning" @mouseup="endPanning" @mouseleave="endPanning">
    <svg ref="svgElement" :viewBox="viewBox" class="w-full h-full">
      <g v-for="(rue, rueIndex) in rues" :key="rueIndex">
        <polyline :points="getPolylinePoints(rue.arrets, rueIndex)" :stroke="colors[rueIndex % colors.length]" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        <g>
          <circle v-for="(arret, index) in rue.arrets" :key="index" :cx="calculateAdjustedPosition(rueIndex, index, 'x')" :cy="calculateAdjustedPosition(rueIndex, index, 'y')" r="8" fill="white" stroke="black" stroke-width="3" @mouseover="showTooltip($event, arret.nom)" @mouseleave="hideTooltip" />
          <text v-for="(arret, index) in rue.arrets" :key="`text-${index}`" :x="calculateAdjustedPosition(rueIndex, index, 'x')" :y="calculateAdjustedPosition(rueIndex, index, 'y')" dx="10" dy="-10" font-size="18" text-anchor="start" fill="gray">
            {{ arret.nom.substring(0, 25) }}
          </text>
        </g>
        <!-- Section pour afficher les Cyclistes -->
        <g v-for="(cycliste, index) in generateCyclists(rue.arrets)" :key="index">
          <circle :cx="cycliste.x" :cy="cycliste.y" r="5" fill="blue" stroke="black" stroke-width="2" @mouseover="showTooltip($event, cycliste.nom)" @mouseleave="hideTooltip" />
          <text :x="cycliste.x" :y="cycliste.y" dx="10" dy="-10" font-size="14" text-anchor="start" fill="blue">
            {{ cycliste.nom }}
          </text>
        </g>
      </g>
    </svg>
    <div v-if="tooltip.visible" :style="{ top: tooltip.top + 'px', left: tooltip.left + 'px' }" class="tooltip px-2 py-1 bg-gray-800 text-white rounded text-sm">
      {{ tooltip.content }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AppNavbarhome from '@/components/AppNavbar.vue';

export default {
  components: {
    AppNavbarhome,
  },
  data() {
    return {
      rues: [],
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
      viewBox: '0 0 2000 2000',
      scaleFactor: 1,
      svgWidth: 2000,
      svgHeight: 2000,
      viewBoxX: 0,
      viewBoxY: 0,
      viewPortWidth: 2000,
      viewPortHeight: 2000
    };
  },
  mounted() {
    this.fetchRuesEtArrets();
    this.$nextTick(() => {
      const rect = this.$refs.svgElement.getBoundingClientRect();
      this.svgWidth = rect.width;
      this.svgHeight = rect.height;
    });
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
          coordinates: JSON.parse(arret.coordinates),
          position: arret.position
        });
        return acc;
      }, {});
      return Object.values(rues);
    },
    calculatePositionBase(coordinates, axis) {
      const gridSize = 40000;
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
        return this.calculatePositionBase({ lat: rueIndex, lon: arretIndex }, axis);
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
      const direction = event.deltaY > 0 ? -1 : 1;

      let newScale = this.scaleFactor + (direction * scaleAmount);
      newScale = Math.max(0.1, Math.min(5, newScale));

      const newWidth = this.viewPortWidth * (this.scaleFactor / newScale);
      const newHeight = this.viewPortHeight * (this.scaleFactor / newScale);

      const mouseXRatio = event.clientX / this.svgWidth;
      const mouseYRatio = event.clientY / this.svgHeight;
      this.viewBoxX += (this.viewPortWidth - newWidth) * mouseXRatio;
      this.viewBoxY += (this.viewPortHeight - newHeight) * mouseYRatio;

      this.viewPortWidth = newWidth;
      this.viewPortHeight = newHeight;
      this.scaleFactor = newScale;
      this.updateViewBox();
    },
    updateViewBox() {
      this.viewBox = `${this.viewBoxX} ${this.viewBoxY} ${this.viewPortWidth} ${this.viewPortHeight}`;
    },
    startPanning(event) {
      this.panning = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    movePanning(event) {
      if (!this.panning) return;
      const dx = (event.clientX - this.startX) * (this.viewPortWidth / this.svgWidth);
      const dy = (event.clientY - this.startY) * (this.viewPortHeight / this.svgHeight);
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.viewBoxX -= dx;
      this.viewBoxY -= dy;
      this.updateViewBox();
    },
    endPanning() {
      this.panning = false;
    },
    calculateAndSetViewBox() {
      let maxX = 0;
      let maxY = 0;
      let minX = Infinity;
      let minY = Infinity;

      this.rues.forEach((rue, rueIndex) => {
        rue.arrets.forEach((arret, arretIndex) => {
          const x = this.calculateAdjustedPosition(rueIndex, arretIndex, 'x');
          const y = this.calculateAdjustedPosition(rueIndex, arretIndex, 'y');
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
        });
      });

      const padding = 1000;
      this.viewBoxX = minX - padding;
      this.viewBoxY = minY - padding;
      this.viewPortWidth = maxX - minX + padding * 2;
      this.viewPortHeight = maxY - minY + padding * 2;
      this.updateViewBox();
    },
    showTooltip(event, content) {
      this.tooltip.visible = true;
      this.tooltip.content = content;
      this.tooltip.top = event.clientY + 10;
      this.tooltip.left = event.clientX + 10;
    },
    hideTooltip() {
      this.tooltip.visible = false;
    },
    interpolatePosition(startCoordinate, endCoordinate, ratio) {
      return {
        x: startCoordinate.x + (endCoordinate.x - startCoordinate.x) * ratio,
        y: startCoordinate.y + (endCoordinate.y - startCoordinate.y) * ratio,
      };
    },
    generateCyclists(arrets) {
      if (arrets.length < 2) {
        return [];
      }

      const cyclists = [];
      const numCyclists = 10; // Adjust the number of cyclists you want to simulate

      for (let i = 0; i < numCyclists; i++) {
        const randomIndex = Math.floor(Math.random() * (arrets.length - 1));
        const startArret = arrets[randomIndex];
        const endArret = arrets[randomIndex + 1];
        const ratio = Math.random();

        const startCoordinate = {
          x: this.calculateAdjustedPositionForCoordinates(startArret.coordinates, 'x'),
          y: this.calculateAdjustedPositionForCoordinates(startArret.coordinates, 'y')
        };
        const endCoordinate = {
          x: this.calculateAdjustedPositionForCoordinates(endArret.coordinates, 'x'),
          y: this.calculateAdjustedPositionForCoordinates(endArret.coordinates, 'y')
        };

        const position = this.interpolatePosition(startCoordinate, endCoordinate, ratio);
        cyclists.push({
          nom: `Cycliste ${i + 1}`,
          ...position
        });
      }
      return cyclists;
    },
    calculateAdjustedPositionForCoordinates(coordinates, axis) {
      return this.calculatePositionBase(coordinates, axis);
    },
  }
};
</script>

<style scoped>
html, body, #app {
  @apply h-full m-0 p-0 overflow-hidden;
}

.tooltip {
  @apply absolute bg-gray-800 text-white px-2 py-1 rounded text-xs;
  pointer-events: none;
}
</style>