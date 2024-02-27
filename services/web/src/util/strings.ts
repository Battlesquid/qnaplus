export const applyWordLimit = (content: string | undefined | null, limit: number): string => {
    return content?.split(" ").slice(0, limit).join(" ") ?? "";
}

export const isEmpty = (content: string | undefined | null) => {
    return content?.trim() === "";
}