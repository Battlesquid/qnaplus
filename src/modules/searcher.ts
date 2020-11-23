import { search } from "../db/database"
import type { QaQuery } from "../types"
import type express from "express"

const resolveQuery = (searchterm: any, wholeword: any): QaQuery => {
    return {
        searchterm,
        wholeword: wholeword === "true" ? true : false
    }
}

export default (req: express.Request) => {
    const { searchterm, wholeword } = req.query;
    const query = resolveQuery(searchterm, wholeword);

    const data = search({
        searchterm: query.searchterm,
        wholeword: query.wholeword
    })

    const sortedData = data.sort((a, b) => +a.id - +b.id);
    console.log(sortedData)

    return data
}