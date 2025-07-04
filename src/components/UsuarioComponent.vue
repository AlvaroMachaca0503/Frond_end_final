<template>
  <div class="usuario-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">
        <i class="fas fa-user-cog text-primary me-2"></i>
        Configuración de Usuario
      </h4>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <!-- Información Personal -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-user text-info me-2"></i>
              Información Personal
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="guardarInformacionPersonal">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nombre *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="usuario.first_name"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Apellido *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="usuario.last_name"
                    required
                  >
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Email *</label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="usuario.email"
                  required
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Nombre de Usuario</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="usuario.username"
                  readonly
                >
                <small class="text-muted">El nombre de usuario no se puede cambiar</small>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="guardando">
                <i class="fas fa-save me-2"></i>
                {{ guardando ? 'Guardando...' : 'Guardar Información Personal' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Cambiar Contraseña -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-lock text-warning me-2"></i>
              Cambiar Contraseña
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="cambiarContraseña">
              <div class="mb-3">
                <label class="form-label">Contraseña Actual *</label>
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="password.actual"
                  required
                >
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nueva Contraseña *</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="password.nueva"
                    required
                    minlength="8"
                  >
                  <small class="text-muted">Mínimo 8 caracteres</small>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Confirmar Nueva Contraseña *</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="password.confirmar"
                    required
                  >
                </div>
              </div>
              <button type="submit" class="btn btn-warning" :disabled="guardando || !passwordsCoinciden">
                <i class="fas fa-key me-2"></i>
                {{ guardando ? 'Cambiando...' : 'Cambiar Contraseña' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Preferencias -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-cog text-success me-2"></i>
              Preferencias
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="guardarPreferencias">
              <div class="mb-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="notificacionesEmail"
                    v-model="preferencias.notificacionesEmail"
                  >
                  <label class="form-check-label" for="notificacionesEmail">
                    Recibir notificaciones por email
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="notificacionesSistema"
                    v-model="preferencias.notificacionesSistema"
                  >
                  <label class="form-check-label" for="notificacionesSistema">
                    Mostrar notificaciones del sistema
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="modoOscuro"
                    v-model="preferencias.modoOscuro"
                  >
                  <label class="form-check-label" for="modoOscuro">
                    Activar modo oscuro
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Idioma</label>
                <select class="form-select" v-model="preferencias.idioma">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Zona Horaria</label>
                <select class="form-select" v-model="preferencias.zonaHoraria">
                  <option value="America/Lima">Lima (GMT-5)</option>
                  <option value="America/New_York">Nueva York (GMT-5)</option>
                  <option value="Europe/Madrid">Madrid (GMT+1)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success" :disabled="guardando">
                <i class="fas fa-save me-2"></i>
                {{ guardando ? 'Guardando...' : 'Guardar Preferencias' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <!-- Perfil del Usuario -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-id-card text-info me-2"></i>
              Mi Perfil
            </h5>
          </div>
          <div class="card-body text-center">
            <div class="mb-3">
              <i class="fas fa-user-circle fa-4x text-primary"></i>
            </div>
            <h6 class="mb-1">{{ nombreCompleto }}</h6>
            <p class="text-muted mb-2">{{ usuario.email }}</p>
            <span class="badge bg-primary">{{ rolUsuario }}</span>
            
            <div class="border-top pt-3 mt-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Miembro desde:</span>
                <span class="fw-bold">{{ fechaRegistro }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Último acceso:</span>
                <span class="fw-bold">{{ ultimoAcceso }}</span>
              </div>
              <div class="d-flex justify-content-between">
                <span class="text-muted">Estado:</span>
                <span class="badge bg-success">Activo</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actividad Reciente -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-history text-warning me-2"></i>
              Actividad Reciente
            </h5>
          </div>
          <div class="card-body">
            <div class="list-group list-group-flush">
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <i class="fas fa-sign-in-alt text-success me-2"></i>
                  Inicio de sesión
                </div>
                <small class="text-muted">Hoy</small>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <i class="fas fa-edit text-warning me-2"></i>
                  Actualización de perfil
                </div>
                <small class="text-muted">Ayer</small>
              </div>
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <i class="fas fa-key text-info me-2"></i>
                  Cambio de contraseña
                </div>
                <small class="text-muted">Hace 3 días</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones de Cuenta -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-shield-alt text-danger me-2"></i>
              Seguridad de Cuenta
            </h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button class="btn btn-outline-info btn-sm" @click="activarAutenticacionDosFactores">
                <i class="fas fa-mobile-alt me-2"></i>
                Autenticación 2FA
              </button>
              <button class="btn btn-outline-warning btn-sm" @click="verSesionesActivas">
                <i class="fas fa-desktop me-2"></i>
                Sesiones Activas
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="exportarDatosPersonales">
                <i class="fas fa-download me-2"></i>
                Exportar Mis Datos
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
  name: 'UsuarioComponent',
  data() {
    return {
      guardando: false,
      usuario: {
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        rol: null
      },
      password: {
        actual: '',
        nueva: '',
        confirmar: ''
      },
      preferencias: {
        notificacionesEmail: true,
        notificacionesSistema: true,
        modoOscuro: false,
        idioma: 'es',
        zonaHoraria: 'America/Lima'
      }
    }
  },
  computed: {
    nombreCompleto() {
      return `${this.usuario.first_name} ${this.usuario.last_name}`.trim()
    },
    rolUsuario() {
      return this.usuario.rol ? this.usuario.rol.nombre : 'Usuario'
    },
    fechaRegistro() {
      return '01/01/2024'
    },
    ultimoAcceso() {
      return 'Hoy 10:30 AM'
    },
    passwordsCoinciden() {
      return this.password.nueva === this.password.confirmar && this.password.nueva.length >= 8
    }
  },
  async mounted() {
    await this.cargarDatosUsuario()
  },
  methods: {
    async cargarDatosUsuario() {
      try {
        // Aquí cargarías los datos del usuario desde el backend
        // Por ahora usamos datos de ejemplo
        this.usuario = {
          first_name: 'Juan',
          last_name: 'Pérez',
          email: 'juan.perez@example.com',
          username: 'juanperez',
          rol: { nombre: 'Administrador' }
        }
        this.preferencias = {
          notificacionesEmail: true,
          notificacionesSistema: true,
          modoOscuro: false,
          idioma: 'es',
          zonaHoraria: 'America/Lima'
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error)
      }
    },
    async guardarInformacionPersonal() {
      this.guardando = true
      try {
        // Aquí guardarías los datos en el backend
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
        this.$toast.success('Información personal guardada correctamente')
      } catch (error) {
        this.$toast.error('Error al guardar la información personal')
      } finally {
        this.guardando = false
      }
    },
    async cambiarContraseña() {
      if (!this.passwordsCoinciden) {
        this.$toast.error('Las contraseñas no coinciden')
        return
      }
      
      this.guardando = true
      try {
        // Aquí cambiarías la contraseña en el backend
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
        this.$toast.success('Contraseña cambiada correctamente')
        this.password = { actual: '', nueva: '', confirmar: '' }
      } catch (error) {
        this.$toast.error('Error al cambiar la contraseña')
      } finally {
        this.guardando = false
      }
    },
    async guardarPreferencias() {
      this.guardando = true
      try {
        // Aquí guardarías las preferencias en el backend
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
        this.$toast.success('Preferencias guardadas correctamente')
      } catch (error) {
        this.$toast.error('Error al guardar las preferencias')
      } finally {
        this.guardando = false
      }
    },
    activarAutenticacionDosFactores() {
      this.$toast.info('Funcionalidad de autenticación 2FA en desarrollo')
    },
    verSesionesActivas() {
      this.$toast.info('Funcionalidad de sesiones activas en desarrollo')
    },
    exportarDatosPersonales() {
      this.$toast.info('Funcionalidad de exportación en desarrollo')
    }
  }
}
</script>

<style scoped>
.usuario-container {
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

.list-group-item {
  border: none;
  padding: 0.5rem 0;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style> 