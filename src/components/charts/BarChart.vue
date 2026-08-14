<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'

const props = defineProps({
  labels: { type: Array, required: true },
  values: { type: Array, required: true },
  label: { type: String, default: '' },
  color: { type: String, default: '#3f45b5' },
})

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      data: props.values,
      backgroundColor: props.color,
      borderRadius: 8,
      maxBarThickness: 44,
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
      grid: { color: 'rgba(148, 163, 184, 0.2)' },
      border: { display: false },
      ticks: { color: '#94a3b8' },
      beginAtZero: true,
    },
  },
}
</script>

<template>
  <Bar :data="data" :options="options" />
</template>
