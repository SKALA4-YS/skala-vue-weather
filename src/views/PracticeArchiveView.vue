<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Assignment1 from './Assignment1.vue'
import Assignment2 from './Assignment2.vue'
import WeatherParent from './WeatherParent.vue'

/* ════════════════════════════════════════════════
   [요구사항 6] 추가 view ② — '/practice/:day'
   1~3일차에 만든 화면을 보관해 두는 페이지.

   3일차까지는 App.vue가 ref('assignment3') 같은 상태를 들고 탭 버튼으로 화면을 갈아 끼웠다.
   같은 일을 URL로 하면 이렇게 된다. 상태가 사라진 대신 주소가 그 역할을 한다.
   - 새로고침해도 보던 화면이 유지된다
   - 특정 과제 화면을 링크로 바로 공유할 수 있다
   - 뒤로 가기가 자연스럽게 동작한다

   라우트 규칙이 /practice/:day(\d+) 라서 숫자가 아닌 값은 여기까지 오지도 못하고
   Catch-all(NotFoundView)로 떨어진다. 다만 /practice/9 처럼 '숫자지만 없는 과제'는
   규칙에는 맞으므로 이 안에서 직접 걸러 준다.
   ════════════════════════════════════════════════ */

const route = useRoute()

// params 값은 언제나 문자열이다. '3'이지 3이 아니므로 비교할 때 주의해야 한다.
const day = computed(() => Number(route.params.day))

const practiceMap = {
  1: { title: '과제 1 · Mockup', component: Assignment1 },
  2: { title: '과제 2 · Composition', component: Assignment2 },
  3: { title: '과제 3 · Component', component: WeatherParent },
}

const currentPractice = computed(() => practiceMap[day.value] ?? null)
</script>

<template>
  <div class="archive-view">
    <nav class="day-tabs">
      <RouterLink
        v-for="dayNo in [1, 2, 3]"
        :key="dayNo"
        class="day-tab"
        :to="{ name: 'practice-archive', params: { day: dayNo } }"
      >
        {{ dayNo }}일차
      </RouterLink>
    </nav>

    <template v-if="currentPractice !== null">
      <p class="archive-caption">📚 {{ currentPractice.title }} (보관용)</p>

      <!--
        고른 과제 화면을 그 자리에 그린다.
        :key를 day로 두면 과제를 바꿀 때 컴포넌트가 새로 mount되어
        검색어·선택 상태가 이전 과제의 것으로 남지 않는다.
      -->
      <div class="archive-stage">
        <component :is="currentPractice.component" :key="day" />
      </div>
    </template>

    <p v-else class="archive-empty">
      {{ day }}일차 과제는 아직 없습니다. 위에서 1~3일차 중 하나를 선택해 주세요.
    </p>
  </div>
</template>

<style scoped>
.day-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.day-tab {
  padding: 5px 16px;
  background-color: #fff;
  border: 1px solid #c5cede;
  border-radius: 16px;
  color: #556;
  font-size: 13px;
  text-decoration: none;
}

.day-tab:hover {
  background-color: #eef3fb;
}

/* 지금 보고 있는 일차에만 자동으로 붙는 클래스 */
.day-tab.router-link-exact-active {
  background-color: #2f6bd8;
  border-color: #2f6bd8;
  color: #fff;
}

.archive-caption {
  margin: 0 0 8px;
  color: #778;
  font-size: 12px;
  text-align: center;
}

/*
  보관된 과제 화면들은 저마다 흰 카드(.page) 틀을 갖고 있다.
  흰 배경 위에 흰 카드가 겹쳐 보이지 않도록 여기서 회색 무대를 깔아 준다.
*/
.archive-stage {
  padding: 14px 10px;
  background-color: #eef2f7;
  border-radius: 8px;
}

.archive-empty {
  margin: 0;
  padding: 40px 16px;
  color: #889;
  text-align: center;
}
</style>
