<template>
    <div class="book-item card card-flat bg-muted h-100">
        <span class="book-item__title">{{ item.title }}</span>
        <hr class="mt-auto">
        <div class="book-item__footer">
            <span class="book-item__author">{{ authorName }}</span>
            <span class="book-item__date">{{ formattedDate }}</span>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

export default {
    name: "BookItem",

    props: {
        item: {
            type: Object,
            required: true
        }
    },

    computed: {
        authorName () {
            const { author_first_name, author_last_name, author_mid_name } = this.item;
            const getInitial = (str) => typeof str === 'string' && str.trim()
                ? `${_.head(str.trim()).toUpperCase()}.`
                : str;

            return `${author_last_name} ${getInitial(author_first_name)}${getInitial(author_mid_name)}`
        },

        formattedDate () {
            return moment(this.item.date_add).format('YYYY-MM-DD HH:mm')
        }
    }
}
</script>
