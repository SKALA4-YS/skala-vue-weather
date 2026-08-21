<script setup>
/* [3일차 요구사항 2] 여러 박스가 공유하던 패널 디자인을 한 곳으로 모은 컴포넌트.
   내용은 <slot>으로 비워 두고 무엇을 넣을지는 부모가 정한다.
   - 이름 없는 기본 slot : 본문
   - #title : 제목 (안 넘기면 fallback)
   - #footer : 아래 요약 줄 (안 넘기면 아예 안 그려짐)

   7일차: 바깥 틀만 el-card로 바꿨다. slot 구조는 그대로라
   부모가 넘기는 방식은 3일차와 똑같다. */

defineProps({
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <el-card shadow="never" class="panel">
    <template #header>
      <p class="section-label">
        <slot name="title">제목 없는 카드</slot>
      </p>
    </template>

    <slot></slot>

    <!-- $slots에는 부모가 실제로 넘긴 슬롯만 들어 있다 -->
    <template v-if="$slots.footer" #footer>
      <span class="foot"><slot name="footer"></slot></span>
    </template>
  </el-card>
</template>

<style scoped>
/* 슬롯으로 들어온 내용은 부모 스코프에서 컴파일되므로 여기서 그 안쪽을 겨냥할 수 없다.
   각 자식이 자기 <style scoped>를 들고 있는 이유다. */
.panel {
  margin-bottom: 14px;
  background-color: var(--surface);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
}

.panel :deep(.el-card__header) {
  padding: 14px 16px 0;
  border-bottom: none;
}

.panel :deep(.el-card__body) {
  padding: 10px 16px 16px;
}

.panel :deep(.el-card__footer) {
  padding: 10px 16px;
  border-top: 1px solid var(--line-soft);
}

.section-label {
  margin: 0;
}

.foot {
  color: var(--text-dim);
  font-size: 12px;
}
</style>
