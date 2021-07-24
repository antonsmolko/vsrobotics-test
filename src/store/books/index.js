import { getBooks, createBook } from "../../api/books";
import { normalize, schema } from 'normalizr';
import genresRequestValidate from "../../helpers/genresRequestValidate";

const book = new schema.Entity('books');
const genre = new schema.Entity('genres', {
  books: [book]
});

const state = {
  genres: {},
  books: {},
}

const mutations = {
  FETCH_BOOKS: (state, payload) => {
    state.books = payload;
  },
  FETCH_GENRES: (state, payload) => {
    state.genres = payload;
  },
  ADD_BOOK: (state, payload) => {
    state.books[payload.id] = payload;
  },
  UPDATE_GENRE_BOOKS: (state, { genreId, book }) => {
    state.genres[genreId].books.push(book);
  }
}

const actions = {
  fetchBooks: async ({ commit }) => {
    const { data } = await getBooks();

    genresRequestValidate(data.genres);

    const { entities } = normalize(data, { genres: [genre] });
    const { books, genres } = entities;

    commit('FETCH_BOOKS', books);
    commit('FETCH_GENRES', genres);
  },

  createBook: async ({ commit }, payload) => {
    const { data } = await createBook(payload);
    commit('ADD_BOOK', data.book);
    commit('UPDATE_GENRE_BOOKS', { genreId: data.genre_id, book: data.book.id });
  }
}

const getters = {
  genres: (state) => Object.values(state.genres).filter(({ books }) => books.length),
  booksByGenre: (state) => ({ books }) => Object.values(state.books).filter((book) => books.includes(book.id)),
  genreWithLessOrEqual5Books: (state) => Object.values(state.genres).filter(({ books }) => books.length <= 5)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
