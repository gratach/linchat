export function styleBox(div, styleDict = {}) {
    var defauldDict = { "width": "100%", "height": "100%", "boxSizing": "border-box", "padding": "0", "margin": "0" , "float": "left"};
    for (var key in defauldDict) {
        if(!(key in styleDict))
            styleDict[key] = defauldDict[key];
    }
    for (var key in styleDict) {
        if(styleDict[key] !== null)
            div.style[key] = styleDict[key];
    }
}   