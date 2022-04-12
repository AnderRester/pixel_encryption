function processImage(inImg) {
    const width = inImg.width;
    const height = inImg.height;
    const src = new Uint32Array(inImg.data.buffer);

    // Saturation
    processCanvas('canvasSaturation', width, height, function(dst) {
        let value = parseInt($("#rangeSaturation").val());
        let max = (value < 0) ? 255 : 128;
        for (let i = 0; i < dst.length; i++) {
            let r = src[i] & 0xFF;
            let g = (src[i] >> 8) & 0xFF;
            let b = (src[i] >> 16) & 0xFF;
            let gray = (r * 0.2126 + g * 0.7152 + b * 0.0722);

            r += (r - gray) * value / max;
            g += (g - gray) * value / max;
            b += (b - gray) * value / max;

            if (r > 255) r = 255;
            else if (r < 0) r = 0;
            if (g > 255) g = 255;
            else if (g < 0) g = 0;
            if (b > 255) b = 255;
            else if (b < 0) b = 0;

            dst[i] = (src[i] & 0xFF000000) | (b << 16) | (g << 8) | r;
        }

    });
}

function getImageData(el) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = document.getElementById(el);
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    return context.getImageData(0, 0, img.width, img.height);
}

function processCanvas(canvasId, width, height, func) {
    const canvas = document.getElementById(canvasId);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const outImg = ctx.createImageData(width, height);
    const dst = new Uint32Array(outImg.data.buffer);
    func(dst);
    ctx.putImageData(outImg, 0, 0);
}



document.getElementById('input').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        var img = document.getElementById('img');
        img.src = URL.createObjectURL(this.files[0]);
        img.onload = update;
    }
});

$("#rangeSaturation").on('input change', update);

function update(e) {
    $('#valueSaturation').text($("#rangeSaturation").val());
    processImage(getImageData('img'));
}

update();

let i = 0;
while (i <= messageInput.value) {

}