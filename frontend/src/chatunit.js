import { TestMessageView } from './messageview.js';

export class TestChatViewUnit { 
    constructor() {
        this.messages = Array(100).fill(["Hello", "World", "How", "Are", "You"]).reduce((acc, arr)=>acc.concat(arr), []);
    }
    async getLatestMessageId() {
        return this.messages.length - 1;
    }
    async getPreviousMessageId(id) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (id === 0)
            return null;
        return id - 1;
    }
    async getMessageView(id) {
        return new TestMessageView(this.messages[id]);
    }
}