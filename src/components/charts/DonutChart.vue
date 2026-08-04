<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  colors: { type: Array, required: true },
})

const data = computed(() => ({
  labels: props.labels,
  datasets: [{ data: props.values, backgroundColor: props.colors, borderWidth: 0, spacing: 4 }],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  plugins: { legend: { display: false } },
}
</script>

<template>
  <Doughnut :data="data" :options="options" />
</template>
