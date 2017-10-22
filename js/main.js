// ANIMATION CASSIE WRITING

var bounceIn = anime({
    targets: '.letter__part',
    translateY: {
        value: [-30, 0],
        duration: 900,
        elasticity: 600,
        easing: 'easeOutElastic'
    },
    opacity: {
        value: [0, 1],
        duration: 300,
        easing: 'linear'
    },
    delay: function(el, i) { return i * 40 },
    // delay increment per letter.
});

var lineDrawing = anime({
    targets: '.color-2, .color-3',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeOutElastic',
    duration: 4000,
    delay: function(el, i) { return i * 60 },
    loop: false,
    direction: 'alternate',
});

// END ANIMATION CASSIE WRITING



{
    // equation of a line
    const lineEq = (y2, y1, x2, x1, currentVal) => {
        // y = mx + b
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - m * x1;

        return m * currentVal + b;
    }

    // from http://www.quirksmode.org/js/events_properties.html#position

    const getMousePos = (e) => {
        let posx = 0;
        let posy = 0;
        if (!e) { let e = window.event };
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }
        return {
            x: posx,
            y: posy
        };
    };
    // posx and posy contain the mouse position relative to the document


    // From https://davidwalsh.name/javascript-debounce-function.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // a debounce function is essential to ensuring a given task doesn't fire so often that it bricks browser performance.

    class MorphingBG {
        constructor(el) {
            this.DOM = {};
            this.DOM.el = el;
            this.DOM.el.style.opacity = 0;
            this.DOM.el.style.transition = 'transform 2s ease-out';
            this.DOM.pathEl = this.DOM.el.querySelector('path');
            this.paths = this.DOM.pathEl.getAttribute('pathdata:id').split(';')
            this.paths.splice(this.paths.length, 0, this.DOM.pathEl.getAttribute('d'));
            this.win = { width: window.innerWidth, height: window.innerHeight };
            this.animate();
            this.initEvents();
        }
        animate() {
            anime.remove(this.DOM.pathEl);
            anime({
                targets: this.DOM.pathEl,
                duration: 10000,
                easing: [0.5, 0, 0.5, 1],
                d: this.paths,
                loop: true
            });
        }
        initEvents() {
            // Mousemove event / Tilt functionality.
            const tilt = {
                tx: this.win.width / 8,
                ty: this.win.height / 4,
                rz: 45,
                sx: [0.8, 2],
                sy: [0.8, 2]
            }
            const onMouseMoveFn = (ev) => {
                requestAnimationFrame(() => {
                    if (!this.started) {
                        this.started = true;
                        anime({
                            targets: this.DOM.el,
                            duration: 300,
                            easing: 'linear',
                            opacity: [0, 1]
                        });
                    } else {
                        const mousepos = getMousePos(ev);
                        const rotZ = 2 * tilt.rz / this.win.height * mousepos.y - tilt.rz;
                        const scaleX = mousepos.x < this.win.width / 2 ? lineEq(tilt.sx[0], tilt.sx[1], this.win.width / 2, 0, mousepos.x) : lineEq(tilt.sx[1], tilt.sx[0], this.win.width, this.win.width / 2, mousepos.x);
                        const scaleY = mousepos.y < this.win.height / 2 ? lineEq(tilt.sy[0], tilt.sy[1], this.win.height / 2, 0, mousepos.y) : lineEq(tilt.sy[1], tilt.sy[0], this.win.height, this.win.height / 2, mousepos.y);
                        const transX = 2 * tilt.tx / this.win.width * mousepos.x - tilt.tx;
                        const transY = 2 * tilt.ty / this.win.height * mousepos.y - tilt.ty;

                        this.DOM.el.style.transform = `translate3d(${transX}px, ${transY}px,0) rotate3d(0,0,1,${rotZ}deg) scale3d(${scaleX},${scaleY},1)`;
                    }
                });
            };

            // Window resize.
            const onResizeFn = debounce(() => this.win = { width: window.innerWidth, height: window.innerHeight }, 20);

            document.addEventListener('mousemove', onMouseMoveFn);
            document.addEventListener('touchstart', onMouseMoveFn);
            window.addEventListener('resize', ev => onResizeFn());
        }
    };

    new MorphingBG(document.querySelector('svg.blob'));
};

//https://codepen.io/cassieevans/pen/aLPKYo

// https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
//http://creativejs.com/resources/requestanimationframe/

// Obtain a reference to the canvas element using its id.
var canvas = document.getElementById('noise');
// Obtain a graphics context on the canvas element for drawing.
var ctx = canvas.getContext('2d');
// setting canvas width
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var width = canvas.width;
var height = canvas.height;

function noise(canvas) {
    //obtain a reference to the canvas’ image data
    var imageData = ctx.createImageData(width, height);
    //micro-optimisation to get a reference to the raw pixel data
    var data = imageData.data;
    //make a new ImageBuffer for direct manipulation of that ImageData 
    var buffer = new Uint32Array(imageData.data.buffer);
    var length = buffer.length;
    // Cycling through all the integers in the array. The values of the red, green, and blue channels, along with the alpha channel are packed into a single integer using bitwise left-shifts and bitwise ORs.
    for (i = 0; i < length; i++) {
        buffer[i] = 255 * Math.random() << 24;
    }
    console.log(data);
    ctx.putImageData(imageData, 0, 0);



}


var fps = 15;

function draw() {
    setTimeout(function() {
        requestAnimationFrame(draw);
        for (let i = 0; i < 2; i++) {
            noise();
        }
    }, 1000 / fps);
}
draw();

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill/cross browser by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());