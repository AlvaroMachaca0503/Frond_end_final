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
import SemestrePlanComponent from '@/components/SemestrePlanComponent.vue'
import CursoComponent from '@/components/CursoComponent.vue'
import PerfilComponent from '@/components/PerfilComponent.vue'
import ProfesionComponent from '@/components/ProfesionComponent.vue'
import ProfesorComponent from '@/components/ProfesorComponent.vue'
import SumillaComponent from '@/components/SumillaComponent.vue'
import BibliografiaComponent from '@/components/BibliografiaComponent.vue'
import MetodologiaComponent from '@/components/MetodologiaComponent.vue'
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
  'competencia',
  'criterio',
  'area',
  'plan',
  'semestreplan',
  'curso',
  'perfil',
  'profesion',
  'profesor',
  'sumilla',
  'bibliografia',
  'metodologia',
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
    CompetenciaComponent,
    CriterioComponent,
    AreaComponent,
    PlanCurricularComponent,
    SemestrePlanComponent,
    CursoComponent,
    PerfilComponent,
    ProfesionComponent,
    ProfesorComponent,
    SumillaComponent,
    BibliografiaComponent,
    MetodologiaComponent,
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
        competencia: 'Gestión de competencias',
        criterio: 'Gestión de criterios',
        area: 'Gestión de areas',
        plan: 'Gestión plan curricular',
        semestreplan: 'Gestión de semestres del plan',
        curso: 'Gestión de curso',
        perfil: 'Gestión de perfiles',
        profesion: 'Gestión de profesiones',
        profesor: 'Gestión de profesores',
        sumilla: 'Gestión de sumillas',
        bibliografia: 'Gestión de bibliografías',
        metodologia: 'Gestión de metodologías',
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
