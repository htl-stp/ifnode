import { marked } from "marked";
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark.css';
import {data_url} from "./config.ts";
import "@htl-stp/core/style.css"

function fixImagePaths(md: string) {
    return md.replace(/!\[(.*?)]\((.*?)\)/g, (_, alt, src) => {
        const fileName = src.split("/").pop();
        const newSrc = `${data_url}/images/${src}`;
        return `![${alt}](${newSrc})`;
    });
}

const params = new URLSearchParams(window.location.search);

const file = params.get("file");
if (!file) {
    throw new Error("Could not find file!");
}

const latest = await (await fetch(`${data_url}/latest.json`)).json()
const versions = await (await fetch(`${data_url}/index.json`)).json()

let version = params.get("version");
if (!version) {
    version = latest[file];
}

const url = `${data_url}/history/${file}/${version}`

const res = await fetch(url);
let md = await res.text()
md = fixImagePaths(md)
const html = await marked(md)

document.getElementById("title")!.textContent = file
document.getElementById("content")!.innerHTML = html;

hljs.highlightAll()

const select: HTMLSelectElement = document.getElementById("versions") as HTMLSelectElement;
for (const v of versions[file].sort().reverse()) {
    let text = v.split("T")[0];

    if (v === latest[file]) {
        text += " (latest)"
    }

    const option = document.createElement("option");
    option.innerText = text
    option.value = v;
    option.selected = v === version;

    console.log(option);

    select.append(option);
}

console.log(versions[file])

select.onchange = (e) => {
    window.location.href=`view.html?file=${file}&version=${select.value}`;
}