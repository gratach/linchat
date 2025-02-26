import { TestMessageView } from './messageview.js';

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