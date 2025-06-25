import { SILABO_API, FACULTAD_API, CARRERA_API, TIPO_CURSO_API } from '@/config/constants';

export default {
  name: 'SilaboForm',
  props: {
    editingItem: Object
  },
  emits: ['save', 'cancel'],
  data() {
    return {
      loading: false,
      error: null,
      
      // Datos para los selects
      facultades: [],
      carreras: [],
      tiposCurso: [],
      
      // Formulario principal
      formData: this.editingItem ? { ...this.editingItem } : this.getEmptyForm()
    };
  },

  mounted() {
    this.fetchFacultades();
    this.fetchCarreras();
    this.fetchTiposCurso();
  },

  methods: {
    // Métodos para cargar datos de APIs
    async fetchFacultades() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(FACULTAD_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar facultades');
        this.facultades = await res.json();
      } catch (err) {
        this.error = err.message;
        console.error('Error cargando facultades:', err);
      }
    },

    async fetchCarreras() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(CARRERA_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar carreras');
        this.carreras = await res.json();
      } catch (err) {
        this.error = err.message;
        console.error('Error cargando carreras:', err);
      }
    },

    async fetchTiposCurso() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(TIPO_CURSO_API.LIST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Error al cargar tipos de curso');
        this.tiposCurso = await res.json();
      } catch (err) {
        this.error = err.message;
        console.error('Error cargando tipos de curso:', err);
      }
    },

    // Estructura del formulario vacío
    getEmptyForm() {
      return {
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
        unidades: [],
        actividades_rsu: '',
        criterios: []
      };
    },

    // Métodos para manejar unidades
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
    
    removeUnidad(idx) {
      if (confirm('¿Está seguro de eliminar esta unidad?')) {
        this.formData.unidades.splice(idx, 1);
      }
    },

    // Métodos para manejar criterios
    addCriterio() {
      this.formData.criterios.push({ 
        evaluacion: '', 
        peso: null, 
        fecha: '', 
        descripcion: '' 
      });
    },
    
    removeCriterio(idx) {
      if (confirm('¿Está seguro de eliminar este criterio?')) {
        this.formData.criterios.splice(idx, 1);
      }
    },

    // Validación del formulario
    validateForm() {
      const errors = [];
      
      // Validaciones obligatorias
      if (!this.formData.facultad) errors.push('Facultad es obligatoria');
      if (!this.formData.semestre) errors.push('Semestre es obligatorio');
      if (!this.formData.area_formacion) errors.push('Área de formación es obligatoria');
      if (!this.formData.tipo_curso) errors.push('Tipo de curso es obligatorio');
      if (!this.formData.carrera_profesional) errors.push('Carrera profesional es obligatoria');
      if (!this.formData.nro_creditos) errors.push('Número de créditos es obligatorio');
      if (!this.formData.periodo) errors.push('Periodo lectivo es obligatorio');
      if (!this.formData.horas_teoria) errors.push('Horas de teoría es obligatorio');
      if (!this.formData.horas_practica) errors.push('Horas de práctica es obligatorio');
      if (!this.formData.codigo_curso) errors.push('Código del curso es obligatorio');
      if (!this.formData.docente) errors.push('Docente responsable es obligatorio');
      if (!this.formData.correo_docente) errors.push('Correo institucional es obligatorio');
      
      // Validar email
      if (this.formData.correo_docente && !this.isValidEmail(this.formData.correo_docente)) {
        errors.push('El correo electrónico no es válido');
      }

      // Validar que la suma de pesos de criterios no exceda 100%
      if (this.formData.criterios.length > 0) {
        const totalPeso = this.formData.criterios.reduce((sum, crit) => sum + (crit.peso || 0), 0);
        if (totalPeso > 100) {
          errors.push('La suma de los pesos de evaluación no puede exceder 100%');
        }
      }

      return errors;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // Envío del formulario
    async submitForm() {
      // Validar antes de enviar
      const errors = this.validateForm();
      if (errors.length > 0) {
        this.error = errors.join(', ');
        return;
      }

      this.loading = true;
      this.error = null;

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

        const result = await res.json();
        this.$emit('save', result);
        
      } catch (err) {
        this.error = err.message;
        console.error('Error guardando sílabo:', err);
      } finally {
        this.loading = false;
      }
    },

    // Cancelar formulario
    cancelForm() {
      if (this.hasChanges()) {
        if (confirm('¿Está seguro de cancelar? Se perderán los cambios no guardados.')) {
          this.$emit('cancel');
        }
      } else {
        this.$emit('cancel');
      }
    },

    // Verificar si hay cambios no guardados
    hasChanges() {
      if (!this.editingItem) {
        // Si es nuevo, verificar si hay algún campo con datos
        const emptyForm = this.getEmptyForm();
        return JSON.stringify(this.formData) !== JSON.stringify(emptyForm);
      } else {
        // Si es edición, comparar con datos originales
        return JSON.stringify(this.formData) !== JSON.stringify(this.editingItem);
      }
    },

    // Resetear formulario
    resetForm() {
      this.formData = this.editingItem ? { ...this.editingItem } : this.getEmptyForm();
      this.error = null;
    }
  }
};