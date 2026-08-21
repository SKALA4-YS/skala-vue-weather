import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/* ════════════════════════════════════════════════
   [요구사항 4] 본인만의 추가 Store — 즐겨찾기 도시

   configStore는 교재 표에 맞춰 Options 스타일로 썼고,
   이 스토어는 같은 일을 setup 스타일로 써서 두 방식을 비교할 수 있게 했다.

   | Options 스타일        | setup 스타일                  |
   | state: () => ({ ... })| ref()                         |
   | getters: { ... }      | computed()                    |
   | actions: { ... }      | 그냥 함수                     |

   setup 스타일은 <script setup>에서 쓰던 문법을 그대로 쓴다는 것이 장점이다.
   대신 마지막에 return으로 **밖에 공개할 것들을 직접 골라 내보내야** 한다.
   return에 빠뜨린 값은 스토어 밖에서 접근할 수 없다.
   ════════════════════════════════════════════════ */

export const useFavoriteStore = defineStore('favorite', () => {
  /* ── state ─────────────────────────────────── */

  // 즐겨찾기한 도시 id 목록. 새로고침해도 유지되도록 localStorage에서 읽어 온다.
  const readSaved = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('weather-favorites'))
      return Array.isArray(saved) ? saved : []
    } catch {
      // 저장된 값이 깨져 있어도 앱이 죽지 않도록 빈 목록으로 시작한다.
      return []
    }
  }

  const favoriteIds = ref(readSaved())

  // 목록을 즐겨찾기한 것만 보여줄지 여부
  const showOnlyFavorite = ref(false)

  /* ── getters ───────────────────────────────── */

  const favoriteCount = computed(() => favoriteIds.value.length)

  const hasFavorite = computed(() => favoriteIds.value.length > 0)

  /*
    '인자를 받는 getter'는 computed로 만들 수 없다. computed는 값 하나를 캐싱하는 것이라
    도시마다 다른 답을 줄 수 없기 때문이다. 이럴 때는 그냥 함수로 내보낸다.
    (Options 스타일에서 getter가 함수를 반환하게 만드는 것과 같은 이야기다.)
  */
  const isFavorite = (cityId) => favoriteIds.value.includes(cityId)

  /* ── actions ───────────────────────────────── */

  const save = () => {
    localStorage.setItem('weather-favorites', JSON.stringify(favoriteIds.value))
  }

  const toggleFavorite = (cityId) => {
    if (isFavorite(cityId)) {
      favoriteIds.value = favoriteIds.value.filter((id) => id !== cityId)
    } else {
      favoriteIds.value = [...favoriteIds.value, cityId]
    }

    console.log(`⭐ [favoriteStore] 즐겨찾기 ${favoriteCount.value}곳:`, favoriteIds.value)
    save()
  }

  const toggleShowOnlyFavorite = () => {
    showOnlyFavorite.value = !showOnlyFavorite.value
  }

  const clearFavorites = () => {
    favoriteIds.value = []
    showOnlyFavorite.value = false
    save()
  }

  // 여기 적은 것만 스토어 밖에서 쓸 수 있다. save()는 내부용이라 일부러 뺐다.
  return {
    favoriteIds,
    showOnlyFavorite,
    favoriteCount,
    hasFavorite,
    isFavorite,
    toggleFavorite,
    toggleShowOnlyFavorite,
    clearFavorites,
  }
})
