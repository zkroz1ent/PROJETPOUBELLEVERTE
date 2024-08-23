<template>
  <div>
    <AppNavbarhome />
    <h2 class="text-3xl font-semibold mb-8 text-center">Plan Transport de la Ville</h2>
    <div ref="mapContainer" :class="{ 'cursor-grab': !panning, 'cursor-grabbing': panning }"
      class="map-container relative w-full h-full" @wheel="zoomMap" @mousedown="startPanning" @mousemove="movePanning"
      @mouseup="endPanning" @mouseleave="endPanning">
      <svg ref="svgElement" :viewBox="viewBox" class="w-full h-full">
        <g v-for="(rue, rueIndex) in rues" :key="rueIndex">
          <polyline :points="getPolylinePoints(rue.arrets, rueIndex)" :stroke="colors[rueIndex % colors.length]"
            stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          <g>
            <circle v-for="(arret, index) in rue.arrets" :key="index"
              :cx="calculateAdjustedPosition(rueIndex, index, 'x')"
              :cy="calculateAdjustedPosition(rueIndex, index, 'y')" r="8" fill="white" stroke="black" stroke-width="3"
              @mouseover="showTooltip($event, arret.nom)" @mouseleave="hideTooltip" />
            <text v-for="(arret, index) in rue.arrets" :key="`text-${index}`"
              :x="calculateAdjustedPosition(rueIndex, index, 'x')" :y="calculateAdjustedPosition(rueIndex, index, 'y')"
              dx="10" dy="-10" font-size="18" text-anchor="start" fill="gray">
              {{ arret.nom.substring(0, 25) }}
            </text>
          </g>

          <!-- Section pour afficher un seul Cycliste -->
          <g v-if="velo">
            <svg :x="velo.x - 12" :y="velo.y - 12" width="24" height="24" viewBox="0 0 24 24"
              @mouseover="showTooltip($event, velo.nom)" @mouseleave="hideTooltip">
              <circle cx="12" cy="12" r="10" fill="blue" stroke="black" stroke-width="2" />
              <polygon points="12,2 15,10 12,12 9,10" fill="white" />
            </svg>
            <text :x="velo.x" :y="velo.y" dx="10" dy="-10" font-size="14" text-anchor="start" fill="blue">
              {{ velo.nom }}
            </text>
          </g>
        </g>
      </svg>
      <div v-if="tooltip.visible" :style="{ top: tooltip.top + 'px', left: tooltip.left + 'px' }"
        class="tooltip px-2 py-1 bg-gray-800 text-white rounded text-sm">
        {{ tooltip.content }}
      </div>
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
      veloId: null,
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
      viewPortHeight: 2000,
      velo: null
    };
  },
  mounted() {
    this.fetchRuesEtArrets();
    this.fetchVeloCoordinates();
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
    async fetchVeloCoordinates() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        let user = localStorage.getItem('user');
        user = JSON.parse(user);
        const userId = user.user.cyclisteID;
        console.log(userId);
        await axios.get('http://localhost:3000/trajets/cyclistes/' + userId + '/trajets')
          .then(response => {
            console.log("responseresponseresponseresponseresponseresponseresponseresponseresponse");
            console.log(response.data[0].veloId);
            this.params = {
              departId: response.data[0].DepartArret.id,
              arriveeId: response.data[0].ArriveeArret.id,
              veloId: response.data[0].veloId,
              cyclisteId: userId,
              isWinter: false,
            };
            this.veloId = response.data[0].veloId
          })
          .catch(error => {
            console.error('Erreur lors de la vérification des trajets:', error);
          });
        const response = await axios.get(`http://localhost:3000/velos/${this.veloId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("responseresponseresponseresponseresponse");
        console.log(response.data);

        if (response.status !== 200) {
          throw new Error(`Failed to fetch velo coordinates: ${response.statusText}`);
        }

        const veloData = response.data;
        this.velo = {
          id: veloData.id,
          nom: `Vélo ${veloData.id}`,
          x: this.calculatePositionBase({ lat: veloData.derniere_position_lat, lon: veloData.derniere_position_lon }, 'x'),
          y: this.calculatePositionBase({ lat: veloData.derniere_position_lat, lon: veloData.derniere_position_lon }, 'y')
        };
      } catch (error) {
        console.error('Error fetching velo coordinates:', error);
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
    }
  }
};
</script>