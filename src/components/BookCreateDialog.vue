<template>
    <modal
        v-model="isOpen"
        @open="init"
        title="Добавить книгу"
    >
        <template #body>
            <transition name="fade">
                <div v-if="processState === 'fulfilled'" class="modal-notify">
                    <h3 class="text-center">Книга успешно создана!</h3>
                </div>
            </transition>

            <transition name="fade">
                <div v-if="processState === 'failed'" class="modal-notify">
                    <h3 class="text-danger text-center">Произошла ошибка!<br> Повторите запрос позже</h3>
                </div>
            </transition>

            <ValidationObserver ref="observer" v-slot="{ validate, invalid }">
                <form @submit.prevent="validate({ silent: true }).then(send)">
                    <ValidationProvider v-slot="{ errors }" name="Жанр" rules="required">
                        <v-select
                            v-model="form.genre_id"
                            :options="genreWithLessOrEqual5Books"
                            option-label="name"
                            id="bookGenre"
                            label="Жанр"
                            placeholder="Выберите жанр"
                            :errors="errors"
                        />
                    </ValidationProvider>
                    <ValidationProvider v-slot="{ errors }" name="Название книги" rules="required">
                        <v-input
                            v-model="form.title"
                            id="bookTitle"
                            label="Название книги"
                            placeholder="Введите название книги"
                            :errors="errors"
                        />
                    </ValidationProvider>
                    <ValidationProvider v-slot="{ errors }" name="Фамилия автора" rules="required">
                        <v-input
                            v-model="form.author_last_name"
                            id="authorLastName"
                            label="Фамилия автора"
                            placeholder="Введите фамилию автора"
                            :errors="errors"
                        />
                    </ValidationProvider>
                    <ValidationProvider v-slot="{ errors }" name="Имя автора" rules="required">
                        <v-input
                            v-model="form.author_first_name"
                            id="authorFirstName"
                            label="Имя автора"
                            placeholder="Введите имя автора"
                            :errors="errors"
                        />
                    </ValidationProvider>
                    <ValidationProvider v-slot="{ errors }" name="Отчество автора" rules="required">
                        <v-input
                            v-model="form.author_mid_name"
                            id="authorMidName"
                            label="Отчество автора"
                            placeholder="Введите отчество автора"
                            :errors="errors"
                        />
                    </ValidationProvider>
                    <div class="d-flex flex-right w-100 mt-4">
                        <button
                            :disabled="invalid || processState === 'sending'"
                            class="btn btn-success me-1"
                            type="submit"
                        >Добавить</button>
                        <button
                            class="btn btn-danger"
                            type="button"
                            @click="cancel"
                            :disabled="processState === 'sending'"
                        >Отменить</button>
                    </div>
                </form>
            </ValidationObserver>
        </template>
    </modal>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import _ from 'lodash';
import Modal from "./modal";
import VSelect from "./form/VSelect";
import VInput from "./form/VInput";

extend('required', {
    ...required,
    message: 'Это обязательное поле',
})

const formDefaultState = {
    genre_id: null,
    title: null,
    author_first_name: null,
    author_mid_name: null,
    author_last_name: null,
}

export default {
    name: "BookCreateDialog",

    components: {
        Modal,
        VSelect,
        VInput,
        ValidationObserver,
        ValidationProvider
    },

    model: {
        event: 'open',
        prop: 'model'
    },

    props: {
        model: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        isOpen: false,
        form: { ...formDefaultState },
        processState: 'filling',
        notificationDelay: 2000,
        notificationTimeout: null
    }),

    watch: {
        model: {
            immediate: true,
            handler: function (value) {
                this.isOpen = value;
            }
        },
        isOpen (value) {
            this.$emit('open', value);
        }
    },

    computed: {
        ...mapGetters('books', [
            'genreWithLessOrEqual5Books'
        ])
    },

    methods: {
        ...mapActions('books', [
            'createBook'
        ]),

        init () {
            this.form = { ...formDefaultState };
            this.processState = 'filling';
            this.resetForm();
            clearTimeout(this.notificationTimeout);
        },

        async send () {
            const form = Object.keys(this.form).reduce((acc, key) => {
                acc[key] = _.isString(this.form[key]) ? this.form[key].trim() : this.form[key];
                return acc;
            }, {});

            this.processState = 'sending';

            try {
                await this.createBook(form);
                this.processState = 'fulfilled';
            } catch {
                this.processState = 'failed';
            }

            this.notificationTimeout = setTimeout(() => {
                this.cancel();
            }, this.notificationDelay);
        },

        cancel () {
            this.isOpen = false;
        },

        resetForm () {
            this.$refs.observer.reset();
        }
    }
}
</script>
