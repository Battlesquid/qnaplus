import { Element, Node, Text as TextNode } from "domhandler";
import Image from "primevue/image";
import Paragraph from "../components/question/Paragraph.vue";
import Text from "../components/question/Text.vue";
import Link from "../components/question/Link.vue";
import Strong from "../components/question/Strong.vue";
import Emphasis from "../components/question/Emphasis.vue";

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
        case node instanceof TextNode:
            return Text;
    }
}

export const resolveQuestionComponentProps = (node: Node) => {
    console.log(node);
    console.log();
    switch (true) {
        case node instanceof Element && node.name === "img":
            return { src: node.attribs.src, height: 150, preview: true };
        case node instanceof Element && ["em", "p", "strong"].includes(node.name):
            return { children: node.children };
        case node instanceof Element && node.name === "a":
            return { href: node.attribs.href, children: node.children }
        case node instanceof TextNode:
            return { text: node.data };
        default:
            return {};
    }
}