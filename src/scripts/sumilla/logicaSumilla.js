import { SUMILLA_API } from '@/config/constants'

export default {
  name: 'SumillaComponent',
  data() {
    return {
      sumillas: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        descripcion: '',
        activo: true
      },
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredSumillas: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredSumillas.length;
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
    paginatedSumillas() {
      return this.filteredSumillas.slice(this.startIndex, this.endIndex);
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
    sumillas() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchSumillas();
  },
  methods: {
    async fetchSumillas() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(SUMILLA_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar las sumillas');
        this.sumillas = await response.json();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const url = this.editingItem
          ? SUMILLA_API.DETAIL(this.editingItem.id)
          : SUMILLA_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = {
          descripcion: this.formData.descripcion,
          activo: this.formData.activo
        };

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(Object.values(errorData).flat().join(', '));
        }

        await this.fetchSumillas();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(sumilla) {
      if (!confirm(`¿Está seguro de eliminar la sumilla con ID ${sumilla.id}?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(SUMILLA_API.DETAIL(sumilla.id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar la sumilla');

        await this.fetchSumillas();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(sumilla) {
      this.editingItem = sumilla;
      this.formData = {
        descripcion: sumilla.descripcion,
        activo: sumilla.activo
      };
      this.showCreateForm = true;
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        descripcion: '',
        activo: true
      };
      this.error = null;
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
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
        this.filteredSumillas = [...this.sumillas];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredSumillas = this.sumillas.filter(item =>
          item.descripcion.toLowerCase().includes(term) ||
          item.id.toString().includes(term)
        );
      }
    }
  }
};
