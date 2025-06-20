<template>
  <div class="perfil-component">
    <div class="component-header">
      <h2>Gestión de Perfiles</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nuevo Perfil
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Perfil' : 'Nuevo Perfil' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="descripcion">Descripción *</label>
            <input
              id="descripcion"
              v-model="formData.descripcion"
              type="text"
              class="form-input"
              required
              placeholder="Ingrese la descripción del perfil"
            />
          </div>
          <div class="form-group">
            <label for="activo">¿Activo?</label>
            <input
              id="activo"
              v-model="formData.activo"
              type="checkbox"
              class="form-checkbox"
            />
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

    <!-- Controles de búsqueda y paginación -->
    <div class="table-controls">
      <div class="search-container">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar perfiles..."
          class="search-input"
          @input="handleSearch"
        />
      </div>
      <div class="pagination-info">
        Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ totalItems }} registros
      </div>
    </div>

    <!-- Tabla de perfiles -->
    <div class="data-table">
      <div v-if="loading && !perfiles.length" class="loading">
        Cargando perfiles...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchPerfiles" class="btn btn-secondary">Reintentar</button>
      </div>
      <div v-else-if="!paginatedPerfiles.length" class="empty-state">
        {{ searchTerm ? 'No se encontraron perfiles que coincidan con la búsqueda' : 'No hay perfiles registrados' }}
      </div>
      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Activo</th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="perfil in paginatedPerfiles" :key="perfil.id">
              <td class="text-content id-column">{{ perfil.id }}</td>
              <td class="text-content descripcion-column">{{ perfil.descripcion }}</td>
              <td class="text-content activo-column">{{ perfil.activo ? 'Sí' : 'No' }}</td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button @click="editItem(perfil)" class="btn btn-sm btn-warning">Editar</button>
                  <button @click="deleteItem(perfil)" class="btn btn-sm btn-danger">Eliminar</button>
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
            :class="['btn', 'btn-pagination', { 'active': page === currentPage }]"
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
import PerfilComponent from '@/scripts/perfil/logicaPerfil'

export default {
  ...PerfilComponent
}
</script>

<style scoped>
@import '@/assets/perfil/particular.css';
</style>
