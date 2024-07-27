import { Element, Node, Text as TextNode } from "domhandler";
import Image from "../components/question/Image.vue";
import Paragraph from "../components/question/Paragraph.vue";
import Text from "../components/question/Text.vue";
import Link from "../components/question/Link.vue";
import Strong from "../components/question/Strong.vue";
import Emphasis from "../components/question/Emphasis.vue";
import Blockquote from "../components/question/Blockquote.vue";
import OrderedList from "../components/question/OrderedList.vue";
import ListItem from "../components/question/ListItem.vue";

export const resolveQuestionComponent = (node: Node) => {
    switch (true) {
        case node instanceof Element && node.name === "img":
            return Image;
        case node instanceof Element && node.name === "p":
            return Paragraph;
        case node instanceof Element && node.name === "a":
            return Link;
        case node instanceof Element && node.name === "strong":
            return Strong;
        case node instanceof Element && node.name === "em":
            return Emphasis;
        case node instanceof Element && node.name === "br":
            return "br";
        case node instanceof Element && node.name === "blockquote":
            return Blockquote;
        case node instanceof Element && node.name === "ol":
            return OrderedList;
        case node instanceof Element && node.name === "li":
            return ListItem;
        case node instanceof TextNode:
            return Text;
    }
}

export const resolveQuestionComponentProps = (node: Node) => {
    switch (true) {
        case node instanceof Element && node.name === "img":
            return { src: node.attribs.src, height: 150, preview: true };
        case node instanceof Element && ["em", "p", "strong", "blockquote", "ol", "li"].includes(node.name):
            return { children: node.children };
        case node instanceof Element && node.name === "a":
            return { href: node.attribs.href, children: node.children }
        case node instanceof TextNode:
            return { text: node.data };
        default:
            return {};
    }
}