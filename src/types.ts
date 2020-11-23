export interface QaQuery {
    searchterm: string,
    wholeword?: boolean
}

export type QnaRow = {
    id: string,
    url: string,
    title: string,
    question: string,
    answer: string
}