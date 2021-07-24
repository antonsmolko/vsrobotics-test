import axios from '../plugins/axios';
import { booksPath } from "../routes";

export const getBooks = () => axios.get(booksPath())
export const createBook = (book) => axios.post(booksPath(), { book })
