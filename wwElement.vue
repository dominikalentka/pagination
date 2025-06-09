<template>
  <nav
    class="pagination"
    :class="{ narrow: isNarrow }"
    aria-label="Paginacja"
  >
    <!-- Items per page -->
    <div class="items-per-page">
      <label for="perPage" class="sr-only">Liczba wyników na stronie</label>
      <select
        id="perPage"
        v-model.number="localPerPage"
        @change="onPerPageChange"
        aria-live="polite"
        :aria-label="`Liczba wyników na stronie: ${localPerPage}`"
      >
        <option
          v-for="option in content.perPageOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>

    <!-- Pagination controls -->
    <ul class="pagination-list">
      <li>
        <button
          :disabled="localCurrentPage === 1"
          @click="goToPage(localCurrentPage - 1)"
          aria-label="Poprzednia strona"
        >
          ‹
        </button>
      </li>

      <li v-if="shouldShowFirst">
        <button @click="goToPage(1)" :aria-label="`Idź do strony 1`">1</button>
        <span class="dots">...</span>
      </li>

      <li v-for="page in visiblePages" :key="page">
        <button
          :class="{ active: page === localCurrentPage }"
          @click="goToPage(page)"
          :aria-current="page === localCurrentPage ? 'page' : null"
          :aria-label="`Idź do strony ${page}`"
        >
          {{ page }}
        </button>
      </li>

      <li v-if="shouldShowLast">
        <span class="dots">...</span>
        <button @click="goToPage(totalPages)" :aria-label="`Idź do strony ${totalPages}`">{{ totalPages }}</button>
      </li>

      <li>
        <button
          :disabled="localCurrentPage === totalPages"
          @click="goToPage(localCurrentPage + 1)"
          aria-label="Następna strona"
        >
          ›
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  content: {
    type: Object,
    required: true
  }
})

// Local state for current page and per page (so changes don't affect other instances)
const localCurrentPage = ref(1)
const localPerPage = ref(props.content.defaultPerPage || 25)
const windowWidth = ref(window.innerWidth)

const totalPages = computed(() =>
  Math.ceil(props.content.totalItems / localPerPage.value)
)

const isNarrow = computed(() => windowWidth.value < 1240)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, localCurrentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end && pages.length < 5; i++) {
    pages.push(i)
  }
  return pages
})

const shouldShowFirst = computed(() => visiblePages.value[0] > 2)
const shouldShowLast = computed(
  () => visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1
)

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    localCurrentPage.value = page
    // In WeWeb, you can expose this value if needed using exposed variables
  }
}

function onPerPageChange() {
  // In WeWeb, you can trigger a workflow here if needed
}

function updateWindowWidth() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

// Reset pagination if totalItems or perPage changes
watch(
  () => [props.content.totalItems, localPerPage.value],
  () => {
    localCurrentPage.value = 1
  }
)
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.pagination-list {
  display: flex;
  list-style: none;
  gap: 0.5rem;
}
button {
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  background: white;
  cursor: pointer;
  transition: background 0.2s;
}
button.active {
  background: #f0f0f0;
  font-weight: bold;
}
button:focus {
  outline: 2px solid #f90;
  outline-offset: 2px;
}
button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
.dots {
  padding: 0 0.5rem;
}
.items-per-page {
  margin-bottom: 1rem;
}
.narrow .pagination-list {
  gap: 0.2rem;
  font-size: 0.9rem;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
