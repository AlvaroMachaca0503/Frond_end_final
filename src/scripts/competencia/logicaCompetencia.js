import { COMPETENCIA_API } from "@/config/constants";

export default {
  name: "CompetenciaComponent",
  data() {
    return {
      competencias: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        descripcion: '',
        tipo: '',
        activo: true
      },
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredCompetencias: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredCompetencias.length;
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
    },
    paginatedCompetencias() {
      return this.filteredCompetencias.slice(this.startIndex, this.endIndex);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;

      if (this.totalPages <= maxVisible) {
        for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      } else {
        const start = Math.max(1, this.currentPage - 2);
        const end = Math.min(this.totalPages, this.currentPage + 2);

        if (start > 1) {
          pages.push(1);
          if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) pages.push(i);

        if (end < this.totalPages) {
          if (end < this.totalPages - 1) pages.push('...');
          pages.push(this.totalPages);
        }
      }

      return pages;
    }
  },
  watch: {
    competencias() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchCompetencias();
  },
  methods: {
    async fetchCompetencias() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(COMPETENCIA_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Error al cargar las competencias");

        this.competencias = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("access_token");
        const url = this.editingItem
          ? COMPETENCIA_API.DETAIL(this.editingItem.id)
          : COMPETENCIA_API.LIST;

        const method = this.editingItem ? "PUT" : "POST";

        const payload = {
          descripcion: this.formData.descripcion,
          tipo: this.formData.tipo,
          activo: this.formData.activo
        };

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(Object.values(errorData).flat().join(", "));
        }

        await this.fetchCompetencias();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(competencia) {
      if (!confirm(`¿Está seguro de eliminar la competencia tipo "${competencia.tipo}"?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(COMPETENCIA_API.DETAIL(competencia.id), {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Error al eliminar la competencia");

        await this.fetchCompetencias();
      } catch (error) {
        this.error = error.message;
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },

    editItem(competencia) {
      this.editingItem = competencia;
      this.formData = {
        descripcion: competencia.descripcion,
        tipo: competencia.tipo,
        activo: competencia.activo
      };
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        descripcion: '',
        tipo: '',
        activo: true
      };
      this.error = null;
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },

    changeItemsPerPage() {
      this.currentPage = 1;
    },

    handleSearch() {
      this.currentPage = 1;
      this.applyFilters();
    },

    applyFilters() {
      if (!this.searchTerm.trim()) {
        this.filteredCompetencias = [...this.competencias];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredCompetencias = this.competencias.filter(competencia =>
          competencia.descripcion.toLowerCase().includes(term) ||
          competencia.tipo.toLowerCase().includes(term) ||
          competencia.id.toString().includes(term)
        );
      }
    }
  }
};
