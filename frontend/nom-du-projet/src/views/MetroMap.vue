<template>
    <div class="h-screen">
      <l-map :zoom="13" :center="[48.8566, 2.3522]" style="height: 100%; width: 100%;">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <l-marker
          v-for="(arret, index) in arrets"
          :key="index"
          :lat-lng="[arret.lat, arret.lng]"
        >
          <l-popup>{{ arret.nom }} ({{ arret.rue }})</l-popup>
        </l-marker>
        <l-polyline
          v-for="(itineraire, index) in itineraires"
          :key="index"
          :lat-lngs="itineraire.points"
          :color="'blue'"
        />
      </l-map>
    </div>
  </template>
  
  <script>
  import { LMap, LTileLayer, LMarker, LPopup, LPolyline } from '@vue-leaflet/vue-leaflet';
  import 'leaflet/dist/leaflet.css';
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'MetroMap',
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      LPolyline
    },
    data() {
      return {
        arrets: []
      };
    },
    computed: {
      ...mapGetters(['currentUser', 'itineraires'])
    },
    watch: {
      itineraires: {
        handler() {
          this.arrets = this.getArretsFromItineraires(this.itineraires);
        },
        immediate: true
      }
    },
    methods: {
      ...mapActions(['fetchItineraires']),
      getArretsFromItineraires(itineraires) {
        const uniqueArrets = {};
        itineraires.forEach(itineraire => {
          itineraire.points.forEach(point => {
            uniqueArrets[`${point[0]}-${point[1]}`] = { lat: point[0], lng: point[1], nom: itineraire.nom, rue: 'Unknown' }; 
          });
        });
        return Object.values(uniqueArrets);
      }
    },
    created() {
      this.fetchItineraires();
    }
  };
  </script>
  
  <style>
  /* Importing Leaflet CSS within the component’s scope */
  @import "~leaflet/dist/leaflet.css";
  
  /* Add Tailwind CSS classes or custom styles here */
  </style>