export interface Query {
    query: string,
    wholeword?: boolean,
    page: number
}

export type QnaRow = {
    id: string,
    url: string,
    title: string,
    question: string,
    answer: string,
    tags: string
}

export type ArchiverOptions = {
    directory: string,
    categories: string[],
    force?: boolean,
    verbose?: boolean
}