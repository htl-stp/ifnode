const res = await fetch("/data/latest.json")
const json = await res.json()

console.log(json)

const main = document.getElementById("list")!

for (const file of Object.keys(json)) {
    const link = json[file]

    const a = document.createElement("a")
    a.innerText = file;
    a.href = `data/history/${file}/${link}`

    main.appendChild(a)
}