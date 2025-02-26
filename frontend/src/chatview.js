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
export class TestMessageView extends View {
    constructor(message) {
        super();
        this.message = message;
        this.childNode = document.createElement('div');
        styleBox(this.childNode);
        this.childNode.textContent = this.message;
    }
}
export class TestChatViewUnit { 
    constructor() {
        this.messages = ["Hello", "World", "How", "Are", "You"];
    }
    getLatestMessageId() {
        return this.messages.length - 1;
    }
    getPreviousMessageId(id) {
        if (id === 0)
            return null;
        return id - 1;
    }
    getMessageView(id) {
        return new TestMessageView(this.messages[id]);
    }
}
export class ChatView extends View {
    constructor(chatViewUnit) {
        super();
        
        this.childNode = document.createElement('div');
        styleBox(this.childNode);

        this.chatViewUnit = chatViewUnit;
        this.messagesInfos = [];

        this.oldestUnloadedMessageId = this.chatViewUnit.getLatestMessageId();

        this.sendNodeDiv = document.createElement('div');
        styleBox(this.sendNodeDiv, {"width": "100%", "height": null});
        this.childNode.appendChild(this.sendNodeDiv);
        
        this.sendNode = document.createElement('input');
        styleBox(this.sendNode, {"width": "100%", "height": "100%"});
        this.sendNode.type = "text";
        this.sendNodeDiv.appendChild(this.sendNode);
        
        for (var i = 0; i < 10; i++) {
            this.loadMessagesIfNecessary();
        }
    }
    loadMessagesIfNecessary() {
        if (this.oldestUnloadedMessageId === null)
            return;
        var messageView = this.chatViewUnit.getMessageView(this.oldestUnloadedMessageId);
        var messageDiv = document.createElement('div');
        styleBox(messageDiv, {"width": "100%", "height": null});
        messageView.rootNode = messageDiv;
        this.childNode.insertBefore(messageDiv, this.childNode.firstChild);
        var messageInfo = {"id": this.oldestUnloadedMessageId, "view" : messageView, "div": messageDiv};
        this.messagesInfos.unshift(messageInfo);
        this.oldestUnloadedMessageId = this.chatViewUnit.getPreviousMessageId(this.oldestUnloadedMessageId);
    }
}
function styleBox(div, styleDict = {}) {
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
export class SplitView extends View {
    constructor() {
        super();

        this.childNode = document.createElement('div');
        styleBox(this.childNode);

        this.leftDiv = document.createElement('div');
        styleBox(this.leftDiv, {"width": "50%"});
        this.childNode.appendChild(this.leftDiv);

        this.rightDiv = document.createElement('div');
        styleBox(this.rightDiv, {"width": "50%"});
        this.childNode.appendChild(this.rightDiv);

        // Give the divs different background colors so we can see them
        this.leftDiv.style.backgroundColor = "red";
        this.rightDiv.style.backgroundColor = "blue";

    }
}