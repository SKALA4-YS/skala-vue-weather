<script setup>
import { useFavoriteStore } from '../../stores/favoriteStore'

/* [3일차 요구사항 7] 보기 설정.
   위쪽 두 개는 props로 받아 emit으로 돌려주는 3일차 방식이고,
   즐겨찾기 필터는 스토어를 직접 읽고 쓰는 5일차 방식이다.
   한 파일에서 두 방식을 비교할 수 있게 일부러 섞어 두었다. */

defineProps({
  sortType: {
    type: String,
    required: true,
  },
  onlyHot: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update-sort', 'update-hot'])

const sortOptions = [
  { label: '기본 순서', value: 'none' },
  { label: '기온 높은 순', value: 'temp' },
  { label: '이름 순', value: 'name' },
]

// Element Plus는 이벤트 객체가 아니라 값 자체를 넘겨준다
const handleSortChange = (value) => {
  emit('update-sort', value)
}

const handleHotChange = (checked) => {
  emit('update-hot', checked)
}

const favoriteStore = useFavoriteStore()
</script>

<template>
  <div class="view-options">
    <el-select :model-value="sortType" size="small" class="sort-select" @change="handleSortChange">
      <el-option v-for="option in sortOptions" :key="option.value" :label="option.label" :value="option.value" />
    </el-select>

    <el-checkbox :model-value="onlyHot" size="small" @change="handleHotChange"> 25도 이상 </el-checkbox>

    <!-- 스토어 state는 읽기 전용이 아니라서 v-model을 그대로 걸 수 있다.
         props였다면 자식이 수정하는 셈이라 경고가 났다. -->
    <el-checkbox v-model="favoriteStore.showOnlyFavorite" size="small"> 즐겨찾기 {{ favoriteStore.favoriteCount }} </el-checkbox>
  </div>
</template>

<style scoped>
.view-options {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 14px;
}

.sort-select {
  width: 120px;
}
</style>
