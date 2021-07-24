// @ts-check

import faker from 'faker';
import _ from 'lodash';

const getNextId = () => Number(_.uniqueId());

const generateGenres = (count) => Array(count).fill(0).map(() => (
    {
        id: getNextId(),
        name: faker.music.genre(),
        books: generateBooks(_.random(0, 8))
    }
));

const generateBooks = (count) => Array(count).fill(0).map(() => (
    {
        id: getNextId(),
        title: faker.lorem.sentence(),
        date_add: faker.date.recent(14),
        author_last_name: faker.name.lastName(),
        author_first_name: faker.name.firstName(),
        author_mid_name: faker.name.middleName(),
    }
));

const buildState = (defaultState) => {
    const state = {
        genres: generateGenres(9),
    };

    if (defaultState.books) {
        state.books.push(...defaultState.books);
    }

    return state;
};

export default (app, defaultState = {}) => {
    const state = buildState(defaultState);

    app.get('/api/v1/books', (req, reply) => {
        const { genres } = state;

        reply
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ genres });
    });

    app.post('/api/v1/books', (req, reply) => {
        const book = _.get(req, 'body.book');
        book.id = getNextId();
        book.date_add = _.now();

        const targetGenre = state.genres.find(({ id }) => id === book.genre_id);

        if (!targetGenre) {
            return reply
                .code(422)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send({ message: `Жанр с ID ${book.id} не найден`});
        }

        targetGenre.books.push(_.omit(book, 'genre_id'));

        reply
            .code(200)
            .header('Content-Type', 'application/json; charset=utf-8')
            .send({ genre_id: targetGenre.id, book });
    });
};
