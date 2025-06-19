import EstudiantesComponent from '@/components/EstudiantesComponent.vue'
import ActividadComponent from '@/components/ActividadComponent.vue'
import UniversidadComponent from '@/components/UniversidadComponent.vue'
import FacultadComponent from '@/components/FacultadComponent.vue'
import DepartamentoComponent from '@/components/DepartamentoComponent.vue'
import CarreraComponent from '@/components/CarreraComponent.vue'
import CompetenciaComponent from '@/components/CompetenciaComponent.vue'
import CriterioComponent from '@/components/CriterioComponent.vue'
import AreaComponent from '@/components/AreaComponent.vue'
import PlanCurricularComponent from '@/components/PlanCurricularComponent.vue'

export default {
  name: 'Dashboard',
  components: {
    EstudiantesComponent,
    ActividadComponent,
    UniversidadComponent,
    FacultadComponent,
    DepartamentoComponent,
    CarreraComponent,
    CompetenciaComponent,
    CriterioComponent,
    AreaComponent,
    PlanCurricularComponent
  },
  data() {
    return {
      sidebarCollapsed: false,
      activeSection: 'dashboard',
      subMenus: {
        tablasMaestras: false
      }
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      if (this.sidebarCollapsed) {
        // Cerrar todos los submenús cuando se colapsa el sidebar
        Object.keys(this.subMenus).forEach(key => {
          this.subMenus[key] = false;
        });
      }
    },
    setActiveSection(section) {
      this.activeSection = section;
      
      // Si es una sección de tablas maestras, abrir el submenú
      if (['estudiantes', 'actividad', 'universidad', 'facultad', 'departamento', 'carrera', 'competencia', 'criterio', 'area', 'plan'].includes(section)) {
        this.subMenus.tablasMaestras = true;
      }
    },
    toggleSubMenu(menuKey) {
      if (!this.sidebarCollapsed) {
        this.subMenus[menuKey] = !this.subMenus[menuKey];
      }
    },
    isParentActive(parentKey) {
      if (parentKey === 'tablasMaestras') {
        return ['estudiantes', 'actividad', 'universidad', 'facultad', 'departamento', 'carrera', 'competencia', 'criterio', 'area', 'plan'].includes(this.activeSection);
      }
      return false;
    },
    getSectionTitle() {
      const titles = {
        dashboard: 'Dashboard Principal',
        estudiantes: 'Gestión de Estudiantes',
        actividad: 'Gestión de Actividades',
        universidad: 'Gestión de Universidades',
        facultades: 'Gestión de Facultades',
        departamento: 'Gestión de Departamentos',
        carrera: 'Gestión de carreras',
        competencia: 'Gestión de competencias',
        criterio: 'Gestión de criterios',
        area: 'Gestión de areas',
        plan: 'Gestión plan curricular',
        reportes: 'Reportes del Sistema',
        configuracion: 'Configuración'
      };
      return titles[this.activeSection] || 'Dashboard';
    },
    handleLogout() {
      // Emitir evento para notificar logout
      this.$emit('logout');
      
      // Opcional: redirect con router
      // this.$router.push('/login');
    }
  },
  mounted() {
    // Verificar si hay token al montar el componente
    // const token = localStorage.getItem('access_token');
    // if (!token) {
    //   this.$emit('logout');
    // }

    // Si la sección activa es parte de tablas maestras, abrir el submenú
    if (['estudiantes', 'actividad', 'universidad', 'facultad', 'departamento', 'carrera', 'competencia', 'criterio', 'area', 'plan'].includes(this.activeSection)) {
      this.subMenus.tablasMaestras = true;
    }
  }
}