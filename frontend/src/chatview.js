import {styleBox} from './styles.js';
import {View} from './view.js';


export class ChatView extends View {
    constructor(chatViewUnit) {
        super();
        
        this.childNode = document.createElement('div');
        styleBox(this.childNode, {"overflow-y": "scroll"});

        this.chatViewUnit = chatViewUnit;
        this.messagesInfos = [];


        this.sendNodeDiv = document.createElement('div');
        styleBox(this.sendNodeDiv, {"width": "100%", "height": null});
        this.childNode.appendChild(this.sendNodeDiv);
        
        this.sendNode = document.createElement('input');
        styleBox(this.sendNode, {"width": "100%", "height": "100%"});
        this.sendNode.type = "text";
        this.sendNodeDiv.appendChild(this.sendNode);

        this.asyncConstructor();
    }
    async asyncConstructor() {
        this.oldestUnloadedMessageId = await this.chatViewUnit.getLatestMessageId();
        this.isLoading = false;
        this.childNode.addEventListener('scroll', () => this.loadMessagesIfNecessary());
        this.loadMessagesIfNecessary();
    }
    async loadMessagesIfNecessary() {
        if (this.isLoading)
            return;
        this.isLoading = true;
        while(true) {
            if (this.childNode.childNodes[0].getBoundingClientRect().top - this.childNode.getBoundingClientRect().top < -this.childNode.getBoundingClientRect().height)
                break;
            if (this.oldestUnloadedMessageId === null)
                break;
            let [messageView, newOldestUnloadedMessage] = await Promise.all([this.chatViewUnit.getMessageView(this.oldestUnloadedMessageId), this.chatViewUnit.getPreviousMessageId(this.oldestUnloadedMessageId)]);
            this.oldestUnloadedMessageId = newOldestUnloadedMessage;
            let messageDiv = document.createElement('div');
            styleBox(messageDiv, {"width": "100%", "height": null});
            messageView.rootNode = messageDiv;
            let oldScrollTop = this.childNode.scrollTop;
            this.childNode.insertBefore(messageDiv, this.childNode.firstChild);
            this.childNode.scrollTop = oldScrollTop + this.childNode.childNodes[0].getBoundingClientRect().height;
            let messageInfo = {"id": this.oldestUnloadedMessageId, "view" : messageView, "div": messageDiv};
            this.messagesInfos.unshift(messageInfo);
        }
        this.isLoading = false;
    }
}

