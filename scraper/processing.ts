import {hash} from "./utils";
import * as cheerio from "cheerio"

const base = "https://ifnode.htlstp.ac.at"

export async function fetchFile(name: string) {
    const url = `${base}/${name}`
    const res = await fetch(url)
    const html = await res.text();

    const $ = cheerio.load(html)

    const slides: string[] = []

    $("section[data-markdown] > script[type='text/template']").each((_, s) => {
        const slideContent = $(s).html()?.trim() ?? "";
        slides.push(slideContent);
    })

    const md = slides.join("\n\n---\n\n");


    return {
        content: md,
        hash: hash(md)
    }
}


export function getAllImagesInMarkdown(markdown: string) {
    const regex = /!\[.*?]\((.+?)\)/g;
    const matches = [];
    let match;

    while ((match = regex.exec(markdown)) !== null) {
        matches.push(match[1]);
    }

    return matches;
}