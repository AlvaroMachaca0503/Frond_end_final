<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Competencias</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nueva Competencia
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Competencia' : 'Nueva Competencia' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="tipo">Tipo *</label>
            <input
              id="tipo"
              v-model="formData.tipo"
              type="text"
              class="form-input"
              required
              placeholder="Ingrese el tipo de competencia"
            />
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              v-model="formData.descripcion"
              class="form-input"
              rows="4"
              required
              placeholder="Ingrese la descripción de la competencia"
            ></textarea>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="formData.activo" />
              Activa
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Información de paginación y búsqueda -->
    <div class="table-controls">
      <div class="search-container">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar competencias..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Lista de competencias -->
    <div class="data-table">
      <div v-if="loading && !competencias.length" class="loading">
        Cargando competencias...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchCompetencias" class="btn btn-secondary">Reintentar</button>
      </div>

      <div v-else-if="!paginatedCompetencias.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron competencias que coincidan con la búsqueda' : 'No hay competencias registradas' }}
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="competencia in paginatedCompetencias" :key="competencia.id">
              <td class="text-content id-column">{{ competencia.id }}</td>
              <td class="text-content">{{ competencia.tipo }}</td>
              <td class="descripcion-cell text-content">
                <div class="descripcion-content">{{ competencia.descripcion }}</div>
              </td>
              <td class="text-content">
                <span :class="competencia.activo ? 'text-success' : 'text-muted'">
                  {{ competencia.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button @click="editItem(competencia)" class="btn btn-sm btn-warning">
                    Editar
                  </button>
                  <button @click="deleteItem(competencia)" class="btn btn-sm btn-danger">
                    Eliminar
                  </button>
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
import CompetenciaComponent from '@/scripts/competencia/logicaCompetencia'

export default {
  ...CompetenciaComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';
</style>
