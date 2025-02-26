import {View} from './view.js';
import {styleBox} from './styles.js';

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