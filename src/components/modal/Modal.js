const raf = (fn) => window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => fn());
})

const fixBody = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${getScrollBarWidth()}px`;
}

const clearBodyStyle = () => {
    document.body.style = null;
}

const scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
);

const getScrollBarWidth = () => {
    if (scrollHeight > window.innerHeight) {
        const div = document.createElement('div')

        div.style.overflowY = 'scroll'
        div.style.width = '50px'
        div.style.height = '50px'

        document.body.append(div)
        const scrollBarWidth = div.offsetWidth - div.clientWidth

        div.remove()

        return scrollBarWidth
    }

    return 0;
}

class Modal {
    constructor (modalEl) {
        this.modalEl = modalEl;
    }

    show () {
        return new Promise((resolve) => {
            if (!this.modalEl) return resolve();

            let backdropEl = document.querySelector('.modal-backdrop');

            if (!backdropEl) {
                backdropEl = document.createElement('div');
                backdropEl.classList.add('modal-backdrop', 'fade');
                document.body.append(backdropEl);
            }

            const modalHandler = () => {
                this.modalEl.removeEventListener('transitionend', modalHandler);
                resolve();
            };

            const handler = () => {
                backdropEl.removeEventListener('transitionend', handler);
                this.modalEl.style.display = 'block';

                raf(() => {
                    this.modalEl.classList.add('show');
                    this.modalEl.addEventListener('transitionend', modalHandler);
                })
            };

            raf(() => {
                fixBody();
                backdropEl.classList.add('show');
                backdropEl.addEventListener('transitionend', handler);
            });
        })
    }

    hide () {
        const backdropEl = document.querySelector('.modal-backdrop');
        const canHide = Boolean(backdropEl && this.modalEl);

        return new Promise((resolve) => {
            if (!canHide) {
                return resolve();
            }

            const handler = () => {
                backdropEl.remove()
                backdropEl.removeEventListener('transitionend', handler);

                clearBodyStyle();

                resolve();
            };

            const modalHandler = () => {
                this.modalEl.style.display = 'none';
                this.modalEl.removeEventListener('transitionend', modalHandler);

                backdropEl.classList.remove('show');
                backdropEl.addEventListener('transitionend', handler);
            };

            raf(() => {
                this.modalEl.classList.remove('show');
                this.modalEl.addEventListener('transitionend', modalHandler);
            });
        })
    }
}

export default Modal;
