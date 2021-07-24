<template>
    <div class="form-group" :class="{ invalid: errors }">
        <label v-if="label" :for="id" class="form-label">{{ label }}</label>
        <select
            v-model="value"
            :id="id"
            class="form-control"
            :class="{ placeholder: !value }"
        >
            <option
                v-if="placeholder"
                :value="null"
                disabled
                selected
            >
                {{ placeholder }}
            </option>
            <option
                v-for="option in options"
                :key="option[optionKey]"
                :value="option[optionValue]"
            >{{ option[optionLabel] }}</option>
        </select>
        <div v-if="errors" class="invalid-feedback">{{ errorString }}</div>
    </div>
</template>

<script>
export default {
    name: "VSelect",

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

        options: {
            type: Array,
            default: () => []
        },

        optionLabel: {
            type: String,
            default: 'title'
        },

        optionKey: {
            type: String,
            default: 'id'
        },

        optionValue: {
            type: String,
            default: 'id'
        },

        model: {
            type: [String, Number, Object],
            default: null
        },

        errors: {
            type: [String, Array],
            default: null
        },
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
                this.value = value;
            }
        },

        value (value) {
            this.$emit('change', value);
        }
    }
}
</script>
