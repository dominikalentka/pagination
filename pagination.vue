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
        v-model.number="perPage"
        @change="onPerPageChange"
        aria-live="polite"
        :aria-label="`Liczba wyników na stronie: ${perPage}`"
      >
        <option
          v-for="option in perPageOptions"
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
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
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
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
          :aria-current="page === currentPage ? 'page' : null"
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
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          aria-label="Następna strona"
        >
          ›
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AccessiblePagination',
  props: {
    totalItems: {
      type: Number,
      required: true
    },
    perPageOptions: {
      type: Array,
      default: () => [10, 25, 50, 100]
    },
    defaultPerPage: {
      type: Number,
      default: 25
    },
    labels: {
      type: Object,
      default: () => ({
        prev: 'Poprzednia strona',
        next: 'Następna strona',
        goToPage: 'Idź do strony'
      })
    }
  },
  data() {
    return {
      currentPage: 1,
      perPage: this.defaultPerPage,
      windowWidth: window.innerWidth
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.perPage);
    },
    isNarrow() {
      return this.windowWidth < 1240;
    },
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, start + 4);
      for (let i = start; i <= end && pages.length < 5; i++) {
        pages.push(i);
      }
      return pages;
    },
    shouldShowFirst() {
      return this.visiblePages[0] > 2;
    },
    shouldShowLast() {
      return this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1;
    }
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.$emit('page-changed', page);
      }
    },
    onPerPageChange() {
      this.$emit('per-page-changed', this.perPage);
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    }
  },
  mounted() {
    window.addEventListener('resize', this.updateWindowWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWindowWidth);
  }
};
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
