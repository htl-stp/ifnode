import { marked } from "marked";
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark.css';

function fixImagePaths(md: string) {
    return md.replace(/!\[(.*?)]\((.*?)\)/g, (_, alt, src) => {
        const fileName = src.split("/").pop();
        const newSrc = `https://raw.githubusercontent.com/htl-stp/ifnode/refs/heads/main/public/data/images/${src}`;
        return `![${alt}](${newSrc})`;
    });
}

const params = new URLSearchParams(window.location.search);

const file = params.get("file");
if (!file) {
    throw new Error("Could not find file!");
}

const latest = await (await fetch("https://raw.githubusercontent.com/htl-stp/ifnode/refs/heads/main/public/data/latest.json")).json()
const versions = await (await fetch("https://raw.githubusercontent.com/htl-stp/ifnode/refs/heads/main/public/data/index.json")).json()

let version = params.get("version");
if (!version) {
    version = latest[file];
}

const url = `https://raw.githubusercontent.com/htl-stp/ifnode/refs/heads/main/public/data/history/${file}/${version}`

const res = await fetch(url);
let md = await res.text()
md = fixImagePaths(md)
const html = await marked(md)

document.getElementById("title")!.textContent = file
document.getElementById("content")!.innerHTML = html;

hljs.highlightAll()
