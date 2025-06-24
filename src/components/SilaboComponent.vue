<template>
  <div class="silabo-form">
    <!-- Encabezado mejorado -->
    <div class="form-header">
      <div class="header-content">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
        </div>
        <div>
          <h2 class="form-title">Gestión de Sílabos</h2>
          <p class="form-subtitle">{{ editingItem ? 'Editar sílabo existente' : 'Crear nuevo sílabo' }}</p>
        </div>
      </div>
      <button class="btn-close" @click="cancelForm">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Formulario principal -->
    <form @submit.prevent="submitForm" class="form-content">
      
      <!-- I. DATOS GENERALES -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-number">I</div>
          <h3 class="section-title">Datos Generales</h3>
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">Facultad</label>
            <select v-model="formData.facultad" class="form-select">
              <option value="">Seleccionar facultad</option>
              <option v-for="facultad in facultades" :key="facultad.id" :value="facultad.id">
                {{ facultad.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Semestre</label>
            <input v-model="formData.semestre" type="text" class="form-input" placeholder="VII">
          </div>

          <div class="form-group">
            <label class="form-label required">Área de formación</label>
            <input v-model="formData.area_formacion" type="text" class="form-input" placeholder="Ingeniería de software">
          </div>

          <div class="form-group">
            <label class="form-label required">Tipo de curso</label>
            <select v-model="formData.tipo_curso" class="form-select">
              <option value="">Seleccionar tipo</option>
              <option v-for="tipo in tiposCurso" :key="tipo.id" :value="tipo.id">
                {{ tipo.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">Carrera profesional</label>
            <select v-model="formData.carrera_profesional" class="form-select">
              <option value="">Seleccionar carrera</option>
              <option v-for="carrera in carreras" :key="carrera.id" :value="carrera.id">
                {{ carrera.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label required">N.º de créditos</label>
            <input v-model.number="formData.nro_creditos" type="number" min="0" class="form-input" placeholder="3">
          </div>

          <div class="form-group">
            <label class="form-label">Pre-requisito(s)</label>
            <input v-model="formData.prerrequisitos" type="text" class="form-input" placeholder="Compiladores">
          </div>

          <div class="form-group">
            <label class="form-label required">Periodo lectivo</label>
            <input v-model="formData.periodo" type="text" class="form-input" placeholder="2025-I">
          </div>

          <div class="form-group">
            <label class="form-label required">Horas de teoría</label>
            <input v-model.number="formData.horas_teoria" type="number" min="0" class="form-input" placeholder="3">
          </div>

          <div class="form-group">
            <label class="form-label required">Horas de práctica</label>
            <input v-model.number="formData.horas_practica" type="number" min="0" class="form-input" placeholder="2">
          </div>

          <div class="form-group">
            <label class="form-label required">Código del curso</label>
            <input v-model="formData.codigo_curso" type="text" class="form-input" placeholder="3.7.3.21">
          </div>

          <div class="form-group">
            <label class="form-label required">Docente responsable</label>
            <input v-model="formData.docente" type="text" class="form-input" placeholder="Nombre del docente">
          </div>

          <div class="form-group">
            <label class="form-label required">Correo institucional</label>
            <input v-model="formData.correo_docente" type="email" class="form-input" placeholder="docente@universidad.edu">
          </div>
        </div>
      </div>

      <!-- II. COMPETENCIA DEL CURSO -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-number">II</div>
          <h3 class="section-title">Competencia del Curso</h3>
        </div>
        <div class="form-group">
          <textarea v-model="formData.competencia_curso" class="form-textarea" rows="4" 
            placeholder="Describe la competencia principal que desarrollará el estudiante al completar este curso..."></textarea>
        </div>
      </div>

      <!-- III. COMPETENCIA DEL PERFIL DE EGRESO -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-number">III</div>
          <h3 class="section-title">Competencia del Perfil de Egreso</h3>
        </div>
        <div class="form-group">
          <textarea v-model="formData.competencia_perfil" class="form-textarea" rows="4" 
            placeholder="Describe cómo contribuye este curso al perfil de egreso del estudiante..."></textarea>
        </div>
      </div>

      <!-- IV. COMPETENCIAS PREVIAS -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-number">IV</div>
          <h3 class="section-title">Competencias Previas Necesarias</h3>
        </div>
        <div class="form-group">
          <textarea v-model="formData.competencias_previas" class="form-textarea" rows="3" 
            placeholder="Ej: Habilidades avanzadas de programación, conocimientos de estructuras de datos..."></textarea>
        </div>
      </div>

      <!-- V. SUMILLA -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-number">V</div>
          <h3 class="section-title">Sumilla</h3>
        </div>
        <div class="form-group">
          <textarea v-model="formData.sumilla" class="form-textarea" rows="4" 
            placeholder="Resumen ejecutivo del contenido y objetivos del curso..."></textarea>
        </div>
      </div>

      <!-- VI. UNIDADES DE APRENDIZAJE -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-number">VI</div>
          <h3 class="section-title">Unidades de Aprendizaje</h3>
          <button type="button" class="btn-add" @click="addUnidad">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Añadir Unidad
          </button>
        </div>

        <div v-if="formData.unidades.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
          </div>
          <p class="empty-text">No hay unidades de aprendizaje definidas</p>
          <p class="empty-subtext">Haz clic en "Añadir Unidad" para comenzar</p>
        </div>

        <div v-for="(unidad, idx) in formData.unidades" :key="idx" class="unidad-card">
          <div class="unidad-header">
            <h4 class="unidad-title">Unidad {{ idx + 1 }}</h4>
            <button type="button" class="btn-remove" @click="removeUnidad(idx)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
              </svg>
            </button>
          </div>
          
          <div class="unidad-content">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">Denominación</label>
                <input v-model="unidad.denominacion" type="text" class="form-input" placeholder="Nombre de la unidad">
              </div>
              <div class="form-group">
                <label class="form-label required">Semana(s)</label>
                <input v-model="unidad.semana" type="text" class="form-input" placeholder="11 de Marzo al 28 de Marzo">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Competencia específica</label>
              <textarea v-model="unidad.competencia" class="form-textarea" rows="2" 
                placeholder="Competencia específica de esta unidad..."></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Contenidos específicos</label>
              <textarea v-model="unidad.contenidos" class="form-textarea" rows="3" 
                placeholder="Lista los contenidos (Capítulo, tema, etc.)"></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Metodología</label>
              <textarea v-model="unidad.metodologia" class="form-textarea" rows="2" 
                placeholder="Metodología de enseñanza para esta unidad..."></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Fuentes de consulta</label>
              <textarea v-model="unidad.fuentes" class="form-textarea" rows="2" 
                placeholder="Bibliografía y fuentes de consulta..."></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- VII. ACTIVIDADES RSU -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-number">VII</div>
          <h3 class="section-title">Actividades (RSU)</h3>
        </div>
        <div class="form-group">
          <textarea v-model="formData.actividades_rsu" class="form-textarea" rows="3" 
            placeholder="Describe las actividades de responsabilidad social universitaria..."></textarea>
        </div>
      </div>

      <!-- VIII. CRITERIOS DE EVALUACIÓN -->
      <div class="section-card">
        <div class="section-header">
          <div class="section-number">VIII</div>
          <h3 class="section-title">Criterios de Evaluación</h3>
          <button type="button" class="btn-add" @click="addCriterio">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Añadir Criterio
          </button>
        </div>

        <div v-if="formData.criterios.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <p class="empty-text">No hay criterios de evaluación definidos</p>
          <p class="empty-subtext">Haz clic en "Añadir Criterio" para comenzar</p>
        </div>

        <div v-else class="criterios-table">
          <div class="table-header">
            <div class="table-cell">Evaluación</div>
            <div class="table-cell">Peso (%)</div>
            <div class="table-cell">Fecha</div>
            <div class="table-cell">Descripción</div>
            <div class="table-cell">Acción</div>
          </div>
          
          <div v-for="(crit, idx) in formData.criterios" :key="idx" class="table-row">
            <div class="table-cell">
              <input v-model="crit.evaluacion" type="text" class="form-input-sm" placeholder="Examen parcial">
            </div>
            <div class="table-cell">
              <input v-model.number="crit.peso" type="number" min="0" max="100" class="form-input-sm" placeholder="30">
            </div>
            <div class="table-cell">
              <input v-model="crit.fecha" type="date" class="form-input-sm">
            </div>
            <div class="table-cell">
              <input v-model="crit.descripcion" type="text" class="form-input-sm" placeholder="Descripción">
            </div>
            <div class="table-cell">
              <button type="button" class="btn-remove-sm" @click="removeCriterio(idx)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ACCIONES -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="cancelForm">
          Cancelar
        </button>
        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Guardando...' : (editingItem ? 'Actualizar Sílabo' : 'Crear Sílabo') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'SilaboForm',
  props: {
    editingItem: Object
  },
  emits: ['save', 'cancel'],
  setup (props, { emit }) {
    const loading = ref(false)
    
    const facultades = ref([
      { id: 1, nombre: 'Facultad de Ingeniería' },
      { id: 2, nombre: 'Facultad de Ciencias' },
      { id: 3, nombre: 'Facultad de Humanidades' }
    ])
    
    const carreras = ref([
      { id: 1, nombre: 'Ingeniería de Software' },
      { id: 2, nombre: 'Ingeniería de Sistemas' },
      { id: 3, nombre: 'Ingeniería Industrial' }
    ])

    const tiposCurso = [
      { id: 'obligatorio', nombre: 'Obligatorio' },
      { id: 'electivo', nombre: 'Electivo' }
    ]

    const formData = ref(props.editingItem ? { ...props.editingItem } : getEmptyForm())

    function getEmptyForm () {
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
      }
    }

    function addUnidad () {
      formData.value.unidades.push({
        denominacion: '',
        semana: '',
        competencia: '',
        contenidos: '',
        metodologia: '',
        fuentes: ''
      })
    }
    
    function removeUnidad (idx) {
      formData.value.unidades.splice(idx, 1)
    }

    function addCriterio () {
      formData.value.criterios.push({ 
        evaluacion: '', 
        peso: null, 
        fecha: '', 
        descripcion: '' 
      })
    }
    
    function removeCriterio (idx) {
      formData.value.criterios.splice(idx, 1)
    }

    function submitForm () {
      loading.value = true
      setTimeout(() => {
        emit('save', formData.value)
        loading.value = false
      }, 1000)
    }

    function cancelForm () {
      emit('cancel')
    }

    onMounted(async () => {
      try {
        console.log('Formulario montado correctamente')
      } catch (error) {
        console.error('Error cargando datos:', error)
      }
    })

    return {
      formData,
      facultades,
      carreras,
      loading,
      tiposCurso,
      addUnidad,
      removeUnidad,
      addCriterio,
      removeCriterio,
      submitForm,
      cancelForm
    }
  }
}
</script>

<style scoped>
.silabo-form {
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header */
.form-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  background: rgba(255, 255, 255, 0.2);
  padding: 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.form-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 4px 0 0 0;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

/* Form Content */
.form-content {
  padding: 32px;
  max-height: 80vh;
  overflow-y: auto;
}

/* Section Cards */
.section-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  transition: all 0.2s ease;
}

.section-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  justify-content: space-between;
}

.section-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  flex: 1;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* Form Groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-label.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 4px;
}

/* Form Inputs */
.form-input, .form-select, .form-textarea {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
  color: #374151; /* Agregar esta línea */
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input-sm {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  color: #374151; /* Agregar esta línea */
}

.form-input::placeholder, 
.form-select::placeholder, 
.form-textarea::placeholder,
.form-input-sm::placeholder {
  color: #9ca3af;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Buttons */
.btn-add {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-remove {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #fecaca;
}

.btn-remove-sm {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove-sm:hover {
  background: #fecaca;
}

/* Unidad Cards */
.unidad-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.unidad-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.unidad-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.unidad-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Criterios Table */
.criterios-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 80px 120px 1fr 60px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 80px 120px 1fr 60px;
  border-bottom: 1px solid #f3f4f6;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.table-header .table-cell {
  background: #f9fafb;
  font-weight: 600;
  color: #6b7280;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.empty-subtext {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 24px 0 0 0;
  border-top: 1px solid #e5e7eb;
  margin-top: 32px;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: white;
  color: #6b7280;
  border-color: #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

/* Loading Spinner */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .silabo-form {
    margin: 16px;
    border-radius: 12px;
  }
  
  .form-header {
    padding: 20px;
  }
  
  .form-content {
    padding: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .table-header, .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-cell {
    padding: 8px;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .criterios-table {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .table-header {
    display: none;
  }
  
  .table-row {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .table-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
  }
  
  .table-cell::before {
    content: attr(data-label);
    font-weight: 600;
    color: #6b7280;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}

/* Scroll Styling */
.form-content::-webkit-scrollbar {
  width: 6px;
}

.form-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.form-content::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.form-content::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Focus and Hover Effects */
.section-card:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.unidad-card:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Animation for adding/removing items */
.unidad-card, .table-row {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form validation styles */
.form-input:invalid, .form-select:invalid, .form-textarea:invalid {
  border-color: #ef4444;
}

.form-input:invalid:focus, .form-select:invalid:focus, .form-textarea:invalid:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Success state */
.form-input:valid, .form-select:valid, .form-textarea:valid {
  border-color: #10b981;
}

.form-input:valid:focus, .form-select:valid:focus, .form-textarea:valid:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

</style>