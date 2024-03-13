<template>
    <div>This is the about page</div>
    <v-btn variant="outlined" @click="fetchData">Fetch data</v-btn>
  </template>
  
  <script>
  import { ref } from 'vue'
  import axios from 'axios'
  
  export default {
    setup() {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/data')
          console.log(response.data.message) 
        } catch (error) {
          console.error("There was an error fetching the data", error)
        }
      }

      return {
        fetchData,
      }
    },
  }
  </script>
  
  <style>

  
  </style>
  