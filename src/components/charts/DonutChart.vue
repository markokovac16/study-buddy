<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { osnovne } from './options'
import { satiIMinute } from '../../utils/format'

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
  ...osnovne,
  cutout: '72%',
  plugins: {
    ...osnovne.plugins,
    tooltip: {
      callbacks: {
        label: (kontekst) => {
          const ukupno = kontekst.dataset.data.reduce((zbroj, minuta) => zbroj + minuta, 0)
          const postotak = ukupno ? Math.round((kontekst.parsed / ukupno) * 100) : 0
          return ` ${kontekst.label}: ${satiIMinute(kontekst.parsed)} (${postotak}%)`
        },
      },
    },
  },
}
</script>

<template>
  <Doughnut :data="data" :options="options" />
</template>
