<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
})

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      borderColor: '#3f45b5',
      backgroundColor: 'rgba(63, 69, 181, 0.12)',
      pointBackgroundColor: '#3f45b5',
      pointRadius: 4,
      tension: 0.35,
      fill: true,
    },
  ],
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { color: '#94a3b8' } },
    y: {
      grid: { color: '#f1f5f9' },
      border: { display: false },
      ticks: { color: '#94a3b8' },
      beginAtZero: true,
    },
  },
}
</script>

<template>
  <Line :data="data" :options="options" />
</template>
