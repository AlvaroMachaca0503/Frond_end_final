import { CURSO_API, AREA_API, SEMESTRE_PLAN_API } from '@/config/constants';

export default {
  name: 'CursoComponent',
  data() {
    return {
      cursos: [],
      areas: [],
      semestres: [],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        nombre: '',
        codigo: '',
        descripcion: '',
        horas_teoria: 0,
        horas_practica: 0,
        horas_laboratorio: 0,
        horas_teopra: 0,
        creditos: 0,
        activo: true,
        area_id: '',
        semestre_id: '',
        prerrequisitos: []
      },
      currentPage: 1,
      itemsPerPage: 10,
      searchTerm: '',
      filteredCursos: []
    };
  },
  computed: {
    totalItems() {
      return this.filteredCursos.length;
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
    paginatedCursos() {
      return this.filteredCursos.slice(this.startIndex, this.endIndex);
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

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (end < this.totalPages) {
          if (end < this.totalPages - 1) pages.push('...');
          pages.push(this.totalPages);
        }
      }

      return pages;
    }
  },
  watch: {
    cursos() {
      this.applyFilters();
    }
  },
  mounted() {
    this.fetchCursos();
    this.fetchAreas();
    this.fetchSemestres();
  },
  methods: {
    async fetchCursos() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(CURSO_API.LIST, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Error al cargar cursos');
        this.cursos = await res.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchAreas() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(AREA_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar áreas');
        this.areas = await res.json();
      } catch (err) {
        this.error = err.message;
      }
    },
    async fetchSemestres() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(SEMESTRE_PLAN_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar semestres');
        this.semestres = await res.json();
      } catch (err) {
        this.error = err.message;
      }
    },
    async submitForm() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('access_token');
        const url = this.editingItem
          ? CURSO_API.DETAIL(this.editingItem.id)
          : CURSO_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';

        const payload = {
          nombre: this.formData.nombre,
          codigo: this.formData.codigo,
          descripcion: this.formData.descripcion,
          horas_teoria: this.formData.horas_teoria,
          horas_practica: this.formData.horas_practica,
          horas_laboratorio: this.formData.horas_laboratorio,
          horas_teopra: this.formData.horas_teopra,
          creditos: this.formData.creditos,
          activo: this.formData.activo,
          area: this.formData.area_id,
          semestre: this.formData.semestre_id,
          prerrequisitos: this.formData.prerrequisitos
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

        await this.fetchCursos();
        this.cancelForm();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    editItem(curso) {
      this.editingItem = curso;
      this.formData = {
        nombre: curso.nombre,
        codigo: curso.codigo,
        descripcion: curso.descripcion,
        horas_teoria: curso.horas_teoria,
        horas_practica: curso.horas_practica,
        horas_laboratorio: curso.horas_laboratorio,
        horas_teopra: curso.horas_teopra,
        creditos: curso.creditos,
        activo: curso.activo,
        area_id: curso.area,
        semestre_id: curso.semestre,
        prerrequisitos: curso.prerrequisitos || []
      };
      this.showCreateForm = true;
    },
    async deleteItem(curso) {
      if (!confirm(`¿Está seguro de eliminar el curso "${curso.nombre}"?`)) return;
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(CURSO_API.DETAIL(curso.id), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Error al eliminar el curso');

        await this.fetchCursos();
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
        nombre: '',
        codigo: '',
        descripcion: '',
        horas_teoria: 0,
        horas_practica: 0,
        horas_laboratorio: 0,
        horas_teopra: 0,
        creditos: 0,
        activo: true,
        area_id: '',
        semestre_id: '',
        prerrequisitos: []
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
        this.filteredCursos = [...this.cursos];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredCursos = this.cursos.filter(c =>
          c.nombre.toLowerCase().includes(term) ||
          c.codigo.toLowerCase().includes(term) ||
          c.area_detalle?.nombre?.toLowerCase().includes(term)
        );
      }
    }
  }
};
