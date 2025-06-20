<template>
  <div class="dashboard-container">
    <!-- Menú lateral -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <h3 v-if="!sidebarCollapsed" class="h5 mb-0">Mi App</h3>
        <button @click="toggleSidebar" class="btn btn-link text-white p-1">
          <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <ul class="nav flex-column">
          <!-- Dashboard -->
          <li class="nav-item">
            <a href="#" @click="setActiveSection('dashboard')" 
               class="nav-link" :class="{ active: activeSection === 'dashboard' }">
              <i class="fas fa-tachometer-alt sidebar-icon"></i>
              <span v-if="!sidebarCollapsed" class="sidebar-text">Dashboard</span>
            </a>
          </li>

          <!-- Tablas Maestras con submenú -->
          <li class="nav-item">
            <a href="#" @click="toggleSubMenu('tablasMaestras')" 
               class="nav-link d-flex justify-content-between align-items-center"
               :class="{ active: isParentActive('tablasMaestras') }">
              <div>
                <i class="fas fa-database sidebar-icon"></i>
                <span v-if="!sidebarCollapsed" class="sidebar-text">Tablas Maestras</span>
              </div>
              <i v-if="!sidebarCollapsed" 
                 :class="subMenus.tablasMaestras ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"
                 class="submenu-arrow"></i>
            </a>
            
            <!-- Submenú de Tablas Maestras -->
            <div v-if="subMenus.tablasMaestras && !sidebarCollapsed" class="submenu">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('estudiantes')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'estudiantes' }">
                    <i class="fas fa-user-graduate sidebar-icon"></i>
                    <span class="sidebar-text">Estudiantes</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('actividad')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'actividad' }">
                    <i class="fas fa-clipboard-list sidebar-icon"></i>
                    <span class="sidebar-text">Actividades</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('universidad')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'universidad' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Universidad</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('facultad')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'facultad' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Facultad</span>
                  </a>
                </li>
                <li class="nav-item">
                  <a href="#" @click="setActiveSection('departamento')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'departamento' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Departamento</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a href="#" @click="setActiveSection('carrera')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'carrera' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Carrera</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a href="#" @click="setActiveSection('competencia')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'competencia' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Competencia</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a href="#" @click="setActiveSection('criterio')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'criterio' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Criterio</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a href="#" @click="setActiveSection('area')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'area' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Area</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a href="#" @click="setActiveSection('plan')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'plan' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Plan Curricular</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a href="#" @click="setActiveSection('semestreplan')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'semestreplan' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Plan de Semestre</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a href="#" @click="setActiveSection('curso')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'curso' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Cursos</span>
                  </a>
                </li>

                <li class="nav-item">
                  <a href="#" @click="setActiveSection('perfil')" 
                     class="nav-link submenu-link" :class="{ active: activeSection === 'perfil' }">
                    <i class="fas fa-university sidebar-icon"></i>
                    <span class="sidebar-text">Perfil de Egreso</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>

          <!-- Otros menús principales -->
          <li class="nav-item">
            <a href="#" @click="setActiveSection('reportes')" 
               class="nav-link" :class="{ active: activeSection === 'reportes' }">
              <i class="fas fa-chart-bar sidebar-icon"></i>
              <span v-if="!sidebarCollapsed" class="sidebar-text">Reportes</span>
            </a>
          </li>

          <li class="nav-item">
            <a href="#" @click="setActiveSection('configuracion')" 
               class="nav-link" :class="{ active: activeSection === 'configuracion' }">
              <i class="fas fa-cog sidebar-icon"></i>
              <span v-if="!sidebarCollapsed" class="sidebar-text">Configuración</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn btn-outline-danger btn-sm w-100">
          <i class="fas fa-sign-out-alt sidebar-icon"></i>
          <span v-if="!sidebarCollapsed" class="sidebar-text">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <header class="main-header bg-white shadow-sm">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0 text-primary">{{ getSectionTitle() }}</h1>
          <div class="user-info d-flex align-items-center">
            <i class="fas fa-user-circle fa-2x text-muted me-2"></i>
            <div class="user-details">
              <small class="text-muted d-block">Bienvenido,</small>
              <strong>Usuario Admin</strong>
            </div>
          </div>
        </div>
      </header>

      <div class="content-area">
        <!-- Dashboard -->
        <div v-if="activeSection === 'dashboard'" class="section">
          <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-primary mb-1">
                        Total Estudiantes
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">1,234</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-user-graduate fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-success mb-1">
                        Actividades Activas
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">45</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-info mb-1">
                        Universidades
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">12</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-university fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-warning mb-1">
                        Tareas Pendientes
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">23</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Gráfico de ejemplo -->
          <div class="row">
            <div class="col-lg-8">
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <h6 class="m-0 font-weight-bold text-primary">
                    <i class="fas fa-chart-area me-2"></i>
                    Registro de Estudiantes por Mes
                  </h6>
                </div>
                <div class="card-body">
                  <div class="chart-area">
                    <div class="text-center py-5">
                      <i class="fas fa-chart-line fa-3x text-muted mb-3"></i>
                      <p class="text-muted">Gráfico de registro de estudiantes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4">
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <h6 class="m-0 font-weight-bold text-primary">
                    <i class="fas fa-tasks me-2"></i>
                    Actividades Recientes
                  </h6>
                </div>
                <div class="card-body">
                  <div class="list-group list-group-flush">
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <i class="fas fa-plus-circle text-success me-2"></i>
                        Nuevo estudiante registrado
                      </div>
                      <small class="text-muted">2h</small>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <i class="fas fa-edit text-warning me-2"></i>
                        Actividad modificada
                      </div>
                      <small class="text-muted">4h</small>
                    </div>
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <i class="fas fa-university text-info me-2"></i>
                        Nueva universidad agregada
                      </div>
                      <small class="text-muted">1d</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estudiantes -->
        <div v-if="activeSection === 'estudiantes'" class="section">
          <EstudiantesComponent />
        </div>

        <!-- Actividades -->
        <div v-if="activeSection === 'actividad'" class="section">
          <ActividadComponent />
        </div>

        <!-- Universidad -->
        <div v-if="activeSection === 'universidad'" class="section">
          <UniversidadComponent />
        </div>

        <!-- Facultades -->
        <div v-if="activeSection === 'facultad'" class="section">
          <FacultadComponent />
        </div>

        <!-- Departamento -->
        <div v-if="activeSection === 'departamento'" class="section">
          <DepartamentoComponent />
        </div>

        <div v-if="activeSection === 'carrera'" class="section">
          <CarreraComponent />
        </div>

        <div v-if="activeSection === 'competencia'" class="section">
          <CompetenciaComponent />
        </div>

        <div v-if="activeSection === 'criterio'" class="section">
          <CriterioComponent />
        </div>

        <div v-if="activeSection === 'area'" class="section">
          <AreaComponent />
        </div>

        <div v-if="activeSection === 'plan'" class="section">
          <PlanCurricularComponent />
        </div>

        <div v-if="activeSection === 'semestreplan'" class="section">
          <SemestrePlanComponent />
        </div>

        <div v-if="activeSection === 'curso'" class="section">
          <CursoComponent />
        </div>

        <div v-if="activeSection === 'perfil'" class="section">
          <PerfilComponent />
        </div>

        <!-- Reportes -->
        <div v-if="activeSection === 'reportes'" class="section">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">
              <i class="fas fa-chart-bar text-warning me-2"></i>
              Reportes del Sistema
            </h4>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">
                    <i class="fas fa-file-pdf text-danger me-2"></i>
                    Reporte de Estudiantes
                  </h5>
                  <p class="card-text">Generar reporte completo de estudiantes registrados</p>
                  <button class="btn btn-danger">
                    <i class="fas fa-download me-2"></i>
                    Descargar PDF
                  </button>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">
                    <i class="fas fa-file-excel text-success me-2"></i>
                    Reporte de Actividades
                  </h5>
                  <p class="card-text">Exportar datos de actividades a Excel</p>
                  <button class="btn btn-success">
                    <i class="fas fa-download me-2"></i>
                    Descargar Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuración -->
        <div v-if="activeSection === 'configuracion'" class="section">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="mb-0">
              <i class="fas fa-cog text-secondary me-2"></i>
              Configuración del Sistema
            </h4>
          </div>
          <div class="row">
            <div class="col-md-8">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">
                    <i class="fas fa-user-cog me-2"></i>
                    Configuración de Usuario
                  </h5>
                </div>
                <div class="card-body">
                  <form>
                    <div class="mb-3">
                      <label class="form-label">Nombre de usuario</label>
                      <input type="text" class="form-control" value="Admin Usuario">
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" value="admin@example.com">
                    </div>
                    <div class="mb-3">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="notifications">
                        <label class="form-check-label" for="notifications">
                          Recibir notificaciones por email
                        </label>
                      </div>
                    </div>
                    <button class="btn btn-primary">
                      <i class="fas fa-save me-2"></i>
                      Guardar Cambios
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Dashboard from '@/scripts/dashboard/logicaDashboard'
import SemestrePlanComponent from './SemestrePlanComponent.vue';

export default {
  ...Dashboard
}
</script>

<style>
@import '@/assets/dashboard/global.css';
</style>

<style scoped>
@import '@/assets/dashboard/particular.css';
</style>