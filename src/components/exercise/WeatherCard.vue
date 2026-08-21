<script setup>
import { computed } from 'vue'
import { Star, StarFilled } from '@element-plus/icons-vue'
import { useDisplayTemp } from '../../composables/useDisplayTemp'
import { useFavoriteStore } from '../../stores/favoriteStore'
import { calcRunningIndex } from '../../composables/useRunningIndex'
import { iconUrl } from '../../services/weatherApi'

/* [3일차 요구사항 4]
   - 지역 객체를 props로 받아 표시하고
   - 카드 선택(select-card)과 상세보기(click-detail)를 부모에게 emit 한다.

   지역이 30개로 늘어 그리드에 들어가는 세로 카드로 바꿨다. */

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const handleSelect = () => {
  emit('select-card', props.city)
}

// .stop이 없으면 버튼 클릭이 카드로 번져 select-card까지 함께 발생한다
const handleDetail = () => {
  emit('click-detail', props.city)
}

const { displayTempText } = useDisplayTemp(() => props.city.temp)

const favoriteStore = useFavoriteStore()

const handleToggleFavorite = () => {
  favoriteStore.toggleFavorite(props.city.id)
}

const runningIndex = computed(() =>
  calcRunningIndex({
    temp: props.city.temp,
    humidity: props.city.humidity,
    pm10: props.city.pm10,
    wind: props.city.wind,
    rainProb: props.city.rainProb,
  }),
)

const scoreColor = computed(() => {
  const score = runningIndex.value.score
  if (score >= 70) return 'var(--accent)'
  if (score >= 55) return 'var(--cyan)'
  if (score >= 40) return 'var(--warn)'
  return 'var(--danger)'
})

// 1일차부터 있던 준비물 추천. 챙길 게 있을 때만 보여 준다
const outfitTips = computed(() => {
  const city = props.city
  const tips = []

  if (city.rainProb >= 50) tips.push('우산')
  if (city.pm10 > 80) tips.push('마스크')
  if (city.temp < 25) tips.push('겉옷')
  if (city.humidity >= 80) tips.push('제습기')

  return tips
})
</script>

<template>
  <div class="card" :class="selected ? 'is-selected' : ''" @click="handleSelect">
    <div class="head">
      <div>
        <p class="name">{{ city.name }}</p>
        <p class="area">{{ city.area }}</p>
      </div>

      <el-button
        :icon="favoriteStore.isFavorite(city.id) ? StarFilled : Star"
        :class="favoriteStore.isFavorite(city.id) ? 'fav-on' : ''"
        circle
        size="small"
        text
        @click.stop="handleToggleFavorite"
      />
    </div>

    <div class="mid">
      <img
        v-if="city.icon"
        class="icon"
        :src="iconUrl(city.icon)"
        :alt="city.status"
        width="52"
        height="52"
      />
      <div>
        <p class="temp num">{{ displayTempText }}</p>
        <p class="status">{{ city.status }}</p>
      </div>
    </div>

    <p class="sub num">습도 {{ city.humidity }}% · 강수 {{ city.rainProb }}% · 미세 {{ city.pm10 }}</p>

    <p v-if="outfitTips.length > 0" class="tips">
      <span v-for="tip in outfitTips" :key="tip" class="tip">{{ tip }}</span>
    </p>

    <div class="foot">
      <span class="score num" :style="{ color: scoreColor }">
        {{ runningIndex.score }}<span class="grade">{{ runningIndex.grade.label }}</span>
      </span>
      <el-button size="small" text class="detail" @click.stop="handleDetail">상세</el-button>
    </div>
  </div>
</template>

<style scoped>
/* [3일차 요구사항 5] 카드 디자인은 이 파일 안에서만 유효하다 */
.card {
  display: flex;
  flex-direction: column;
  padding: 14px;
  background-color: var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    transform 0.15s ease;
}

.card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.is-selected {
  border-color: var(--accent);
  box-shadow: inset 0 0 0 1px var(--accent);
}

.card p {
  margin: 0;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.name {
  font-size: 15px;
  font-weight: 700;
}

.area {
  color: var(--text-faint);
  font-size: 10.5px;
}

.mid {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 2px 0 6px;
}

.icon {
  flex-shrink: 0;
}

.temp {
  font-size: 26px;
  font-weight: 800;
  line-height: 1.1;
}

.status {
  color: var(--text-dim);
  font-size: 11.5px;
}

.sub {
  color: var(--text-dim);
  font-size: 11px;
}

.tips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px !important;
}

.tip {
  padding: 1px 7px;
  background-color: var(--surface-2);
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 10.5px;
}

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
}

.score {
  font-size: 17px;
  font-weight: 800;
}

.grade {
  margin-left: 5px;
  color: var(--text-faint);
  font-size: 10.5px;
  font-weight: 400;
}

.detail {
  font-size: 11.5px;
}

.fav-on {
  color: var(--warn);
}
</style>
