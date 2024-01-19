export const groupby = <T>(arr: T[], fn: (item: T) => any) => {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
        const key = fn(curr);
        const group = prev[key] || [];
        group.push(curr);
        return { ...prev, [key]: group };
    }, {});
}
