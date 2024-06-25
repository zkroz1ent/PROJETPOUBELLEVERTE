<template>
  <div class="journey-map bg-gray-100 p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">{{ itinerary.name }}</h2>
    <div v-if="itinerary && itinerary.points && itinerary.points.length"
      class="line w-full h-2 bg-gray-900 relative mb-6">
      <div v-for="point in itinerary.points" :key="point.id" :class="getMarkerClass(point)"
        :style="{ left: `${(point.position / totalDistance) * 100}%` }" class="marker">
        <span class="tooltip">{{ point.name }}</span>
      </div>
      <div class="position-marker bg-blue-600 h-4 w-4 rounded-full absolute top-0 transform -translate-x-1/2"
        :style="{ left: `${(currentPosition / totalDistance) * 100}%` }"></div>
    </div>
    <p v-else>Aucun point de passage disponible.</p>
    <button @click="moveForward" class="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Move
      Forward</button>
  </div>
</template>

<script>
export default {
  props: {
    itinerary: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentPosition: 0  // Position de départ
    };
  },
  computed: {
    totalDistance() {
      if (this.itinerary && this.itinerary.points && this.itinerary.points.length) {
        return this.itinerary.points.reduce((acc, point) => acc + point.distance, 0);
      }
      return 0;
    }
  },
  methods: {
    moveForward() {
      // Avancer de distance fixe ou au prochain point
      const nextPosition = this.currentPosition + 1;
      if (nextPosition <= this.totalDistance) {
        this.currentPosition = nextPosition;
      }
    },
    getMarkerClass(point) {
      console.log(point);
      return {
        'marker bg-red-500 h-4 w-4 rounded-full absolute transform -translate-x-1/2': true
      };
    }
  }
};
</script>

<style scoped>
.journey-map {
  position: relative;
  padding: 1rem;
}

.line {
  position: relative;
  height: 2px;
  background-color: #333;
}

.marker {
  position: absolute;
  bottom: -8px;
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