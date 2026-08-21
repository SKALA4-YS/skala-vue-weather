<script setup>
import { computed } from 'vue'
import DustBadge from './DustBadge.vue'

// 부모에게서 도시 하나의 날씨 데이터를 통째로 받는다.
// selected는 과제 2에서 추가한 props다. 과제 1은 넘기지 않으므로 기본값 false가 쓰인다.
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

// [요구사항 4] 상세보기 버튼 전용 동작.
// 템플릿에서 .stop을 붙여 카드 클릭까지 번지지 않게 막는다.
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// [요구사항 5] 기온, 강수확률, 미세먼지, 습도를 조합해 외출 준비물을 추천한다.
// 과제 2에서 일반 함수 → computed로 바꿨다. props.city가 그대로면 이전 결과를 재사용한다.
const outfitTips = computed(() => {
  const city = props.city
  const tips = []

  if (city.rainProb >= 50) tips.push('우산')
  if (city.pm10 > 80) tips.push('마스크')
  if (city.temp < 25) tips.push('겉옷')
  if (city.humidity >= 80) tips.push('제습기')
  if (tips.length === 0) tips.push('따로 챙길 것 없음')

  return tips
})

// 선택된 카드에만 강조 클래스를 붙인다. (과제 2)
const cardClass = computed(() => (props.selected ? 'card-selected' : ''))
</script>

<template>
  <div class="card" :class="cardClass">
    <!--
      이 div가 유일한 루트 엘리먼트라서, 부모가 <WeatherCard @click="..." />로 건 리스너는
      여기로 그대로 전달된다. 따로 이벤트를 올려보내는 코드가 필요 없다.
    -->
    <div class="card-body">
      <p class="card-title">{{ city.name }} ({{ city.status }})</p>
      <p>현재 기온: {{ city.temp }}°C</p>

      <!-- [요구사항 2] 기온 25도를 기준으로 라벨을 다르게 붙인다. -->
      <span v-if="city.temp >= 25" class="badge badge-hot">🔥 더움 (25도 이상)</span>
      <span v-else class="badge badge-cool">❄ 선선함 (25도 미만)</span>

      <!-- [요구사항 5] 미세먼지 등급은 자식 컴포넌트에 농도만 넘겨서 처리한다. -->
      <DustBadge :pm10="city.pm10" />

      <p class="card-sub">습도 {{ city.humidity }}% · 강수확률 {{ city.rainProb }}%</p>

      <p class="card-sub">
        준비물:
        <span v-for="(tip, index) in outfitTips" :key="index" class="tip">{{ tip }}</span>
      </p>
    </div>

    <!-- [요구사항 4] .stop이 없으면 alert 후 부모 카드의 클릭 이벤트까지 실행된다. -->
    <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">상세보기</button>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  padding: 12px 14px;
  background-color: #fff;
  border: 1px solid #e3e8ef;
  border-radius: 6px;
  cursor: pointer;
}

.card:hover {
  border-color: #7aa7e9;
  background-color: #fbfdff;
}

/* 과제 2: 상태바에 표시 중인(선택된) 도시 강조 */
.card-selected {
  border-color: #2f6bd8;
  background-color: #f2f7ff;
  box-shadow: inset 3px 0 0 #2f6bd8;
}

.card:last-child {
  margin-bottom: 0;
}

.card-body p {
  margin: 0 0 4px;
}

.card-title {
  font-weight: bold;
}

.card-sub {
  margin-top: 6px;
  color: #667;
  font-size: 13px;
}

.badge {
  display: inline-block;
  margin: 4px 4px 0 0;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: #fff;
}

.badge-hot {
  background-color: #e8590c;
}

.badge-cool {
  background-color: #1c7ed6;
}

.tip {
  display: inline-block;
  margin-left: 4px;
  padding: 1px 7px;
  background-color: #eef2f7;
  border-radius: 10px;
  font-size: 12px;
  color: #445;
}

.detail-btn {
  flex-shrink: 0;
  padding: 5px 10px;
  background-color: #fff;
  border: 1px solid #b9c3d4;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.detail-btn:hover {
  background-color: #eef2f7;
}
</style>
