<template>
  <div class="md-layout md-gutter">
    <div class="md-layout-item md-size-100">
      <md-table>
        <!-- Cabeçalho -->
        <md-table-row>
          <md-table-head v-for="(col, index) in columns" :key="index">
            <span
              @click="sortBy(col.field)"
              style="cursor: pointer; user-select: none"
            >
              {{ col.label }}
              <md-icon v-if="currentSort === col.field">
                {{
                  currentSortDir === "asc" ? "arrow_upward" : "arrow_downward"
                }}
              </md-icon>
            </span>
          </md-table-head>
        </md-table-row>

        <!-- Linhas -->
        <md-table-row v-for="(item, index) in sortedUsers" :key="index">
          <md-table-cell>{{ item.name }}</md-table-cell>
          <md-table-cell>{{ item.country }}</md-table-cell>
          <md-table-cell>{{ item.city }}</md-table-cell>
          <md-table-cell>{{ item.salary }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "sortable-table",
  data() {
    return {
      currentSort: "name",
      currentSortDir: "asc",
      columns: [
        { label: "Nome", field: "name" },
        { label: "País", field: "country" },
        { label: "Cidade", field: "city" },
        { label: "Salário", field: "salary" },
      ],
      users: [
        {
          name: "Dakota Rice",
          salary: "$36,738",
          country: "Niger",
          city: "Oud-Turnhout",
        },
        {
          name: "Minerva Hooper",
          salary: "$23,738",
          country: "Curaçao",
          city: "Sinaai-Waas",
        },
        {
          name: "Sage Rodriguez",
          salary: "$56,142",
          country: "Netherlands",
          city: "Overland Park",
        },
        {
          name: "Philip Chaney",
          salary: "$38,735",
          country: "Korea, South",
          city: "Gloucester",
        },
        {
          name: "Doris Greene",
          salary: "$63,542",
          country: "Malawi",
          city: "Feldkirchen in Kärnten",
        },
        {
          name: "Mason Porter",
          salary: "$78,615",
          country: "Chile",
          city: "Gloucester",
        },
      ],
    };
  },
  computed: {
    sortedUsers() {
      return this.users.slice().sort((a, b) => {
        let modifier = this.currentSortDir === "asc" ? 1 : -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },
  },
  methods: {
    sortBy(field) {
      if (this.currentSort === field) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      } else {
        this.currentSort = field;
        this.currentSortDir = "asc";
      }
    },
  },
};
</script>

<style scoped>
.md-table {
  width: 100%;
}
.md-table-head {
  cursor: pointer;
  user-select: none;
}
.md-icon {
  font-size: 18px;
  vertical-align: middle;
  margin-left: 4px;
}
</style>
