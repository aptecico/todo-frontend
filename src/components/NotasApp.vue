<template>
    <div class="card">
      <div class="card-header">  
        <h1>Mis Notas</h1>
      </div>
      <div class="card-body">
        <div class="notas-table">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th @click="sort('titulo')">
                  Título<span v-if="sortKey === 'titulo'" :class="{ 'asc': !sortOrder, 'desc': sortOrder }"></span>
                </th>
                <th @click="sort('descripcion')">
                  Descripción <span v-if="sortKey === 'descripcion'" :class="{ 'asc': !sortOrder, 'desc': sortOrder }"></span>
                </th>
                <th @click="sort('fecha_vencimiento')">
                  Fecha de vencimiento <span v-if="sortKey === 'fecha_vencimiento'" :class="{ 'asc': !sortOrder, 'desc': sortOrder }"></span>
                </th>
                <th @click="sort('etiqueta')">
                  Etiqueta
                  <span v-if="sortKey === 'etiqueta'" :class="{ 'asc': !sortOrder, 'desc': sortOrder }"></span>
                </th>
                <th>Usuario</th>
                <th>Imagen</th>
                <th>Acciones
                  <button class="btn btn-success mb-3" @click="openModal('new')">Nueva Nota</button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="note in sortedNotes" :key="note.id">
                <td>{{ note.titulo }}</td>
                <td>{{ note.descripcion }}</td>
                <td>{{ note.fecha_vencimiento }}</td>
                <td>{{ note.etiqueta }}</td>
                <td>{{ note.usuario_id }}</td>
                <td>
                  <img v-if="note.imagen" :src="getImageUrl(note.imagen)" alt="Imagen de la nota" style="max-width: 100px; max-height: 100px;" />
                </td>
                <td>
                  <button @click="openModal('edit', note)" class="btn btn-primary mr-4">Editar</button> &nbsp;&nbsp;
                  <button @click="deleteNote(note.id)" class="btn btn-danger">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Modal para nueva/editar nota -->
      <div class="modal fade" id="ModalNota" tabindex="-1" aria-labelledby="ModalNotaLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="ModalNotaLabel">{{ isEditing ? 'Editar Nota' : 'Nueva Nota' }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="isEditing ? updateNote() : createNote()">
                <div class="mb-3">
                  <label for="titulo" class="form-label">Título</label>
                  <input type="text" class="form-control" id="titulo"  v-model="currentNote.titulo" required>
                </div>
                <div class="mb-3">
                  <label for="descripcion" class="form-label">Descripción</label>
                  <textarea class="form-control" id="descripcion" v-model="currentNote.descripcion" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="fecha_vencimiento" class="form-label">Fecha de vencimiento</label>
                  <input type="date" class="form-control" id="fecha_vencimiento" v-model="currentNote.fecha_vencimiento">
                </div>
                <div class="mb-3">
                <label class="form-label" for="usuario_id">Usuario:</label>
                <select class="form-control" v-model="currentNote.usuario_id" required>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
                <div class="mb-3">
                  <label for="etiqueta" class="form-label">Etiqueta</label>
                  <input type="text" class="form-control" id="etiqueta" v-model="currentNote.etiqueta">
                </div>
                <div class="mb-3">
                  <label for="imagen" class="form-label">Imagen</label>
                  <input type="file" class="form-control" id="imagen" @change="handleImageUpload">
                </div>
                <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Nota' : 'Crear Nota' }}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Modal } from 'bootstrap'
  
  export default {
    name: 'NotasApp',
    data() {
      return {
        notes: [],
        users: [],
        currentNote: {
          id: null,
          titulo: '',
          descripcion: '',
          fecha_vencimiento: '',
          etiqueta: '',
          usuario_id:null,
          imagen: null,
        },
        modal: null,
        baseUrl:this.$baseUrl,
        isEditing: false,
        currentSort: 'titulo', // Columna por la cual se va a ordenar
        currentSortDir: 'asc'  
      };
    },
    computed: {
    sortedNotes() {
    return [...this.notes].sort((a, b) => {
      let modifier = this.currentSortDir === 'asc' ? 1 : -1;
      if (this.currentSort === 'fecha_vencimiento') {
        return new Date(a[this.currentSort]) - new Date(b[this.currentSort]) * modifier;
      }
      if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
      if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
      return 0;
    });
  }
  },
    methods: {
      sort(column) {
    if (this.currentSort === column) {
      this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = column;
      this.currentSortDir = 'asc';
    }
  },
  getImageUrl(imagePath) {
      // Asegúrate de poner la URL base de tu backend si las rutas son relativas
      
      return this.baseUrl + imagePath;
    },
      openModal(action, note = null) {
        this.isEditing = action === 'edit';
        if (this.isEditing && note) {
          this.currentNote = { ...note };
        } else {
          this.resetForm();
        }
        this.modal.show();
      },
      async getNotes() {
        try {
          const response = await this.$axios.get('/notas');
          
          this.notes = response.data.notes;
          this.users = response.data.users;
        } catch (error) {
          console.error('Error al obtener las notas:', error);
        }
      },
      async createNote() {
        const formData = this.prepareFormData();
        try {
          await this.$axios.post('/notas', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          this.getNotes();
          this.resetForm();
          this.modal.hide();
        } catch (error) {
          console.error('Error al crear la nota:', error);
        }
      },
      async updateNote() {
        const formData = this.prepareFormData();      
        formData.append('_method', 'PUT');
        console.log('formadata=',formData);
         try {
          await this.$axios.post(`/notas/${this.currentNote.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          this.getNotes();
          this.resetForm();
          this.modal.hide();
        } catch (error) {
          console.error('Error al actualizar la nota:', error);
          console.error('Error al actualizar la nota:', error.response ? error.response.data : error.message);
        }
      },
      prepareFormData() {
        const formData = new FormData();
        formData.append('titulo', this.currentNote.titulo);
        formData.append('descripcion', this.currentNote.descripcion);
        formData.append('fecha_vencimiento', this.currentNote.fecha_vencimiento);
        formData.append('etiqueta', this.currentNote.etiqueta);
        if (this.currentNote.imagen instanceof File) {
          formData.append('imagen', this.currentNote.imagen);
        }
        return formData;
      },
      handleImageUpload(event) {
        this.currentNote.imagen = event.target.files[0];
      },
      async deleteNote(id) {
        try {
          await this.$axios.delete(`/notas/${id}`);
          this.getNotes();
        } catch (error) {
          console.error('Error al eliminar la nota:', error);
        }
      },
      resetForm() {
        this.currentNote = {
          id: null,
          titulo: '',
          descripcion: '',
          fecha_vencimiento: '',
          etiqueta: '',
          imagen: null,
        };
      },
    },
    mounted() {
      this.getNotes();
      this.modal = new Modal(document.getElementById('ModalNota'));
      
    },
  }
  </script>
  <style scoped>
  .sort-icon {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 5px;
    vertical-align: middle;
  }
  
  .sort-icon.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #000;
  }
  
  .sort-icon.desc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #000;
  }
  
  th {
    cursor: pointer;
  }
  </style>