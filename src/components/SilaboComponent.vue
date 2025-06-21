<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Silabos</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">Nuevo Silabo</button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Silabo' : 'Nuevo Silabo' }}</h3>
        <form @submit.prevent="submitForm">

          <!-- ID (solo en edición si es necesario mostrar) -->
          <div class="form-group" v-if="editingItem">
            <label>ID</label>
            <input v-model="formData.id" disabled class="form-input" />
          </div>

          <div class="form-group">
            <label>Periodo *</label>
            <input v-model="formData.periodo" required class="form-input" />
          </div>

          <!-- Campos relacionados -->
          <div
            class="form-group"
            v-for="(label, field) in camposRelacionados"
            :key="field"
          >
            <label>{{ label }} *</label>
            <select v-model="formData[field]" required class="form-input">
              <option disabled value="">Seleccione {{ label.toLowerCase() }}</option>
              <option v-for="item in entidades[field]" :key="item.id" :value="item.id">
                {{ item.nombre || ('ID: ' + item.id) }}
              </option>
            </select>
          </div>

          <!-- Activo -->
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

    <!-- Tabla -->
    <div class="data-table">
      <div v-if="loading && !silabos.length" class="loading">Cargando silabos...</div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchSilabos" class="btn btn-secondary">Reintentar</button>
      </div>
      <div v-else-if="!paginatedSilabos.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron silabos' : 'No hay silabos registrados' }}
      </div>
      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Periodo</th>
              <th>Profesor</th>
              <th>Facultad</th>
              <th>Carrera</th>
              <th>Curso</th>
              <th>Activo</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="silabo in paginatedSilabos" :key="silabo.id">
              <td>{{ silabo.id }}</td>
              <td>{{ silabo.periodo }}</td>
              <td>{{ silabo.profesor_detalle?.nombre || 'N/A' }}</td>
              <td>{{ silabo.facultad_detalle?.nombre || 'N/A' }}</td>
              <td>{{ silabo.carrera_detalle?.nombre || 'N/A' }}</td>
              <td>{{ silabo.curso_detalle?.nombre || 'N/A' }}</td>
              <td>{{ silabo.activo ? 'Activo' : 'Inactivo' }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="editItem(silabo)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(silabo)" class="btn btn-sm btn-danger">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="pagination-container">
      <div class="pagination">
        <button @click="goToPage(1)" :disabled="currentPage === 1" class="btn btn-pagination">‹‹</button>
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="btn btn-pagination">‹</button>
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page !== '...'"
            @click="goToPage(page)"
            :class="['btn', 'btn-pagination', { active: page === currentPage }]"
          >{{ page }}</button>
          <span v-else class="pagination-dots">...</span>
        </template>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="btn btn-pagination">›</button>
        <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="btn btn-pagination">››</button>
      </div>
      <div class="pagination-controls">
        <select v-model="itemsPerPage" @change="changeItemsPerPage" class="items-per-page-select">
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
          <option value="50">50 por página</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import SilaboComponent from '@/scripts/silabo/logicaSilabo'

export default {
  ...SilaboComponent,
  data() {
    return {
      ...SilaboComponent.data(),
      camposRelacionados: {
        profesor_id: 'Profesor',
        facultad_id: 'Facultad',
        carrera_id: 'Carrera',
        curso_id: 'Curso',
        competencia_id: 'Competencia',
        perfil_id: 'Perfil',
        competencia_profesional_id: 'Competencia Profesional',
        sumilla_id: 'Sumilla',
        unidad_id: 'Unidad',
        actividad_id: 'Actividad',
        criterio_id: 'Criterio'
      }
    }
  }
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
