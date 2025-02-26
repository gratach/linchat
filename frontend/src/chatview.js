import {styleBox} from './styles.js';
import {View} from './view.js';


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

