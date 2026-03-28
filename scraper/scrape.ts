import * as cheerio from "cheerio"
import fs from "fs"
import path from "path"
import {fetchFile} from "./processing";
import {saveFileIfChanged} from "./save";

const base = "https://ifnode.htlstp.ac.at/"

const res = await fetch(base)
const html = await res.text()

const $ = cheerio.load(html)

const elements = new Map<string, string>()

$("#list a").each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href") ?? "";

    elements.set(text, href);
})

for (const name of elements.keys()) {
    const { content, hash } = await fetchFile(name);
    saveFileIfChanged(name, content, hash);
}