import { searchDB } from "../db/database"
import type { Query } from "../types"
import type express from "express"

const resolveUrlParams = (query: any, wholeword: any, page: any): Query => {
    return {
        query: query?.replace(/[\'/\/;]/g, ""),
        wholeword: wholeword === "true",
        page: isNaN(page) ? 1 : +page
    }
}

export default async (req: express.Request) => {
    const { query, wholeword, page } = req.query;
    const params = resolveUrlParams(query, wholeword, page);

    const results = await searchDB({
        query: params.query,
        wholeword: params.wholeword,
        page: params.page
    })

    results.sort((a, b) => +a.id - +b.id);

    const pageCount = Math.ceil(results.length / 12);
    const paginatedResults = results.slice((params.page - 1) * 12, params.page * 12)
    const paginationStart = Math.max(Math.min(params.page - 5, pageCount - 9), 1);
    const paginationEnd = Math.min(Math.max(params.page + 4, 10), pageCount)

    return { 
        ok: true,
        data: paginatedResults,
        query: params.query,
        wholeword: params.wholeword,
        pages: {
            length: pageCount,
            current: params.page,
            paginationStart,
            paginationEnd
        }
    }
}