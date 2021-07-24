<template>
    <div class="genre-item card">
        <div ref="heading" class="genre-item__heading">
            <span class="genre-item__title">{{ item.name }}</span>
            <button
                @click="expand"
                type="button"
                class="genre-item__action btn btn-primary"
            >Список книг</button>
        </div>
        <div class="genre-item__collapse" :class="{ expanded }">
            <transition name="fade">
                <div v-if="expanded">
                    <hr>
                    <div class="genre-item__filter-bar row gy-2 justify-content-between mb-3">
                        <div class="col col-md-6">
                            <div class="input-group">
                                <span class="input-group-text"><search-icon /></span>
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Поиск по автору"
                                    v-model="query"
                                >
                            </div>
                        </div>

                        <div class="col col-auto d-flex align-items-center flex-md-row-reverse">
                            <div class="form-check form-switch ps-0 me-1 me-md-0">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    id="lastWeekAdded"
                                    v-model="lastWeekAddedEnable"
                                >
                            </div>
                            <label
                                class="form-check-label me-2 mb-0"
                                for="lastWeekAdded"
                            >Добавленные на этой неделе</label>
                        </div>
                    </div>
                    <div v-if="filteredBooks.length" class="row g-3">
                        <div
                            v-for="book in filteredBooks"
                            :key="book.id"
                            class="col-12 col-md-6 col-lg-4"
                        >
                            <book-item :item="book"/>
                        </div>
                    </div>
                    <div v-else>Нет данных удовлетворяющих поиску</div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import Fuse from 'fuse.js'
import VueScrollTo from 'vue-scrollto';
import _ from 'lodash';
import inLastWeekRange from "../helpers/inLastWeekRange";
import BookItem from "./BookItem";
import SearchIcon from "./icons/SearchIcon";

const debounce = _.debounce((fn) => fn(), 300);

const fuseOptions = {
    threshold: 0.3,
    distance: 10,
    keys: [
        'author_first_name',
        'author_mid_name',
        'author_last_name',
    ]
};

const scrollToOptions = {
    offset: -120,
    cancelable: true,
    force: true,
}

export default {
    name: "GenreItem",

    components: {
        BookItem,
        SearchIcon
    },

    model: {
        event: 'show',
        prop: 'model'
    },

    props: {
        item: {
            type: Object,
            required: true
        },
        model: {
            type: Number,
            default: null
        }
    },

    data: () => ({
        fuse: null,
        lastWeekAddedEnable: false,
        query: '',
    }),

    computed: {
        expanded () {
            return this.model === this.item.id
        },

        filteredBooks () {
            const query = this.query.trim();
            const fuseSearch = query
                ? this.fuse.search(query).map(({ item }) => item)
                : this.books;

            return this.lastWeekAddedEnable
                ? fuseSearch.filter(({ date_add }) => inLastWeekRange(date_add))
                : fuseSearch;
        },

        books () {
            return this.$store.getters['books/booksByGenre'](this.item);
        }
    },

    created () {
        this.fuse = new Fuse(this.books, fuseOptions);
    },

    methods: {
        expand () {
            const value = this.model === this.item.id ? null : this.item.id;

            if (value) {
                debounce(this.scrollTo)
            }

            this.$emit('show', value)
        },

        scrollTo () {
            VueScrollTo.scrollTo(this.$refs.heading, 400, scrollToOptions);
        }
    }
}
</script>
