import fs from "fs";
import path from "path";

export function saveFileIfChanged(name: string, md: string, hash: string) {
    const statePath = "./public/data/state.json";
    const historyDir = path.join("./public/data/history", name);

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
}