import _ from 'lodash';

const genreSchema = ['id', 'name', 'books'].sort();
const booksSchema = ['id', 'title', 'date_add', 'author_last_name', 'author_first_name', 'author_mid_name'].sort();

const isValidSchema = (obj, schema) => {
    if (!_.isEqual(Object.keys(obj).sort(), schema)) {
        throw new Error('Невалидная структура полученных данных!')
    }

    return true;
}

const booksValid = (books) => books.every((book) => isValidSchema(book, booksSchema));

const genreValid = (genre) => isValidSchema(genre, genreSchema) && booksValid(genre.books);

export default (request) => request.every(genreValid);
