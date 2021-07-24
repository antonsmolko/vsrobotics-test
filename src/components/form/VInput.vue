<template>
    <div class="form-group" :class="{ invalid: errors }">
        <label v-if="label" :for="id" class="form-label">{{ label }}</label>
        <input
            v-model="value"
            :id="id"
            :placeholder="placeholder"
            type="text"
            class="form-control"
        >
        <div v-if="errors" class="invalid-feedback">{{ errorString }}</div>
    </div>
</template>

<script>
export default {
    name: "VInput",

    model: {
        event: 'change',
        prop: 'model'
    },

    props: {
        id: {
            type: [String, Number],
            required: true
        },

        label: {
            type: String,
            default: null
        },

        placeholder: {
            type: String,
            default: null
        },

        errors: {
            type: [String, Array],
            default: null
        },

        model: {
            type: String,
            default: null
        }
    },

    data: () => ({
        value: null
    }),

    computed: {
        errorString () {
            return Array.isArray(this.errors) ? this.errors.join(', ') : this.errors
        }
    },

    watch: {
        model: {
            immediate: true,
            handler: function (value) {
                this.value = value
            }
        },

        value (value) {
            this.$emit('change', value)
        }
    }
}
</script>
