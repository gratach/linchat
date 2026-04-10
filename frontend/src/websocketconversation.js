export class WebsocketConversation{
    #dialogElementsPerForeignId = {};
    #dialogElementsPerLocalId = {};
    #idCounter = 0;
    #websocket;
    constructor(url){
        this.#websocket = new WebSocket(url);
        this.#websocket.onmessage = (event) => this.#onMessage(event);
        this.#websocket.onopen = () => this.#onOpen();
        this.#websocket.onclose = () => this.#onClose();
        this.#websocket.onerror = () => this.#onError();
    }
    get websocket(){
        return this.#websocket;
    }
    spawnId(){
        return "" + this.#idCounter++;
    }
    addDialogElement(dialogElement){
        if (dialogElement.foreignId !== null)
            this.#dialogElementsPerForeignId[dialogElement.foreignId] = dialogElement;
        if (dialogElement.localId !== null)
            this.#dialogElementsPerLocalId[dialogElement.localId] = dialogElement;
    }
    #onMessage(event){
        let message = JSON.parse(event.data);
    }
    #onOpen(){
    }
    #onClose(){
    }
    #onError(){
    }
    send(message){
        this.#websocket.send(JSON.stringify(message));
    }
}

class Dialog{
    #localId = null;
    #foreignId = null;
    #localActions = [];
    #foreignActions = [];
    #localActionsBeforeConnection = [];
    #wsconversation;
    #hasError = false;
    #isListening = false;
    constructor(wsconversation){
        this.#wsconversation = wsconversation;
        this.#localId = wsconversation.spawnId();
        wsconversation.addDialogElement(this);
    }
    set foreignId(id){
        this.#foreignId = id;
        while (this.#localActionsBeforeConnection.length > 0){
            let action = this.#localActionsBeforeConnection.shift();
            action["foreignId"] = id;
            this.#localActions.push(action);
            this.#wsconversation.send(action);
        }
    }
    get foreignId(){
        return this.#foreignId;
    }
    get localId(){
        return this.#localId;
    }
    send(message){
        if (this.#hasError)
            throw new Error("Dialog has an error and cannot send messages");
        if (this.#isListening)
            throw new Error("Dialog is listening and cannot send messages");
        enclosedMessage = {
            "type": "send_message",
            "content": message,
            "localId": this.#localId
        };
        if (this.#foreignId === null)
            this.#localActionsBeforeConnection.push(enclosedMessage);
        else{
            enclosedMessage["foreignId"] = this.#foreignId;
            this.#localActions.push(enclosedMessage);
            this.#wsconversation.send(enclosedMessage);
        }
    }
    async receive(){
        if (this.#hasError)
            throw new Error("Dialog has an error and cannot receive messages");
        if (this.#isListening)
            throw new Error("Dialog is already listening");
        this.#isListening = true;
        let message = await new Promise((resolve, reject) => {
            this.#wsconversation.waitingMessagesToAnswer[this.#localId] = resolve;
        });
        this.#isListening = false;
        return message;
    }
}

class DialogSpawner{
    constructor(){
    }
}

class DialogInitiator{
    constructor(){
    }
}