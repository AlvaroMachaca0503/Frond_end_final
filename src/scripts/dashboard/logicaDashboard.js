import EstudiantesComponent from '@/components/EstudiantesComponent.vue'
import ActividadComponent from '@/components/ActividadComponent.vue'
import UniversidadComponent from '@/components/UniversidadComponent.vue'
import FacultadComponent from '@/components/FacultadComponent.vue'
import DepartamentoComponent from '@/components/DepartamentoComponent.vue'
import CarreraComponent from '@/components/CarreraComponent.vue'
import CriterioComponent from '@/components/CriterioComponent.vue'
import AreaComponent from '@/components/AreaComponent.vue'
import PlanCurricularComponent from '@/components/PlanCurricularComponent.vue'
import SemestrePlanComponent from '@/components/SemestrePlanComponent.vue'
import CursoComponent from '@/components/CursoComponent.vue'
import PerfilComponent from '@/components/PerfilComponent.vue'
import ProfesionComponent from '@/components/ProfesionComponent.vue'
import ProfesorComponent from '@/components/ProfesorComponent.vue'
import BibliografiaComponent from '@/components/BibliografiaComponent.vue'
import SemanaComponent from '@/components/SemanaComponent.vue'
import UnidadComponent from '@/components/UnidadComponent.vue'
import SilaboComponent from '@/components/SilaboComponent.vue'

const TABLAS_MAESTRAS_SECTIONS = [
  'estudiantes',
  'actividad',
  'universidad',
  'facultad',
  'departamento',
  'carrera',
  'criterio',
  'area',
  'plan',
  'semestreplan',
  'curso',
  'perfil',
  'profesion',
  'profesor',
  'bibliografia',
  'semana',
  'unidad',
  'silabo'
];

export default {
  name: 'Dashboard',
  components: {
    EstudiantesComponent,
    ActividadComponent,
    UniversidadComponent,
    FacultadComponent,
    DepartamentoComponent,
    CarreraComponent,
    CriterioComponent,
    AreaComponent,
    PlanCurricularComponent,
    SemestrePlanComponent,
    CursoComponent,
    PerfilComponent,
    ProfesionComponent,
    ProfesorComponent,
    BibliografiaComponent,
    SemanaComponent,
    UnidadComponent,
    SilaboComponent
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
        Object.keys(this.subMenus).forEach(key => {
          this.subMenus[key] = false;
        });
      }
    },
    setActiveSection(section) {
      this.activeSection = section;
      if (TABLAS_MAESTRAS_SECTIONS.includes(section)) {
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
        return TABLAS_MAESTRAS_SECTIONS.includes(this.activeSection);
      }
      return false;
    },
    getSectionTitle() {
      const titles = {
        dashboard: 'Dashboard Principal',
        estudiantes: 'Gestión de Estudiantes',
        actividad: 'Gestión de Actividades',
        universidad: 'Gestión de Universidades',
        facultad: 'Gestión de Facultades',
        departamento: 'Gestión de Departamentos',
        carrera: 'Gestión de carreras',
        criterio: 'Gestión de criterios',
        area: 'Gestión de areas',
        plan: 'Gestión plan curricular',
        semestreplan: 'Gestión de semestres del plan',
        curso: 'Gestión de curso',
        perfil: 'Gestión de perfiles',
        profesion: 'Gestión de profesiones',
        profesor: 'Gestión de profesores',
        bibliografia: 'Gestión de bibliografías',
        semana: 'Gestión de semanas',
        unidad: 'Gestión de unidades',
        silabo: 'Gestión de silabos',
        reportes: 'Reportes del Sistema',
        configuracion: 'Configuración'
      };
      return titles[this.activeSection] || 'Dashboard';
    },
    handleLogout() {
      this.$emit('logout');
    }
  },
  mounted() {
    if (TABLAS_MAESTRAS_SECTIONS.includes(this.activeSection)) {
      this.subMenus.tablasMaestras = true;
    }
  }
};
