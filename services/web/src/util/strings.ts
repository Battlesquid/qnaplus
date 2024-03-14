export const applyWordLimit = (content: string | undefined | null, limit: number): string => {
    const limitedContent = content?.split(" ").slice(0, limit).join(" ");
    return limitedContent ? `${limitedContent}...` : "";
}

export const isEmpty = (content: string | undefined | null) => {
    return content?.trim() === "";
}