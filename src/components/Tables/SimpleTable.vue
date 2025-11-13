<template>
  <div class="datatable-container">
    <!-- Cabeçalho com busca e controle de registros -->
    <div class="row mb-3">
      <div class="col-sm-12 col-md-6">
        <div class="d-flex align-items-center">
          <label class="me-2">Mostrar</label>
          <select
            v-model.number="perPage"
            class="form-select form-select-sm"
            style="width: auto"
            :disabled="isLoading"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="ms-2">registros</span>
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <div class="d-flex justify-content-md-end mt-2 mt-md-0">
          <input
            v-model="searchQuery"
            type="search"
            class="form-control form-control-sm"
            placeholder="Buscar..."
            style="max-width: 300px"
            :disabled="isLoading"
          />
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="
                column.sortable !== false && !isLoading
                  ? sort(column.key)
                  : null
              "
              :style="{
                cursor:
                  column.sortable !== false && !isLoading
                    ? 'pointer'
                    : 'default',
                width: column.width || 'auto',
              }"
              class="border-0"
            >
              {{ column.label }}
              <span
                v-if="column.sortable !== false && sortKey === column.key"
                class="ms-1"
              >
                <i v-if="sortOrder === 'asc'" class="bi bi-chevron-up"></i>
                <i v-else class="bi bi-chevron-down"></i>
              </span>
            </th>
            <th v-if="showDeleteButton" class="border-0" style="width: 80px">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td
              :colspan="columns.length + (showDeleteButton ? 1 : 0)"
              class="text-center"
            >
              <div
                class="spinner-border text-primary"
                style="color: black !important"
              ></div>
            </td>
          </tr>
          <tr v-else-if="paginatedData.length === 0">
            <td
              :colspan="columns.length + (showDeleteButton ? 1 : 0)"
              class="text-center text-muted py-4"
            >
              Nenhum registro encontrado
            </td>
          </tr>
          <tr
            v-else
            v-for="(item, index) in paginatedData"
            :key="index"
            class="table-row"
          >
            <td v-for="column in columns" :key="column.key">
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="item[column.key]"
              >
                {{ formatCell(item[column.key], column) }}
              </slot>
            </td>
            <td v-if="showDeleteButton" class="action-cell">
              <button
                class="btn btn-link text-danger p-0 delete-icon"
                @click="deleteItem(item)"
                :disabled="isLoading"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Rodapé com informações e paginação -->
    <div class="row">
      <div class="col-sm-12 col-md-5">
        <div class="datatable-info">
          Mostrando {{ startRecord }} até {{ endRecord }} de
          {{ filteredData.length }} registros
          <span v-if="filteredData.length !== data.length">
            (filtrados de {{ data.length }} registros totais)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sortable-table",
  props: {
    showDeleteButton: {
      type: Boolean,
      required: true,
      default: false,
    },
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    columns: {
      type: Array,
      required: true,
      default: () => [],
    },
    initialPerPage: {
      type: Number,
      default: 10,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchQuery: "",
      sortKey: "",
      sortOrder: "asc",
      currentPage: 1,
      perPage: this.initialPerPage,
    };
  },
  computed: {
    filteredData() {
      let filtered = this.data;

      // Aplicar busca
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter((item) => {
          return this.columns.some((column) => {
            const value = item[column.key];
            return value && value.toString().toLowerCase().includes(query);
          });
        });
      }

      // Aplicar ordenação
      if (this.sortKey) {
        filtered = [...filtered].sort((a, b) => {
          let aVal = a[this.sortKey];
          let bVal = b[this.sortKey];

          // Converter para string se necessário
          if (typeof aVal === "string") aVal = aVal.toLowerCase();
          if (typeof bVal === "string") bVal = bVal.toLowerCase();

          if (aVal < bVal) return this.sortOrder === "asc" ? -1 : 1;
          if (aVal > bVal) return this.sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.perPage);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredData.slice(start, end);
    },
    startRecord() {
      return this.filteredData.length === 0
        ? 0
        : (this.currentPage - 1) * this.perPage + 1;
    },
    endRecord() {
      const end = this.currentPage * this.perPage;
      return end > this.filteredData.length ? this.filteredData.length : end;
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    perPage() {
      this.currentPage = 1;
    },
  },
  methods: {
    sort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortOrder = "asc";
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    formatCell(value, column) {
      if (column.format && typeof column.format === "function") {
        return column.format(value);
      }
      return value;
    },
    deleteItem(item) {
      this.$emit("delete", item);
    },
  },
};
</script>

<style scoped>
.datatable-container {
  padding: 1rem 0;
}

.datatable-info {
  color: #6c757d;
  font-size: 0.875rem;
}

thead th {
  user-select: none;
  vertical-align: middle;
}

.table-row {
  position: relative;
}

.action-cell {
  text-align: center;
  vertical-align: middle;
}

.delete-icon {
  opacity: 1;
  color: black;
  transition: color 0.2s ease, transform 0.2s ease;
  font-size: 1.1rem;
  border: none;
  background: none;
}

.delete-icon:hover:not(:disabled) {
  color: red;
  transform: scale(1.1);
}

.delete-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.table-responsive {
  margin-bottom: 1rem;
}

/* Ajustes para mobile */
@media (max-width: 768px) {
  .pagination {
    font-size: 0.875rem;
  }

  .page-link {
    padding: 0.375rem 0.75rem;
  }
}
</style>
