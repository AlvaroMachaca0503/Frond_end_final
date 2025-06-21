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
      filteredSilabos: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      formData: {
        id: null,
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
    },
    camposRelacionados() {
      return {
        profesor_id: 'Profesor',
        facultad_id: 'Facultad',
        carrera_id: 'Carrera',
        curso_id: 'Curso',
        competencia_id: 'Competencia',
        perfil_id: 'Perfil',
        competencia_profesional_id: 'Competencia Profesional',
        sumilla_id: 'Sumilla',
        unidad_id: 'Unidad',
        actividad_id: 'Actividad',
        criterio_id: 'Criterio'
      };
    },
    entidades() {
      return {
        profesor_id: this.profesores,
        facultad_id: this.facultades,
        carrera_id: this.carreras,
        curso_id: this.cursos,
        competencia_id: this.competencias,
        perfil_id: this.perfiles,
        competencia_profesional_id: this.competencias,
        sumilla_id: this.sumillas,
        unidad_id: this.unidades,
        actividad_id: this.actividades,
        criterio_id: this.criterios
      };
    },
    mostrarNombre() {
      return {
        profesor_id: (item) => item.usuario?.first_name || `ID: ${item.id}`,
        facultad_id: (item) => item.nombre,
        carrera_id: (item) => item.nombre,
        curso_id: (item) => item.nombre,
        competencia_id: (item) => item.descripcion,
        perfil_id: (item) => item.descripcion,
        competencia_profesional_id: (item) => item.descripcion,
        sumilla_id: (item) => item.descripcion,
        unidad_id: (item) => item.descripcion,
        actividad_id: (item) => item.nombre,
        criterio_id: (item) => item.nombre
      };
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

        const payload = {
          ...this.formData,
          profesor: this.formData.profesor_id,
          facultad: this.formData.facultad_id,
          carrera: this.formData.carrera_id,
          curso: this.formData.curso_id,
          competencia: this.formData.competencia_id,
          perfil: this.formData.perfil_id,
          competencia_profesional: this.formData.competencia_profesional_id,
          sumilla: this.formData.sumilla_id,
          unidad: this.formData.unidad_id,
          actividad: this.formData.actividad_id,
          criterio: this.formData.criterio_id
        };

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
      this.formData = {
        id: silabo.id,
        periodo: silabo.periodo,
        profesor_id: silabo.profesor,
        facultad_id: silabo.facultad,
        carrera_id: silabo.carrera,
        curso_id: silabo.curso,
        competencia_id: silabo.competencia,
        perfil_id: silabo.perfil,
        competencia_profesional_id: silabo.competencia_profesional,
        sumilla_id: silabo.sumilla,
        unidad_id: silabo.unidad,
        actividad_id: silabo.actividad,
        criterio_id: silabo.criterio,
        activo: silabo.activo
      };
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
        id: null,
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
      const term = this.searchTerm.toLowerCase();
      this.filteredSilabos = this.silabos.filter(s =>
        s.periodo.toLowerCase().includes(term) ||
        s.profesor_detalle?.usuario?.first_name?.toLowerCase().includes(term) ||
        s.curso_detalle?.nombre?.toLowerCase().includes(term)
      );
    }
  }
};