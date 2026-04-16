import fs from "fs";
import path from "path";
import {getAllImagesInMarkdown} from "./processing";
import {toAbsolute} from "./utils";
import {data_path, image_path} from "./config";

export function saveFileIfChanged(name: string, md: string, hash: string) {
    const statePath = path.join(data_path, "state.json");
    const historyDir = path.join(data_path, "history", name);

    if (!fs.existsSync(data_path)) fs.mkdirSync(data_path, { recursive: true });

    let state: Record<string, string> = {};
    try {
        state = JSON.parse(fs.readFileSync(statePath, "utf8"));
    } catch {}

    const prevHash = state[name];

    if (prevHash === hash) {
        console.log(`${name} has not changed.`)
        return;
    }

    state[name] = hash;
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

    const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
    fs.mkdirSync(historyDir, { recursive: true });
    fs.writeFileSync(path.join(historyDir, `${timestamp}.md`), md);

    console.log(`${name} has changed.`)

    const images = getAllImagesInMarkdown(md);
    images.forEach(async image => {
        console.log(`- scraping ${image}`)

        const imageUrl = toAbsolute(image);

        await saveImage(imageUrl, `${image_path}${image}`)
    })
}

async function saveImage(url: string, localPath: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed ${url}`);

    const buffer = Buffer.from(await res.arrayBuffer());

    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, buffer);
}