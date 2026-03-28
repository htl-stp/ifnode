const res = await fetch("https://raw.githubusercontent.com/htl-stp/ifnode/refs/heads/main/public/data/latest.json")
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