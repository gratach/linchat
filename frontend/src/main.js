import { SplitView, ChatView } from "./chatview";

var rootNode = document.getElementById("root");
var chatView = new ChatView();
var splitView = new SplitView();
splitView.rootNode = rootNode;
var change = false;
setInterval(() => {
    if (change)
        chatView.rootNode = splitView.leftDiv;
    else
        chatView.rootNode = splitView.rightDiv;
    change = !change;
}, 1000);
