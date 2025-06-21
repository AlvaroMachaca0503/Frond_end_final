import { METODOLOGIA_API } from '@/config/constants'

export default {
  name: 'MetodologiaComponent',
  data() {
    return {
      metodologias: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        tipo: '',
        descripcion: '',
        activo: true
      },
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredMetodologias: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredMetodologias.length;
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
    paginatedMetodologias() {
      return this.filteredMetodologias.slice(this.startIndex, this.endIndex);
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
    metodologias() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchMetodologias();
  },
  methods: {
    async fetchMetodologias() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(METODOLOGIA_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar las metodologías');
        this.metodologias = await response.json();
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
          ? METODOLOGIA_API.DETAIL(this.editingItem.id)
          : METODOLOGIA_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = {
          tipo: this.formData.tipo,
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

        await this.fetchMetodologias();
        this.cancelForm();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async deleteItem(metodologia) {
      if (!confirm(`¿Está seguro de eliminar la metodología con ID ${metodologia.id}?`)) return;

      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(METODOLOGIA_API.DETAIL(metodologia.id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al eliminar la metodología');

        await this.fetchMetodologias();
      } catch (error) {
        this.error = error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(metodologia) {
      this.editingItem = metodologia;
      this.formData = {
        tipo: metodologia.tipo,
        descripcion: metodologia.descripcion,
        activo: metodologia.activo
      };
      this.showCreateForm = true;
    },

    cancelForm() {
      this.showCreateForm = false;
      this.editingItem = null;
      this.formData = {
        tipo: '',
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
        this.filteredMetodologias = [...this.metodologias];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredMetodologias = this.metodologias.filter(item =>
          item.tipo.toLowerCase().includes(term) ||
          item.descripcion.toLowerCase().includes(term) ||
          item.id.toString().includes(term)
        );
      }
    }
  }
};
