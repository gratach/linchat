import { TestMessageView } from './messageview.js';

export class TestChatViewUnit { 
    constructor() {
        this.messages = Array(100).fill(["Hello", "World", "How", "Are", "You"]).reduce((acc, arr)=>acc.concat(arr), []);
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