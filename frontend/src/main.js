import { ChatView} from "./chatview";
import { SplitView } from "./splitview";
import { TestChatViewUnit } from "./chatunit";

var rootNode = document.getElementsByTagName("body")[0];
var testChatViewUnit = new TestChatViewUnit();
var chatView = new ChatView(testChatViewUnit);
var splitView = new SplitView();
splitView.rootNode = rootNode;
var change = false;
chatView.rootNode = splitView.leftDiv;
