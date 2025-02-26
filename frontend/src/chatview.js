class View {
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
export class ChatView extends View {
    constructor() {
        super();
        this.childNode = document.createElement('div');
        this.childNode.innerHTML = '<h1>Chat</h1>';
    }
}
export class SplitView extends View {
    constructor() {
        super();
        this.childNode = document.createElement('div');
        this.leftDiv = document.createElement('div');
        this.rightDiv = document.createElement('div');
        this.childNode.appendChild(this.leftDiv);
        this.childNode.appendChild(this.rightDiv);

        // Style the divs in a way that makes them appear side by side
        this.childNode.style.display = "flex";
        this.childNode.style.flexDirection = "row";
        this.leftDiv.style.flex = "1";
        this.rightDiv.style.flex = "1"; 

        // Give the divs different background colors so we can see them
        this.leftDiv.style.backgroundColor = "red";
        this.rightDiv.style.backgroundColor = "blue";

    }
}