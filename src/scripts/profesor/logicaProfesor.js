import { PROFESOR_API, PROFESION_API } from '@/config/constants';

export default {
    name: 'ProfesorComponent',
    data() {
        return {
            profesores: [],
            profesiones: [],
            loading: false,
            error: null,
            showCreateForm: false,
            editingItem: null,
            formData: {
                usuario: {
                    username: '',
                    password: '',
                    first_name: '',
                    last_name: '',
                    email: ''
                },
                profesion_id: '',
                dni: '',
                genero: '',
                fecha_nacimiento: '',
                nacionalidad: '',
                telefono: ''
            },
            currentPage: 1,
            itemsPerPage: 10,
            searchTerm: '',
            filteredProfesores: []
        };
    },
    computed: {
        totalItems() {
            return this.filteredProfesores.length;
        },
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },
        endIndex() {
            return Math.min(this.startIndex + this.itemsPerPage, this.totalItems);
        },
        paginatedProfesores() {
            return this.filteredProfesores.slice(this.startIndex, this.endIndex);
        },
        visiblePages() {
            const pages = [];
            const maxVisible = 5;
            if (this.totalPages <= maxVisible) {
                for (let i = 1; i <= this.totalPages; i++) pages.push(i);
            } else {
                const start = Math.max(1, this.currentPage - 2);
                const end = Math.min(this.totalPages, this.currentPage + 2);
                if (start > 1) {
                    pages.push(1);
                    if (start > 2) pages.push('...');
                }
                for (let i = start; i <= end; i++) pages.push(i);
                if (end < this.totalPages) {
                    if (end < this.totalPages - 1) pages.push('...');
                    pages.push(this.totalPages);
                }
            }
            return pages;
        }
    },
    watch: {
        profesores() {
            this.applyFilters();
        }
    },
    mounted() {
        this.fetchProfesores();
        this.fetchProfesiones();
    },
    methods: {
        formatErrors(errors, parentKey = '') {
            const messages = [];
            for (const [key, value] of Object.entries(errors)) {
                const fullKey = parentKey ? `${parentKey}.${key}` : key;
                if (Array.isArray(value)) {
                    messages.push(`${fullKey}: ${value.join(', ')}`);
                } else if (typeof value === 'object' && value !== null) {
                    messages.push(...this.formatErrors(value, fullKey));
                } else {
                    messages.push(`${fullKey}: ${String(value)}`);
                }
            }
            return messages;
        },

        async fetchProfesiones() {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(PROFESION_API.LIST, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Error al cargar profesiones');
                this.profesiones = await response.json();
            } catch (error) {
                this.error = error.message;
            }
        },

        async fetchProfesores() {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(PROFESOR_API.LIST, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Error al cargar profesores');
                this.profesores = await response.json();
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async submitForm() {
            this.loading = true;
            this.error = null;

            try {
                const token = localStorage.getItem('access_token');
                const isEditing = !!this.editingItem;
                const url = isEditing ? PROFESOR_API.DETAIL(this.editingItem.id) : PROFESOR_API.LIST;
                const method = isEditing ? 'PUT' : 'POST';

                const usuarioPayload = {
                    username: this.formData.usuario.username,
                    first_name: this.formData.usuario.first_name,
                    last_name: this.formData.usuario.last_name,
                    email: this.formData.usuario.email
                };

                if (!isEditing || this.formData.usuario.password.trim()) {
                    usuarioPayload.password = this.formData.usuario.password;
                }

                const payload = {
                    usuario: usuarioPayload,
                    profesion_id: parseInt(this.formData.profesion_id),
                    dni: this.formData.dni,
                    genero: this.formData.genero,
                    fecha_nacimiento: this.formData.fecha_nacimiento,
                    nacionalidad: this.formData.nacionalidad,
                    telefono: this.formData.telefono
                };

                const response = await fetch(url, {
                    method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(this.formatErrors(errorData).join('\n'));
                }

                await this.fetchProfesores();
                this.cancelForm();
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async deleteItem(profesor) {
            if (!confirm(`¿Está seguro de eliminar al profesor "${profesor.usuario.first_name} ${profesor.usuario.last_name}"?`)) return;

            this.loading = true;
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(PROFESOR_API.DETAIL(profesor.id), {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error('Error al eliminar el profesor');

                await this.fetchProfesores();
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        editItem(profesor) {
            this.editingItem = profesor;
            this.formData = {
                usuario: {
                    username: profesor.persona.usuario.username,
                    first_name: profesor.persona.usuario.first_name,
                    last_name: profesor.persona.usuario.last_name,
                    email: profesor.persona.usuario.email,
                    password: ''
                },
                profesion_id: profesor.profesion?.id || '',
                dni: profesor.persona.dni,
                genero: profesor.persona.genero,
                fecha_nacimiento: profesor.persona.fecha_nacimiento,
                nacionalidad: profesor.persona.nacionalidad,
                telefono: profesor.persona.telefono
            };
            this.showCreateForm = true;
        },

        cancelForm() {
            this.showCreateForm = false;
            this.editingItem = null;
            this.formData = {
                usuario: {
                    username: '',
                    password: '',
                    first_name: '',
                    last_name: '',
                    email: ''
                },
                profesion_id: '',
                dni: '',
                genero: '',
                fecha_nacimiento: '',
                nacionalidad: '',
                telefono: ''
            };
            this.error = null;
        },

        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },

        changeItemsPerPage() {
            this.currentPage = 1;
        },

        handleSearch() {
            this.currentPage = 1;
            this.applyFilters();
        },

        applyFilters() {
            if (!this.searchTerm.trim()) {
                this.filteredProfesores = [...this.profesores];
            } else {
                const term = this.searchTerm.toLowerCase();
                this.filteredProfesores = this.profesores.filter(prof =>
                    prof.usuario.username.toLowerCase().includes(term) ||
                    prof.usuario.first_name.toLowerCase().includes(term) ||
                    prof.usuario.last_name.toLowerCase().includes(term) ||
                    prof.dni.toLowerCase().includes(term) ||
                    (prof.profesion_detalle?.nombre || '').toLowerCase().includes(term)
                );
            }
        }
    }
};
