import express from "express"
const app = express()
const port = 8080

app.get("/", (req, res) => {
    res.send("I am still alive")
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})