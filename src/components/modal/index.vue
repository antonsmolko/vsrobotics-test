<template>
    <div ref="modal" class="modal fade" @click="backdropClose($event)">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span v-if="title" class="modal-title">{{ title }}</span>
                    <button
                        @click="close"
                        class="modal-close btn-close"
                        type="button"
                    >
                        <times-icon />
                    </button>
                </div>
                <div v-if="$slots.body" class="modal-body">
                    <slot name="body"/>
                </div>
                <div v-if="$slots.footer" class="modal-footer">
                    <slot name="footer"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from "./Modal";
import TimesIcon from "../icons/TimesIcon";

export default {
    name: "Modal",

    components: {
        TimesIcon
    },

    model: {
        event: 'open',
        prop: 'isOpen'
    },

    props: {
        title: {
            type: String,
            default: null
        },

        isOpen: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        modalEL: null,
        modal: null
    }),

    watch: {
        isOpen (value) {
            value ? this.show() : this.close()
        }
    },

    mounted () {
        this.modal = new Modal(this.$refs.modal);
        this.isOpen ? this.show() : this.close();
    },

    beforeDestroy () {
        this.modal = null;
    },

    methods: {
        show () {
            this.modal.show();
        },

        backdropClose (event) {
            if (event.target !== event.currentTarget) return;
            this.close();
        },

        async close () {
            await this.modal.hide();
            this.$emit('open', false);
        },
    }
}
</script>
