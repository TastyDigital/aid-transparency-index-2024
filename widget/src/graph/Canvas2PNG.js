
const Canvas2PNG = (canvas, target, alt) => {
    if(target) {
        const img = new Image();
        img.src = canvas.toDataURL("image/png");
        img.alt = alt;
        target.appendChild(img);
        return true;
    }

    return false;
    //target.parentNode.insertBefore(img, target.nextSibling);
    //target.after(img);
}

export default Canvas2PNG;