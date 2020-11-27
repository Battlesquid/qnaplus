import { searchDB } from "../db/database"
import type { QaQuery } from "../types"
import type express from "express"

const resolveQuery = (searchterm: any, wholeword: any, page: any): QaQuery => {
    return {
        searchterm: searchterm?.replace(/[\'/\/;]/g, ""),
        wholeword: wholeword === "true" ? true : false,
        page: isNaN(page) ? 1 : +page
    }
}

export default async (req: express.Request) => {
    const { searchterm, wholeword, page } = req.query;
    const query = resolveQuery(searchterm, wholeword, page);

    const data = await searchDB({
        searchterm: query.searchterm,
        wholeword: query.wholeword,
        page: query.page
    })

    data.sort((a, b) => +a.id - +b.id);

    const pageCount = Math.ceil(data.length / 10);
    const paginatedResults = data.slice((query.page - 1) * 10, query.page * 10)
    const paginationStart = Math.max(Math.min(query.page - 5, pageCount - 9), 1);
    const paginationEnd = Math.min(Math.max(query.page + 4, 10), pageCount)

    console.log("Start: ", paginationStart, "\nEnd: ", paginationEnd, "\n")

    return {
        ok: true,
        data: paginatedResults,
        searchterm: query.searchterm,
        wholeword: query.wholeword,
        pages: {
            length: pageCount,
            current: query.page,
            paginationStart,
            paginationEnd
        }
    }
}