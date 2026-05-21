// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './custom.css'

export default {
  ...DefaultTheme,
  setup() {
    const route = useRoute()

    function reloadLinkedInBadge() {
      const holder = document.querySelector('.badge-base')
      if (!holder) return
      const existing = document.querySelector('script[src*="platform.linkedin.com/badges/js/profile.js"]')
      if (existing) existing.remove()
      const s = document.createElement('script')
      s.src = 'https://platform.linkedin.com/badges/js/profile.js'
      s.async = true
      s.defer = true
      document.body.appendChild(s)
    }

    onMounted(reloadLinkedInBadge)

    watch(
      () => route.path,
      () => nextTick(reloadLinkedInBadge)
    )
  }
}
