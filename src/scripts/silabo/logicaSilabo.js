import {
  FACULTADES_API,
  CARRERAS_API,
  CURSO_API,
  PROFESOR_API,
  COMPETENCIA_API,
  PERFIL_API,
  SUMILLA_API,
  UNIDAD_API,
  ACTIVIDADES_API,
  CRITERIO_API
} from '@/config/constants';

const SILABO_API = {
  LIST: `${import.meta.env.VITE_BACK_URL}/silabos/`,
  DETAIL: (id) => `${import.meta.env.VITE_BACK_URL}/silabos/${id}/`
};

export default {
  name: 'SilaboComponent',
  data() {
    return {
      silabos: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredSilabos: [],
      formData: {
        periodo: '',
        profesor_id: '',
        facultad_id: '',
        carrera_id: '',
        curso_id: '',
        competencia_id: '',
        perfil_id: '',
        competencia_profesional_id: '',
        sumilla_id: '',
        unidad_id: '',
        actividad_id: '',
        criterio_id: '',
        activo: true
      },
      profesores: [],
      facultades: [],
      carreras: [],
      cursos: [],
      competencias: [],
      perfiles: [],
      sumillas: [],
      unidades: [],
      actividades: [],
      criterios: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredSilabos.length;
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
    paginatedSilabos() {
      return this.filteredSilabos.slice(this.startIndex, this.endIndex);
    }
  },
  watch: {
    silabos() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchAll();
  },
  methods: {
    async fetchAll() {
      await Promise.all([
        this.fetchSilabos(),
        this.fetchData(FACULTADES_API.LIST, 'facultades'),
        this.fetchData(CARRERAS_API.LIST, 'carreras'),
        this.fetchData(CURSO_API.LIST, 'cursos'),
        this.fetchData(PROFESOR_API.LIST, 'profesores'),
        this.fetchData(COMPETENCIA_API.LIST, 'competencias'),
        this.fetchData(PERFIL_API.LIST, 'perfiles'),
        this.fetchData(SUMILLA_API.LIST, 'sumillas'),
        this.fetchData(UNIDAD_API.LIST, 'unidades'),
        this.fetchData(ACTIVIDADES_API.LIST, 'actividades'),
        this.fetchData(CRITERIO_API.LIST, 'criterios')
      ]);
    },
    async fetchData(url, target) {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Error al cargar ${target}`);
        this[target] = await res.json();
      } catch (err) {
        this.error = err.message;
      }
    },
    async fetchSilabos() {
      this.loading = true;
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(SILABO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar silabos');
        this.silabos = await res.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async submitForm() {
      this.loading = true;
      try {
        const token = localStorage.getItem('access_token');
        const url = this.editingItem ? SILABO_API.DETAIL(this.editingItem.id) : SILABO_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = { ...this.formData };

        const res = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(Object.values(errorData).flat().join(', '));
        }

        await this.fetchSilabos();
        this.cancelForm();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    editItem(silabo) {
      this.editingItem = silabo;
      this.formData = { ...silabo };
      this.showCreateForm = true;
    },
    async deleteItem(silabo) {
      if (!confirm(`¿Está seguro de eliminar el silabo con ID ${silabo.id}?`)) return;
      this.loading = true;
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(SILABO_API.DETAIL(silabo.id), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al eliminar el silabo');
        await this.fetchSilabos();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    cancelForm() {
      this.editingItem = null;
      this.showCreateForm = false;
      this.formData = {
        periodo: '',
        profesor_id: '',
        facultad_id: '',
        carrera_id: '',
        curso_id: '',
        competencia_id: '',
        perfil_id: '',
        competencia_profesional_id: '',
        sumilla_id: '',
        unidad_id: '',
        actividad_id: '',
        criterio_id: '',
        activo: true
      };
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
        this.filteredSilabos = [...this.silabos];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredSilabos = this.silabos.filter(s =>
          s.periodo.toLowerCase().includes(term) ||
          s.profesor_detalle?.usuario?.first_name?.toLowerCase().includes(term) ||
          s.curso_detalle?.nombre?.toLowerCase().includes(term)
        );
      }
    }
  }
};
