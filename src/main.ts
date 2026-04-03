import {data_url} from "./config.ts";
import "@htl-stp/core/style.css"

const res = await fetch(`${data_url}/latest.json`)
const json = await res.json()

console.log(json)

const main = document.getElementById("list")!

for (const file of Object.keys(json)) {
    const link = json[file]

    const a = document.createElement("a")
    a.innerText = file;
    a.href = `view.html?file=${file}`

    main.appendChild(a)
}