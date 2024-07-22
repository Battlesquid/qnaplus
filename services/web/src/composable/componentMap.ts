import Paragraph from "../components/question/Paragraph.vue"
import Image from "primevue/image"

export const ComponentMap = {
    p: Paragraph,
    img: Image
}

export const resolveProps = (component: string, node: any) => {
    switch (component) {
        case "img":
            return { src: node.attribs.src, height: 150, preview: true }
        case "p":
        default:
            return { children: node.childNodes };
    }
}