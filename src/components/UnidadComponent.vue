<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Unidades</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">Nueva Unidad</button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Unidad' : 'Nueva Unidad' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label>Inicio *</label>
            <input v-model="formData.inicio" type="date" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Final *</label>
            <input v-model="formData.final" type="date" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Descripción *</label>
            <textarea v-model="formData.descripcion" required class="form-input"></textarea>
          </div>

          <div class="form-group">
            <label>Bibliografía *</label>
            <select v-model="formData.bibliografia_id" required class="form-input">
              <option disabled value="">Seleccione una bibliografía</option>
              <option v-for="b in bibliografias" :key="b.id" :value="b.id">
                {{ b.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Metodología *</label>
            <select v-model="formData.metodologia_id" required class="form-input">
              <option disabled value="">Seleccione una metodología</option>
              <option v-for="m in metodologias" :key="m.id" :value="m.id">
                {{ m.tipo }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Semana *</label>
            <select v-model="formData.semana_id" required class="form-input">
              <option disabled value="">Seleccione una semana</option>
              <option v-for="s in semanas" :key="s.id" :value="s.id">
                Semana {{ s.numero }}
              </option>
            </select>
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

    <!-- Búsqueda y paginación -->
    <div class="table-controls">
      <div class="search-container">
        <input
          v-model="searchTerm"
          @input="handleSearch"
          class="search-input"
          placeholder="Buscar unidades..."
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ totalItems }}
      </div>
    </div>

    <!-- Tabla de unidades -->
    <div class="data-table">
      <div v-if="loading && !unidades.length" class="loading">
        Cargando unidades...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchUnidades" class="btn btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="!paginatedUnidades.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron unidades' : 'No hay unidades registradas' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Inicio</th>
              <th>Final</th>
              <th>Descripción</th>
              <th>Bibliografía</th>
              <th>Metodología</th>
              <th>Semana</th>
              <th>Activo</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="unidad in paginatedUnidades" :key="unidad.id">
              <td>{{ unidad.id }}</td>
              <td>{{ unidad.inicio }}</td>
              <td>{{ unidad.final }}</td>
              <td>{{ unidad.descripcion }}</td>
              <td>{{ unidad.bibliografia_detalle?.nombre || 'N/A' }}</td>
              <td>{{ unidad.metodologia_detalle?.tipo || 'N/A' }}</td>
              <td>{{ unidad.semana_detalle ? 'Semana ' + unidad.semana_detalle.numero : 'N/A' }}</td>
              <td>{{ unidad.activo ? 'Sí' : 'No' }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="editItem(unidad)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(unidad)" class="btn btn-sm btn-danger">Eliminar</button>
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
          >
            {{ page }}
          </button>
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
import UnidadComponent from '@/scripts/unidad/logicaUnidad'
export default {
  ...UnidadComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
