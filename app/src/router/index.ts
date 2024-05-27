import { createRouter, createWebHistory } from 'vue-router'
import EditorView from '@/views/EditorView.vue'
import AboutPage from '@/views/AboutPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: EditorView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    }
  ]
})

export default router
