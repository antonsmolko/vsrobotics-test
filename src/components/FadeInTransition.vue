<template>
    <transition
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
    >
      <slot/>
    </transition>
</template>

<script>
import Velocity from 'velocity-animate';

export default {
    name: 'FadeInTransition',

    props: {
        duration: {
            type: Number,
            default: 0
        },
    },

    data: () => ({
        show: false
    }),

    methods: {
        beforeEnter (el) {
            el.style.opacity = 0;
        },

        enter (el, done) {
            Velocity(el, { opacity: 1 }, { duration: this.duration, complete: done });
        },

        leave (el, done) {
            console.log('done: ', done)
            Velocity(el, { opacity: 0 }, { complete: done, duration: this.duration });
        }
    }
}
</script>
