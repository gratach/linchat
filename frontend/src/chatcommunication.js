import {AsyncWebSocket} from "./asyncwebsocket.js";

export class ChatCommunication {
    constructor(websocketurl) {
        this.ws = new AsyncWebSocket(websocketurl);
        this.active = false;
        this.waitingMessagesToAnswer = {};
        this.onMessage = undefined;
        this.idCounter = 0;
        this.open();
    }
    async open() {
        await this.ws.open();
        this.active = true;
        while(this.active){
            let message;
            try{
                message = await this.ws.recieve()
            }
            catch(e){
                this.active = false;
                break;
            }
            let json = JSON.parse(message);
            if (json.answers !== undefined) {
                if (this.waitingMessagesToAnswer[json.answers] === undefined)
                    throw new Error("Answer could not be assigned to a waiting message");
                this.waitingMessagesToAnswer[json.answers](json);
                delete this.waitingMessagesToAnswer[json.answers];
            }
            else {
                if (this.onMessage !== undefined)
                    this.onMessage(json);
            }
        }
    }
    async sendMessage(message) {
        this.ws.send(message);
    }
}