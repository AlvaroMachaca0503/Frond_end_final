<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Sílabos</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">Nuevo Sílabos</button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Sílabos' : 'Nuevo Sílabos' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Nombre *</label>
            <input v-model="formData.nombre" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Competencia del Curso</label>
            <textarea v-model="formData.competencia_curso" class="form-input"></textarea>
          </div>

          <div class="form-group">
            <label>Competencia del Perfil de Egreso</label>
            <textarea v-model="formData.competencia_perfil_egreso" class="form-input"></textarea>
          </div>

          <div class="form-group">
            <label>Competencia Profesional</label>
            <textarea v-model="formData.competencia_profesional" class="form-input"></textarea>
          </div>

          <div class="form-group">
            <label>Sumilla</label>
            <textarea v-model="formData.sumilla" class="form-input"></textarea>
          </div>

          <div class="highlight-box">
            <div class="form-group">
              <label>Periodo Lectivo *</label>
              <select v-model="formData.periodo_lectivo" required class="form-input">
                <option disabled value="">Seleccione un periodo</option>
                <option v-for="p in periodosLectivos" :key="p.id" :value="p.id">
                  {{ p.periodo }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Profesor *</label>
              <select v-model="formData.profesor" required class="form-input">
                <option disabled value="">Seleccione un profesor</option>
                <option v-for="p in profesores" :key="p.id" :value="p.id">
                  {{ p.persona.nombre }} {{ p.persona.apellido_paterno }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Facultad *</label>
              <select v-model="formData.facultad" required class="form-input">
                <option disabled value="">Seleccione una facultad</option>
                <option v-for="f in facultades" :key="f.id" :value="f.id">
                  {{ f.nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Carrera *</label>
              <select v-model="formData.carrera" required class="form-input">
                <option disabled value="">Seleccione una carrera</option>
                <option v-for="c in carreras" :key="c.id" :value="c.id">
                  {{ c.nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Curso *</label>
              <select v-model="formData.curso" required class="form-input">
                <option disabled value="">Seleccione un curso</option>
                <option v-for="c in cursos" :key="c.id" :value="c.id">
                  {{ c.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="formData.activo" />
              Activo
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Tabla de sílabos -->
    <div class="data-table">
      <div v-if="loading && !silabos.length" class="loading">Cargando sílabos...</div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchSilabos" class="btn btn-secondary">Reintentar</button>
      </div>
      <div v-else-if="!paginatedSilabos.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron sílabos' : 'No hay sílabos registrados' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Curso</th>
              <th>Profesor</th>
              <th>Periodo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in paginatedSilabos" :key="s.id">
              <td>{{ s.id }}</td>
              <td>{{ s.nombre }}</td>
              <td>{{ s.curso_detalle?.nombre || 'N/A' }}</td>
              <td>{{ s.profesor_detalle?.persona?.nombre || 'N/A' }}</td>
              <td>{{ s.periodo_lectivo_detalle?.periodo || 'N/A' }}</td>
              <td>{{ s.activo ? 'Activo' : 'Inactivo' }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="editItem(s)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(s)" class="btn btn-sm btn-danger">Eliminar</button>
                  <button @click="goToDetail(s.id)" class="btn btn-sm btn-info" title="Ver Detalle">
                    👁️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import SilaboComponent from '@/scripts/silabo/logicaSilabo'
export default {
  ...SilaboComponent,
  methods: {
    ...SilaboComponent.methods,
    goToDetail(id) {
      this.$router.push({ name: 'SilaboDetalle', params: { id } });
    }
  }
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
