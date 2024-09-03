import { definePreset } from "@primevue/themes"
import Aura from '@primevue/themes/aura'

const VisualiTheme = definePreset(Aura, {
  components: {
    splitter: {
      gutter: {
        background: '{transparent}'
      }
    },
  },
})

const PrimeVueOptions = {
  theme: {
    preset: VisualiTheme,
    options: {
      darkModeSelector: '.dark-mode',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  },
  pt: {
    dialog: {
      header: {
        class: 'select-none'
      }
    },
    fieldset: {
      legend: {
        class: 'select-none'
      }
    },
    card: {
      header: {
        class: 'select-none'
      }
    },
  }
}

export { VisualiTheme, PrimeVueOptions }