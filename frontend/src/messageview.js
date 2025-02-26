import { View } from './view.js';
import { styleBox } from './styles.js';

export class TestMessageView extends View {
    constructor(message) {
        super();
        this.message = message;
        this.childNode = document.createElement('div');
        styleBox(this.childNode);
        this.childNode.textContent = this.message;
    }
}