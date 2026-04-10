class AsyncWebsocket {
    constructor(url) {
        this.url = url;
        this.ws = new WebSocket(url);
        this.sendMessageQueue = [];
        this.recieveMessageQueue = [];
        this.messageRecieveCallbacks = [];
        this.hasOpened = false;
        this.isClosed = false;
        this.openCallbacks = [];
        this.closeCallbacks = [];
        this.ws.onopen = () => {
            this.hasOpened = true;
            this.openCallbacks.forEach(cb => cb[0]());
            this.openCallbacks = [];
            this.sendMessageQueue.forEach(msg => this.ws.send(msg));
            this.sendMessageQueue = [];
        };
        this.ws.onmessage = (event) => {
            if (this.messageRecieveCallbacks.length > 0) {
                let [resolve, reject] = this.messageRecieveCallbacks.shift();
                resolve(event.data);
            }
            else {
                this.recieveMessageQueue.push(event.data);
            }
        }
        this.ws.onclose = () => {
            this.isClosed = true;
            this.openCallbacks.forEach(cb => cb[1]());
            this.openCallbacks = [];
            this.messageRecieveCallbacks.forEach(cb => cb[1]());
            this.messageRecieveCallbacks = [];
            this.closeCallbacks.forEach(cb => cb());
            this.closeCallbacks = [];
        }
    }

    open() {
        return new Promise((resolve, reject) => {
            if (this.hasOpened) {
                if (this.isClosed) {
                    reject();
                }
                else {
                    resolve();
                }
            }        
            else {
                this.openCallbacks.push([resolve, reject]);
            }
        });
    }

    send(message) {
        if (this.isClosed)
            throw new Error("Cannot send message on closed websocket");
        if (this.hasOpened)
            this.ws.send(message);
        else
            this.sendMessageQueue.push(message);
    }

    recieve() {
        return new Promise((resolve, reject) => {
            if (this.recieveMessageQueue.length > 0)
                resolve(this.recieveMessageQueue.shift());
            else
                this.messageRecieveCallbacks.push([resolve, reject]);
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.isClosed)
                resolve();
            else
                this.closeCallbacks.push(resolve);
        });
    }
}