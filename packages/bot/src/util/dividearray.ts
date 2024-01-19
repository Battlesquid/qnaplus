export const dividearray = <T>(items: T[], sliceLength: number) => {
    const results: T[][] = [];
    const sliceCount = Math.ceil(items.length / sliceLength);
    for (let i = 0; i < sliceCount; i++) {
        const start = i * sliceLength;
        const end = Math.min(items.length, start + sliceLength);
        results.push(items.slice(start, end));
    }
    return results;
}
