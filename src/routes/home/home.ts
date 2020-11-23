import express from "express"
import search from "../../modules/searcher"

const home = express.Router();

home.get("/search", (req, res) => {
    const data = search(req)
    res.render('search', { data })
})

home.get("/", (req, res) => {
    res.send("homepage")
})

export default home; 