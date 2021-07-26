<template>
  <div id="app">
      <div class="container">
          <h2>Список жанров</h2>
          <genre-item
              v-for="genre in genres"
              :key="genre.id"
              :item="genre"
              v-model="expandedGenre"
          />
          <button
              v-if="genreWithLessOrEqual5Books.length"
              @click="createBookDialogOpen = true"
              type="button"
              class="btn btn-primary mt-4"
          >Добавить книгу</button>
      </div>
      <book-create-dialog v-model="createBookDialogOpen" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import GenreItem from './components/GenreItem';
import BookCreateDialog from "./components/BookCreateDialog";

export default {
    name: 'App',

    components: {
        GenreItem,
        BookCreateDialog,
    },

    data: () => ({
        expandedGenre: null,
        createBookDialogOpen: false,
        updateTimeoutDelay: 15000 * 60,
        updateTimeout: null
    }),

    computed: {
        ...mapGetters('books', [
            'genres',
            'genreWithLessOrEqual5Books'
        ])
    },

    async created () {
        try {
            await this.fetchBooks();
            this.updateBooks();
        } catch (e) {
            console.error(e);
        }
    },

    methods: {
        ...mapActions('books', [
            'fetchBooks'
        ]),

        updateBooks () {
            this.updateTimeout = setTimeout(async () => {
                clearTimeout(this.updateTimeout);

                await this.fetchBooks();

                this.updateBooks()
            }, this.updateTimeoutDelay)
        }
    }
}
</script>
