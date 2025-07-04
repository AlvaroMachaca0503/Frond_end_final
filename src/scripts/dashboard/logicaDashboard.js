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
import ProfesionComponent from '@/components/ProfesionComponent.vue'
import ProfesorComponent from '@/components/ProfesorComponent.vue'
import BibliografiaComponent from '@/components/BibliografiaComponent.vue'
import SemanaComponent from '@/components/SemanaComponent.vue'
import UnidadComponent from '@/components/UnidadComponent.vue'
import SilaboComponent from '@/components/SilaboComponent.vue'
import CuentaComponent from '@/components/CuentaComponent.vue'
import UsuarioComponent from '@/components/UsuarioComponent.vue'

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
    ProfesionComponent,
    ProfesorComponent,
    BibliografiaComponent,
    SemanaComponent,
    UnidadComponent,
    SilaboComponent,
    CuentaComponent,
    UsuarioComponent
  },
  data() {
    return {
      sidebarCollapsed: false,
      activeSection: 'dashboard',
      subMenus: {
        tablasMaestras: false,
        configuracion: false
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
      if (['cuenta', 'usuario'].includes(section)) {
        this.subMenus.configuracion = true;
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
      if (parentKey === 'configuracion') {
        return ['cuenta', 'usuario'].includes(this.activeSection);
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
        profesion: 'Gestión de profesiones',
        profesor: 'Gestión de profesores',
        bibliografia: 'Gestión de bibliografías',
        semana: 'Gestión de semanas',
        unidad: 'Gestión de unidades',
        silabo: 'Gestión de silabos',
        reportes: 'Reportes del Sistema',
        cuenta: 'Configuración de Cuenta',
        usuario: 'Configuración de Usuario'
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
    if (['cuenta', 'usuario'].includes(this.activeSection)) {
      this.subMenus.configuracion = true;
    }
  }
};
