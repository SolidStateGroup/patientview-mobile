module.exports = function(images, getDeviceWidth, getImageWidth, getImageHeight, max_height, padding) {

    HEIGHTS = [];

    function getheight(images, width) { //returns the height for a row
        width -= images.length * ((padding || 0) * 2);

        var h = 0;
        for (var i = 0; i < images.length; ++i) {
            h += getImageWidth(images[i]) / getImageHeight(images[i]);
        }
        return width / h;
    }

    function setheight(images, height) { //sets the dimensions for the images
        HEIGHTS.push(height);
        for (var i = 0; i < images.length; ++i) {
            images[i].data = {
                width: height * getImageWidth(images[i]) / getImageHeight(images[i]),
                height: height
            };

        }
    }


    var size = getDeviceWidth();

    var n = 0;
    w: while (images.length > 0) {
        for (var i = 1; i < images.length + 1; ++i) {
            var slice = images.slice(0, i);
            var h = getheight(slice, size);
            if (h < max_height()) {
                setheight(slice, h);
                n++;
                images = images.slice(i);
                continue w;
            }
        }
        setheight(slice, Math.min(max_height(), h));
        n++;
        break;
    }

    return images;
}