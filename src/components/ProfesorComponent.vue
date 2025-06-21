<template>
  <div class="general-component">
    <div class="component-header">
      <h2>Gestión de Profesores</h2>
      <button @click="showCreateForm = true" class="btn btn-primary">
        Nuevo Profesor
      </button>
    </div>

    <!-- Formulario de creación/edición -->
    <div v-if="showCreateForm || editingItem" class="form-modal">
      <div class="form-overlay" @click="cancelForm"></div>
      <div class="form-content">
        <h3>{{ editingItem ? 'Editar Profesor' : 'Nuevo Profesor' }}</h3>

        <form @submit.prevent="submitForm">
          <!-- Datos de Usuario -->
          <div class="form-group">
            <label for="username">Usuario *</label>
            <input v-model="formData.usuario.username" id="username" type="text" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="password">
              Contraseña <span v-if="!editingItem">*</span>
              <small v-if="editingItem">(dejar en blanco para no cambiar)</small>
            </label>
            <input
              v-model="formData.usuario.password"
              id="password"
              type="password"
              :required="!editingItem"
              class="form-input"
              placeholder="••••••••"
            />
          </div>

          <div class="form-group">
            <label for="first_name">Nombres *</label>
            <input v-model="formData.usuario.first_name" id="first_name" type="text" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="last_name">Apellidos *</label>
            <input v-model="formData.usuario.last_name" id="last_name" type="text" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="email">Correo *</label>
            <input v-model="formData.usuario.email" id="email" type="email" required class="form-input" />
          </div>

          <!-- Datos del Profesor -->
          <div class="form-group">
            <label for="dni">DNI *</label>
            <input v-model="formData.dni" id="dni" type="text" maxlength="8" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="genero">Género *</label>
            <select v-model="formData.genero" id="genero" required class="form-input">
              <option disabled value="">Seleccione género</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <div class="form-group">
            <label for="fecha_nacimiento">Fecha de Nacimiento *</label>
            <input v-model="formData.fecha_nacimiento" id="fecha_nacimiento" type="date" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="nacionalidad">Nacionalidad *</label>
            <input v-model="formData.nacionalidad" id="nacionalidad" type="text" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="telefono">Teléfono</label>
            <input v-model="formData.telefono" id="telefono" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label for="profesion_id">Profesión *</label>
            <select v-model="formData.profesion_id" id="profesion_id" required class="form-input">
              <option disabled value="">Seleccione una profesión</option>
              <option v-for="profesion in profesiones" :key="profesion.id" :value="profesion.id">
                {{ profesion.nombre }}
              </option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelForm" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Crear') }}
            </button>
          </div>

          <div v-if="error" class="form-error">
            {{ error }}
          </div>
        </form>
      </div>
    </div>

    <!-- Lista de profesores -->
    <div class="data-table">
      <div v-if="loading && !profesores.length" class="loading">
        Cargando profesores...
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="fetchProfesores" class="btn btn-secondary">Reintentar</button>
      </div>
      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombres</th>
              <th>DNI</th>
              <th>Profesión</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="profesor in paginatedProfesores" :key="profesor.id">
              <td>{{ profesor.id }}</td>
              <td>{{ profesor.usuario.username }}</td>
              <td>{{ profesor.usuario.first_name }} {{ profesor.usuario.last_name }}</td>
              <td>{{ profesor.dni }}</td>
              <td>{{ profesor.profesion_detalle?.nombre || 'N/A' }}</td>
              <td>
                <button @click="editItem(profesor)" class="btn btn-sm btn-warning">Editar</button>
                <button @click="deleteItem(profesor)" class="btn btn-sm btn-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import ProfesorComponent from '@/scripts/profesor/logicaProfesor'

export default {
  ...ProfesorComponent
}
</script>

<style scoped>
@import '@/assets/global_design/general_component_design.css';

.form-error {
  color: red;
  margin-top: 10px;
  font-weight: bold;
}
</style>
