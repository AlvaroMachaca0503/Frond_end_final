<template>
  <div class="cuenta-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">
        <i class="fas fa-university text-primary me-2"></i>
        Configuración de Cuenta Institucional
      </h4>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <!-- Información General -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-info-circle text-info me-2"></i>
              Información General
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="guardarInformacionGeneral">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nombre de la Universidad *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="universidad.nombre"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Acrónimo</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="universidad.acronimo"
                    maxlength="10"
                  >
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea 
                  class="form-control" 
                  rows="3"
                  v-model="universidad.descripcion"
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Sitio Web</label>
                <input 
                  type="url" 
                  class="form-control" 
                  v-model="universidad.url"
                  placeholder="https://www.universidad.edu"
                >
              </div>
              <button type="submit" class="btn btn-primary" :disabled="guardando">
                <i class="fas fa-save me-2"></i>
                {{ guardando ? 'Guardando...' : 'Guardar Información General' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Información de Contacto -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-address-book text-success me-2"></i>
              Información de Contacto
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="guardarContacto">
              <div class="mb-3">
                <label class="form-label">Dirección *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="universidad.direccion"
                  required
                >
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Teléfono</label>
                  <input 
                    type="tel" 
                    class="form-control" 
                    v-model="contacto.telefono"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email de Contacto</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    v-model="contacto.email"
                  >
                </div>
              </div>
              <button type="submit" class="btn btn-success" :disabled="guardando">
                <i class="fas fa-save me-2"></i>
                {{ guardando ? 'Guardando...' : 'Guardar Contacto' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Configuración Académica -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-graduation-cap text-warning me-2"></i>
              Configuración Académica
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="guardarConfiguracionAcademica">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Año Académico Actual</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="configuracion.anioAcademico"
                    min="2020"
                    max="2030"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Semestre Actual</label>
                  <select class="form-select" v-model="configuracion.semestreActual">
                    <option value="1">Primer Semestre</option>
                    <option value="2">Segundo Semestre</option>
                    <option value="3">Verano</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Período Lectivo</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="configuracion.periodoLectivo"
                  placeholder="Ej: 2024-1"
                >
              </div>
              <button type="submit" class="btn btn-warning" :disabled="guardando">
                <i class="fas fa-save me-2"></i>
                {{ guardando ? 'Guardando...' : 'Guardar Configuración' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <!-- Resumen de la Universidad -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-eye text-info me-2"></i>
              Vista Previa
            </h5>
          </div>
          <div class="card-body">
            <div class="text-center mb-3">
              <i class="fas fa-university fa-3x text-primary"></i>
            </div>
            <h6 class="text-center mb-2">{{ universidad.nombre || 'Nombre de la Universidad' }}</h6>
            <p class="text-center text-muted small mb-3">
              {{ universidad.acronimo || 'ACRÓNIMO' }}
            </p>
            <div class="border-top pt-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Estado:</span>
                <span class="badge bg-success">Activa</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Facultades:</span>
                <span class="fw-bold">{{ estadisticas.facultades }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Carreras:</span>
                <span class="fw-bold">{{ estadisticas.carreras }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Estudiantes:</span>
                <span class="fw-bold">{{ estadisticas.estudiantes }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones Rápidas -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-bolt text-warning me-2"></i>
              Acciones Rápidas
            </h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button class="btn btn-outline-primary btn-sm" @click="exportarDatos">
                <i class="fas fa-download me-2"></i>
                Exportar Datos
              </button>
              <button class="btn btn-outline-info btn-sm" @click="hacerRespaldo">
                <i class="fas fa-cloud-upload-alt me-2"></i>
                Hacer Respaldo
              </button>
              <button class="btn btn-outline-warning btn-sm" @click="restaurarConfiguracion">
                <i class="fas fa-undo me-2"></i>
                Restaurar Configuración
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CuentaComponent',
  data() {
    return {
      guardando: false,
      universidad: {
        nombre: '',
        acronimo: '',
        descripcion: '',
        url: '',
        direccion: ''
      },
      contacto: {
        telefono: '',
        email: ''
      },
      configuracion: {
        anioAcademico: new Date().getFullYear(),
        semestreActual: '1',
        periodoLectivo: ''
      },
      estadisticas: {
        facultades: 0,
        carreras: 0,
        estudiantes: 0
      }
    }
  },
  async mounted() {
    await this.cargarDatos()
  },
  methods: {
    async cargarDatos() {
      try {
        // Aquí cargarías los datos de la universidad desde el backend
        // Por ahora usamos datos de ejemplo
        this.universidad = {
          nombre: 'Universidad Nacional',
          acronimo: 'UN',
          descripcion: 'Universidad pública de excelencia académica',
          url: 'http://www.universidad.edu',
          direccion: 'Av. Principal 123'
        }
        this.contacto = {
          telefono: '+51 1 234-5678',
          email: 'contacto@universidad.edu'
        }
        this.configuracion = {
          anioAcademico: 2024,
          semestreActual: '1',
          periodoLectivo: '2024-1'
        }
        this.estadisticas = {
          facultades: 5,
          carreras: 12,
          estudiantes: 1500
        }
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    },
    async guardarInformacionGeneral() {
      this.guardando = true
      try {
        // Aquí guardarías los datos en el backend
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
        this.$toast.success('Información general guardada correctamente')
      } catch (error) {
        this.$toast.error('Error al guardar la información general')
      } finally {
        this.guardando = false
      }
    },
    async guardarContacto() {
      this.guardando = true
      try {
        // Aquí guardarías los datos en el backend
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
        this.$toast.success('Información de contacto guardada correctamente')
      } catch (error) {
        this.$toast.error('Error al guardar la información de contacto')
      } finally {
        this.guardando = false
      }
    },
    async guardarConfiguracionAcademica() {
      this.guardando = true
      try {
        // Aquí guardarías los datos en el backend
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
        this.$toast.success('Configuración académica guardada correctamente')
      } catch (error) {
        this.$toast.error('Error al guardar la configuración académica')
      } finally {
        this.guardando = false
      }
    },
    exportarDatos() {
      // Implementar exportación de datos
      this.$toast.info('Funcionalidad de exportación en desarrollo')
    },
    hacerRespaldo() {
      // Implementar respaldo
      this.$toast.info('Funcionalidad de respaldo en desarrollo')
    },
    restaurarConfiguracion() {
      // Implementar restauración
      this.$toast.info('Funcionalidad de restauración en desarrollo')
    }
  }
}
</script>

<style scoped>
.cuenta-container {
  padding: 20px;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.form-label {
  font-weight: 600;
  color: #495057;
}

.btn {
  border-radius: 0.375rem;
}

.badge {
  font-size: 0.75em;
}

.text-muted {
  font-size: 0.875rem;
}

.fw-bold {
  font-weight: 600 !important;
}
</style> 