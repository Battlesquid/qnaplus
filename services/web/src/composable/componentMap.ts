import { Element, Node, Text as TextNode } from "domhandler";
import Image from "primevue/image";
import Paragraph from "../components/question/Paragraph.vue";
import Text from "../components/question/Text.vue";
import Link from "../components/question/Link.vue";

export const resolveQuestionComponent = (node: Node) => {
    switch (true) {
        case node instanceof Element && node.name === "img":
            return Image;
        case node instanceof Element && node.name === "p":
            return Paragraph;
        case node instanceof TextNode:
            return Text;
        case node instanceof Element && node.name === "a":
            return Link;
    }
}

export const resolveQuestionComponentProps = (node: Node) => {
    console.log(node);
    console.log();
    switch (true) {
        case node instanceof Element && node.name === "img":
            return { src: node.attribs.src, height: 150, preview: true };
        case node instanceof Element && node.name === "p":
            return { children: node.children };
        case node instanceof TextNode:
            return { text: node.data };
        case node instanceof Element && node.name === "a":
            return { href: node.attribs.href, children: node.children }
        default:
            return {};
    }
}