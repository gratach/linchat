export class View {
    #rootNode;
    #childNode;
    constructor() {
        this.#rootNode = null;
        this.#childNode = null;
    }
    get childNode() {
        return this.#childNode;
    }
    set childNode(childNode) {
        if (this.#rootNode !== null) {
            if (this.#childNode !== null)
                this.#rootNode.removeChild(this.#childNode);
            if (childNode !== null)
                this.#rootNode.appendChild(childNode);
        }
        this.#childNode = childNode;
    }
    get rootNode() {
        return this.#rootNode
    }
    set rootNode(rootNode) {
        console.log("test")
        if (this.#childNode !== null){
            if(this.#rootNode !== null)
                this.#rootNode.removeChild(this.#childNode);
            if (rootNode !== null)
                rootNode.appendChild(this.#childNode);
        }
        this.#rootNode = rootNode;
    }
}