// src/scripts/silabo/logicaSilabo.js
import {
  SILABO_API,
  PERIODO_LECTIVO_API,
  PROFESOR_API,
  FACULTADES_API,
  CARRERAS_API,
  CURSO_API
} from '@/config/constants';

export default {
  name: 'SilaboComponent',

  /* ─────────────── data ─────────────── */
  data() {
    return {
      silabos: [],
      periodosLectivos: [],
      profesores: [],
      facultades: [],
      carreras: [],
      cursos: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        nombre: '',
        competencia_curso: '',
        competencia_perfil_egreso: '',
        competencia_profesional: '',
        sumilla: '',
        periodo_lectivo: '',
        profesor: '',
        facultad: '',
        carrera: '',
        curso: '',
        activo: true
      },
      /* paginación / búsqueda */
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredSilabos: []
    };
  },

  /* ───────────── computed ───────────── */
  computed: {
    totalItems() { return this.filteredSilabos.length; },
    totalPages()  { return Math.ceil(this.totalItems / this.itemsPerPage); },
    startIndex()  { return (this.currentPage - 1) * this.itemsPerPage; },
    endIndex()    { return Math.min(this.startIndex + this.itemsPerPage, this.totalItems); },
    paginatedSilabos() { return this.filteredSilabos.slice(this.startIndex, this.endIndex); },
    visiblePages() {
      const pages = [], maxVisible = 5;
      if (this.totalPages <= maxVisible) {
        for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      } else {
        const start = Math.max(1, this.currentPage - 2);
        const end   = Math.min(this.totalPages, this.currentPage + 2);
        if (start > 1) { pages.push(1); if (start > 2) pages.push('…'); }
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < this.totalPages) { if (end < this.totalPages - 1) pages.push('…'); pages.push(this.totalPages); }
      }
      return pages;
    }
  },

  /* ───────────── watchers ───────────── */
  watch: {
    silabos() { this.applyFilters(); }
  },

  /* ───────── ciclo de vida ────────── */
  mounted() {
    this.fetchSilabos();
    this.fetchPeriodosLectivos();
    this.fetchProfesores();
    this.fetchFacultades();
    this.fetchCarreras();
    this.fetchCursos();
  },

  /* ───────────── métodos ───────────── */
  methods: {
    /* ---------- Fetches ---------- */
    async fetchSilabos() {
      this.loading = true; this.error = null;
      try {
        const token = localStorage.getItem('access_token');
        const res   = await fetch(SILABO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar sílabos');
        this.silabos = await res.json();
      } catch (err) { this.error = err.message; }
      finally       { this.loading = false; }
    },

    async fetchPeriodosLectivos() {
      try {
        const token = localStorage.getItem('access_token');
        const res   = await fetch(PERIODO_LECTIVO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar periodos lectivos');
        this.periodosLectivos = await res.json();
      } catch (err) { this.error = err.message; }
    },

    async fetchProfesores() {
      try {
        const token = localStorage.getItem('access_token');
        const res   = await fetch(PROFESOR_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar profesores');
        this.profesores = await res.json();
      } catch (err) { this.error = err.message; }
    },

    async fetchFacultades() {
      try {
        const token = localStorage.getItem('access_token');
        const res   = await fetch(FACULTADES_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar facultades');
        this.facultades = await res.json();
      } catch (err) { this.error = err.message; }
    },

    async fetchCarreras() {
      try {
        const token = localStorage.getItem('access_token');
        const res   = await fetch(CARRERAS_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar carreras');
        this.carreras = await res.json();
      } catch (err) { this.error = err.message; }
    },

    async fetchCursos() {
      try {
        const token = localStorage.getItem('access_token');
        const res   = await fetch(CURSO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar cursos');
        this.cursos = await res.json();
      } catch (err) { this.error = err.message; }
    },

    /* ---------- Crear / Actualizar ---------- */
    async submitForm() {
      this.loading = true; this.error = null;
      try {
        const token  = localStorage.getItem('access_token');
        const url    = this.editingItem ? SILABO_API.DETAIL(this.editingItem.id) : SILABO_API.LIST;
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
      } catch (err) { this.error = err.message; }
      finally       { this.loading = false; }
    },

    /* ---------- Editar ---------- */
    editItem(silabo) {
      this.editingItem = silabo;
      this.formData = {
        nombre:                       silabo.nombre,
        competencia_curso:            silabo.competencia_curso,
        competencia_perfil_egreso:    silabo.competencia_perfil_egreso,
        competencia_profesional:      silabo.competencia_profesional,
        sumilla:                      silabo.sumilla,
        periodo_lectivo:              silabo.periodo_lectivo,
        profesor:                     silabo.profesor,
        facultad:                     silabo.facultad,
        carrera:                      silabo.carrera,
        curso:                        silabo.curso,
        activo:                       silabo.activo
      };
      this.showCreateForm = true;
    },

    /* ---------- Eliminar ---------- */
    async deleteItem(silabo) {
      if (!confirm(`¿Está seguro de eliminar el sílabo "${silabo.nombre}"?`)) return;
      this.loading = true; this.error = null;
      try {
        const token = localStorage.getItem('access_token');
        const res   = await fetch(SILABO_API.DETAIL(silabo.id), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al eliminar el sílabo');
        await this.fetchSilabos();
      } catch (err) { this.error = err.message; }
      finally       { this.loading = false; }
    },

    /* ---------- Misceláneos ---------- */
    cancelForm() {
      this.editingItem = null;
      this.showCreateForm = false;
      this.formData = {
        nombre: '',
        competencia_curso: '',
        competencia_perfil_egreso: '',
        competencia_profesional: '',
        sumilla: '',
        periodo_lectivo: '',
        profesor: '',
        facultad: '',
        carrera: '',
        curso: '',
        activo: true
      };
      this.error = null;
    },

    /* paginación / búsqueda */
    goToPage(page) { if (page >= 1 && page <= this.totalPages) this.currentPage = page; },
    changeItemsPerPage() { this.currentPage = 1; },
    handleSearch() { this.currentPage = 1; this.applyFilters(); },

    applyFilters() {
      if (!this.searchTerm.trim()) {
        this.filteredSilabos = [...this.silabos];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredSilabos = this.silabos.filter(s =>
          s.nombre?.toLowerCase().includes(term) ||
          s.curso_detalle?.nombre?.toLowerCase().includes(term) ||
          s.profesor_detalle?.persona?.nombre?.toLowerCase().includes(term) ||
          s.periodo_lectivo_detalle?.periodo?.toLowerCase().includes(term)
        );
      }
    }
  }
};
