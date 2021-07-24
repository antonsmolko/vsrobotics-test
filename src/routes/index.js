const host = '';
const prefix = 'api/v1';

export const booksPath = () => [host, prefix, 'books'].join('/');
