import { isInstanceOf } from '../ohjs-is/index.js';
import scriptLoader from '../ohjs-script-loader/index.js';

const src = 
'https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js';

function verify() {
    return window.hasOwnProperty('SignaturePad');
}

/**
 * Applies the SignaturePad functionality to a canvas element
 * which automatically updates the value of the provided hidden input.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLInputElement} input
 *
 * @return {Promise} - Resolves with an object with 2 functions for 
clearing and undoing.
 */
export default function(canvas, input) {
    if (!isInstanceOf(canvas, HTMLCanvasElement)) {
        throw '`canvas` must be an HTMLCanvasElement';
    }

    if (!isInstanceOf(input, HTMLInputElement)) {
        throw '`input` must be an HTMLInputElement';
    }

    if ('hidden' !== input.type) {
        throw '`input` must be type=hidden';
    }

    let signaturePad;

    function setInput() {
        if (signaturePad.isEmpty()) {
            input.value = '';
        }
        else {
            input.value = signaturePad.toDataURL('image/jpeg');
        }
    }

    function undo() {
        const data = signaturePad.toData();

        if (data) {
            data.pop(); // remove the last dot or line
            signaturePad.fromData(data);
        }

        setInput();
    }

    function clear() {
        signaturePad.clear();

        setInput();
    }

    function resize() {
        const ratio =  Math.max(window.devicePixelRatio || 1, 1);

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);

        clear();
    }

    return scriptLoader(src, verify).then(() => {
        signaturePad = new window.SignaturePad(canvas, {
            backgroundColor: 'rgb(255, 255, 255)',
        });

        signaturePad.addEventListener('endStroke', setInput);

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        resize();

        return {
            clear,
            undo,
            isEmpty() {
                return signaturePad.isEmpty();
            }
        };
    });
};

