class Marquee3k {
    constructor(options) {
        this.options = Object.assign({ 
            selector: '.marquee3k',
            speed: 0.7,
            reverse: false
        }, options);

        this.paused = false;
        this.animationId = 0;

        this.element = document.querySelector(this.options.selector);
        this.selector = this.options.selector;
        this.speed = this.options.speed;
        this.reverse = this.options.reverse;
        this.parent = this.element.parentElement;
        this.content = this.element.children[0];
        this.offset = 0;
    }

    _startAnimate = () => {
        this._animate();
        this.animationId = window.requestAnimationFrame(this._startAnimate);
    }

    _animate() {
        if (!this.paused) {
            const overflowWidth = this.contentWidth - this._parentProps().width;
            const isScrollEnd = this.reverse ? this.offset >= 0 : this.offset <= overflowWidth * -1;
            const direction = this.reverse ? -1 : 1;

            if (isScrollEnd) {
                this.pause();
            } else {
                this.offset -= this.speed * direction;
            }

            this.element.style.whiteSpace = 'nowrap';
            this.element.style.transform = `translate(${this.offset}px, 0) translateZ(0)`;
        }
    }

    _parentProps() {
        return this.parent.getBoundingClientRect();
    }

    _initData() {
        this.offset = 0;
        this.paused = false;
        this.contentWidth = this.content.offsetWidth;
    }

    pause() {
        this.paused = true;
    }

    stop() {
        this.animationId && window.cancelAnimationFrame(this.animationId);
        this.element.style.removeProperty('transform');
    }

    play() {
        this._initData();
        const overflowWidth = this.contentWidth - this._parentProps().width;
        if(overflowWidth > 0) {
            this._startAnimate();
        }
    }

    toggle() {
        this.paused = !this.paused;
    }
}

export default Marquee3k;