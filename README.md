A Javascript module that provides a wrapper object for the Signature Pad 
JS.

Basic usage:

```js
import SignaturePad from 'ohjs-signature-pad';

const canvas = document.getElementById('canvas');
const input = document.getElementById('signature');
const clear = document.getElementById('clear');
const undo = document.getElementById('undo');

const signaturePad = await SignaturePad(canvas, input);

undo.addEventListener('click', (e) => {
    e.preventDefault();

    signaturePad.undo();
});

clear.addEventListener('click', (e) => {
    e.preventDefault();

    signaturePad.clear();
});

if (signaturepad.isEmpty()) {
  // do something
}
```

The hidden input will be updated accordingly.
