import express from "express"
import search from "../../modules/searcher"

const home = express.Router();

home.get("/search", async (req, res) => {
    const response = await search(req);

    if (response.ok) 
        res.render('search', { response })
    else
        res.send("bruh")
})

home.get("/", (req, res) => {
    res.send("homepage")
})

export default home;  