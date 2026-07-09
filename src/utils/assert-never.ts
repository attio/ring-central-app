export function assertNever(...[,]: [never]): never {
    throw new Error("Branch with checkNever executed")
}
