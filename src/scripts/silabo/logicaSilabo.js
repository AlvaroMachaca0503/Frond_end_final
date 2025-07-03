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
      tiposCurso: [
        { id: 'obligatorio', nombre: 'Obligatorio' },
        { id: 'electivo', nombre: 'Electivo' },
        { id: 'practicas', nombre: 'Prácticas Pre-profesionales' }
      ],
      loading: false,
      error: null,
      showCreateForm: false,
      editingItem: null,
      formData: {
        // Datos generales
        facultad: '',
        semestre: '',
        area_formacion: '',
        tipo_curso: '',
        carrera_profesional: '',
        nro_creditos: null,
        prerrequisitos: '',
        periodo: '',
        horas_teoria: null,
        horas_practica: null,
        codigo_curso: '',
        docente: '',
        correo_docente: '',
        
        // Competencias y contenido
        competencia_curso: '',
        competencia_perfil: '',
        competencias_previas: '',
        sumilla: '',
        actividades_rsu: '',
        
        // Arrays dinámicos
        unidades: [],
        criterios: [],
        
        // Para compatibilidad con API existente (si es necesario)
        nombre: '',
        periodo_lectivo: '',
        profesor: '',
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
    totalPages() { return Math.ceil(this.totalItems / this.itemsPerPage); },
    startIndex() { return (this.currentPage - 1) * this.itemsPerPage; },
    endIndex() { return Math.min(this.startIndex + this.itemsPerPage, this.totalItems); },
    paginatedSilabos() { return this.filteredSilabos.slice(this.startIndex, this.endIndex); },
    
    // Cálculo del peso total de criterios
    totalPeso() {
      return this.formData.criterios.reduce((total, criterio) => {
        return total + (Number(criterio.peso) || 0);
      }, 0);
    },
    
    visiblePages() {
      const pages = [], maxVisible = 5;
      if (this.totalPages <= maxVisible) {
        for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      } else {
        const start = Math.max(1, this.currentPage - 2);
        const end = Math.min(this.totalPages, this.currentPage + 2);
        if (start > 1) { 
          pages.push(1); 
          if (start > 2) pages.push('…'); 
        }
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < this.totalPages) { 
          if (end < this.totalPages - 1) pages.push('…'); 
          pages.push(this.totalPages); 
        }
      }
      return pages;
    }
  },

  /* ───────────── watchers ───────────── */
  watch: {
    silabos() { 
      this.applyFilters(); 
    },
    searchTerm() {
      this.handleSearch();
    },
    // Watcher para autocompletar cuando se selecciona un curso
    'formData.curso'(newCursoId) {
      if (newCursoId) {
        this.autocompletarDatosCurso(newCursoId);
      }
    }
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
      this.loading = true; 
      this.error = null;
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(SILABO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar sílabos');
        this.silabos = await res.json();
      } catch (err) { 
        this.error = err.message; 
      } finally { 
        this.loading = false; 
      }
    },

    async fetchPeriodosLectivos() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(PERIODO_LECTIVO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar periodos lectivos');
        this.periodosLectivos = await res.json();
      } catch (err) { 
        console.error('Error fetching periodos lectivos:', err.message); 
      }
    },

    async fetchProfesores() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(PROFESOR_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar profesores');
        this.profesores = await res.json();
      } catch (err) { 
        console.error('Error fetching profesores:', err.message); 
      }
    },

    async fetchFacultades() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(FACULTADES_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar facultades');
        this.facultades = await res.json();
      } catch (err) { 
        console.error('Error fetching facultades:', err.message); 
      }
    },

    async fetchCarreras() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(CARRERAS_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar carreras');
        this.carreras = await res.json();
      } catch (err) { 
        console.error('Error fetching carreras:', err.message); 
      }
    },

    async fetchCursos() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(CURSO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar cursos');
        this.cursos = await res.json();
      } catch (err) { 
        console.error('Error fetching cursos:', err.message); 
      }
    },

    /* ---------- Nuevo método para obtener detalles del curso ---------- */
    async fetchCursoDetalle(cursoId) {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${CURSO_API.LIST}${cursoId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar detalles del curso');
        return await res.json();
      } catch (err) {
        console.error('Error fetching curso detalle:', err.message);
        return null;
      }
    },

    /* ---------- Autocompletado de datos del curso ---------- */
    async autocompletarDatosCurso(cursoId) {
      if (!cursoId) return;

      try {
        // Buscar el curso en la lista ya cargada (más eficiente)
        let cursoDetalle = this.cursos.find(c => c.id == cursoId);
        
        // Si no está en la lista o no tiene todos los detalles, hacer fetch
        if (!cursoDetalle || !cursoDetalle.semestre_detalle) {
          cursoDetalle = await this.fetchCursoDetalle(cursoId);
        }

        if (!cursoDetalle) return;

        // Autocompletar campos básicos del curso
        this.formData.codigo_curso = cursoDetalle.codigo || '';
        this.formData.nro_creditos = cursoDetalle.creditos || null;
        this.formData.horas_teoria = cursoDetalle.horas_teoria || null;
        this.formData.horas_practica = cursoDetalle.horas_practica || null;

        // Autocompletar área de formación
        if (cursoDetalle.area_detalle) {
          this.formData.area_formacion = cursoDetalle.area_detalle.nombre || '';
        }

        // Autocompletar tipo de curso
        if (cursoDetalle.tipo_curso_detalle) {
          // Buscar el tipo en nuestro array local
          const tipoEncontrado = this.tiposCurso.find(t => 
            t.nombre.toLowerCase() === cursoDetalle.tipo_curso_detalle.nombre.toLowerCase()
          );
          if (tipoEncontrado) {
            this.formData.tipo_curso = tipoEncontrado.id;
          }
        }

        // Autocompletar semestre
        if (cursoDetalle.semestre_detalle) {
          this.formData.semestre = cursoDetalle.semestre_detalle.nombre || '';
          
          // Autocompletar periodo si existe
          if (cursoDetalle.semestre_detalle.semestre_academico_detalle) {
            this.formData.periodo = cursoDetalle.semestre_detalle.semestre_academico_detalle.periodo || '';
          }

          // Autocompletar carrera profesional
          if (cursoDetalle.semestre_detalle.plan_detalle?.carrera_detalle) {
            const carrera = cursoDetalle.semestre_detalle.plan_detalle.carrera_detalle;
            this.formData.carrera_profesional = carrera.id;
            
            // Autocompletar facultad
            if (carrera.departamento_detalle?.facultad_detalle) {
              this.formData.facultad = carrera.departamento_detalle.facultad_detalle.id;
            }
          }
        }

        // Autocompletar prerrequisitos si existen
        if (cursoDetalle.prerrequisitos_detalle && cursoDetalle.prerrequisitos_detalle.length > 0) {
          const prerrequisitos = cursoDetalle.prerrequisitos_detalle
            .map(p => p.nombre || p.codigo || '')
            .filter(p => p)
            .join(', ');
          this.formData.prerrequisitos = prerrequisitos;
        }

        // Autocompletar descripción en sumilla si está disponible
        if (cursoDetalle.descripcion && !this.formData.sumilla) {
          this.formData.sumilla = cursoDetalle.descripcion;
        }

        // Generar nombre automático del sílabo si no existe
        if (!this.formData.nombre) {
          this.formData.nombre = `Sílabo ${cursoDetalle.codigo} - ${cursoDetalle.nombre}`;
        }

        console.log('Datos del curso autocompletados:', {
          curso: cursoDetalle.nombre,
          codigo: cursoDetalle.codigo,
          creditos: cursoDetalle.creditos,
          area: cursoDetalle.area_detalle?.nombre,
          tipo: cursoDetalle.tipo_curso_detalle?.nombre
        });

      } catch (err) {
        console.error('Error al autocompletar datos del curso:', err.message);
      }
    },

    /* ---------- Manejo de Unidades ---------- */
    addUnidad() {
      this.formData.unidades.push({
        denominacion: '',
        semana: '',
        competencia: '',
        contenidos: '',
        metodologia: '',
        fuentes: ''
      });
    },

    removeUnidad(index) {
      if (confirm('¿Está seguro de eliminar esta unidad?')) {
        this.formData.unidades.splice(index, 1);
      }
    },

    /* ---------- Manejo de Criterios ---------- */
    addCriterio() {
      this.formData.criterios.push({
        evaluacion: '',
        peso: null,
        fecha: '',
        descripcion: ''
      });
    },

    removeCriterio(index) {
      if (confirm('¿Está seguro de eliminar este criterio?')) {
        this.formData.criterios.splice(index, 1);
      }
    },

    /* ---------- Crear / Actualizar ---------- */
    async submitForm() {
      // Validaciones básicas
      if (this.totalPeso !== 100 && this.formData.criterios.length > 0) {
        this.error = 'La suma de los pesos de evaluación debe ser exactamente 100%';
        return;
      }

      this.loading = true; 
      this.error = null;
      
      try {
        const token = localStorage.getItem('access_token');
        const url = this.editingItem ? SILABO_API.DETAIL(this.editingItem.id) : SILABO_API.LIST;
        const method = this.editingItem ? 'PUT' : 'POST';
        
        // Preparar payload - ajusta según tu API
        const payload = { 
          ...this.formData,
          // Si tu API necesita un nombre principal, puedes generarlo automáticamente
          nombre: this.formData.nombre || `Sílabo ${this.formData.codigo_curso} - ${this.formData.periodo}`
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

    /* ---------- Editar ---------- */
    editItem(silabo) {
      this.editingItem = silabo;
      this.formData = {
        // Mapear datos del sílabo existente
        facultad: silabo.facultad || '',
        semestre: silabo.semestre || '',
        area_formacion: silabo.area_formacion || '',
        tipo_curso: silabo.tipo_curso || '',
        carrera_profesional: silabo.carrera_profesional || silabo.carrera || '',
        nro_creditos: silabo.nro_creditos || null,
        prerrequisitos: silabo.prerrequisitos || '',
        periodo: silabo.periodo || silabo.periodo_lectivo_detalle?.periodo || '',
        horas_teoria: silabo.horas_teoria || null,
        horas_practica: silabo.horas_practica || null,
        codigo_curso: silabo.codigo_curso || '',
        docente: silabo.docente || silabo.profesor_detalle?.persona?.nombre || '',
        correo_docente: silabo.correo_docente || '',
        
        competencia_curso: silabo.competencia_curso || '',
        competencia_perfil: silabo.competencia_perfil || silabo.competencia_perfil_egreso || '',
        competencias_previas: silabo.competencias_previas || silabo.competencia_profesional || '',
        sumilla: silabo.sumilla || '',
        actividades_rsu: silabo.actividades_rsu || '',
        
        unidades: silabo.unidades || [],
        criterios: silabo.criterios || [],
        
        // Para compatibilidad
        nombre: silabo.nombre || '',
        periodo_lectivo: silabo.periodo_lectivo || '',
        profesor: silabo.profesor || '',
        curso: silabo.curso || '',
        activo: silabo.activo !== undefined ? silabo.activo : true
      };
      this.showCreateForm = true;
    },

    /* ---------- Eliminar ---------- */
    async deleteItem(silabo) {
      if (!confirm(`¿Está seguro de eliminar el sílabo "${silabo.nombre}"?`)) return;
      
      this.loading = true; 
      this.error = null;
      
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(SILABO_API.DETAIL(silabo.id), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al eliminar el sílabo');
        await this.fetchSilabos();
      } catch (err) { 
        this.error = err.message; 
      } finally { 
        this.loading = false; 
      }
    },

    /* ---------- Misceláneos ---------- */
    cancelForm() {
      this.editingItem = null;
      this.showCreateForm = false;
      this.resetFormData();
      this.error = null;
    },

    resetFormData() {
      this.formData = {
        facultad: '',
        semestre: '',
        area_formacion: '',
        tipo_curso: '',
        carrera_profesional: '',
        nro_creditos: null,
        prerrequisitos: '',
        periodo: '',
        horas_teoria: null,
        horas_practica: null,
        codigo_curso: '',
        docente: '',
        correo_docente: '',
        competencia_curso: '',
        competencia_perfil: '',
        competencias_previas: '',
        sumilla: '',
        actividades_rsu: '',
        unidades: [],
        criterios: [],
        nombre: '',
        periodo_lectivo: '',
        profesor: '',
        curso: '',
        activo: true
      };
    },

    /* ---------- Paginación / Búsqueda ---------- */
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
        this.filteredSilabos = [...this.silabos];
      } else {
        const term = this.searchTerm.toLowerCase();
        this.filteredSilabos = this.silabos.filter(s =>
          s.nombre?.toLowerCase().includes(term) ||
          s.codigo_curso?.toLowerCase().includes(term) ||
          s.docente?.toLowerCase().includes(term) ||
          s.curso_detalle?.nombre?.toLowerCase().includes(term) ||
          s.profesor_detalle?.persona?.nombre?.toLowerCase().includes(term) ||
          s.periodo_lectivo_detalle?.periodo?.toLowerCase().includes(term)
        );
      }
    }
  }
};