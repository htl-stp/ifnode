import * as cheerio from "cheerio"
import fs from "fs"
import path from "path"
import {fetchFile} from "./processing";
import {saveFileIfChanged} from "./save";
import {data_path} from "./config";

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

// scrape and save files
for (const name of elements.keys()) {
    const { content, hash } = await fetchFile(name);
    saveFileIfChanged(name, content, hash);
}

const  historyPath = path.join(data_path, `history`)

// build index.json
const indexData: Record<string, string[]> = {}
const files = fs.readdirSync(historyPath)
for (const file of files) {
    const versions = fs.readdirSync(path.join(historyPath,file))
    indexData[file] = versions;
}

fs.writeFileSync(path.join(data_path, "index.json"), JSON.stringify(indexData, null, 2));
console.log("Successfully created index.json")

// build latest.json
const latestData: Record<string, string> = {}
for (const file of Object.keys(indexData)) {
    const values = indexData[file];

    const latest = values.sort().at(-1)!

    latestData[file] = latest;
}
fs.writeFileSync(path.join(data_path, "latest.json"), JSON.stringify(latestData, null, 2));
console.log("Successfully created latest.json")