// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import './custom.css'

function loadLinkedInBadge() {
  const existing = document.querySelector('script[src*="platform.linkedin.com/badges/js/profile.js"]')
  if (existing) existing.remove()
  const s = document.createElement('script')
  s.src = 'https://platform.linkedin.com/badges/js/profile.js'
  s.async = true
  document.body.appendChild(s)
}

function waitForBadgeAndLoad(retries = 20) {
  function attempt(n) {
    if (document.querySelector('.badge-base')) {
      loadLinkedInBadge()
    } else if (n > 0) {
      setTimeout(() => attempt(n - 1), 300)
    }
  }
  attempt(retries)
}

export default {
  ...DefaultTheme,
  setup() {
    const route = useRoute()

    onMounted(waitForBadgeAndLoad)

    watch(
      () => route.path,
      () => waitForBadgeAndLoad()
    )
  }
}
