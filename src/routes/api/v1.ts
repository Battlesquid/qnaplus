import express from "express"
import search from "../../modules/searcher"

const api = express.Router();

api.get("/", (req, res) => {
    res.send("api v1 homepage")
})

api.get("/search", async (req, res) => {
    console.time("query time");

    const searchResult = await search(req);

    if (searchResult.ok)
        res.send({ ok: searchResult.ok, data: searchResult.data })
    else
        res.send({ ok: false })

    console.timeEnd("query time")
})

export default api;