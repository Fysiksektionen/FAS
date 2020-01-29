
async function as<T>(promise: Promise<T>): Promise<[null, T] | [object, undefined]> {
    try {
        return [null, await promise];
    } catch (error) {
        return [error, undefined];
    }
}

export default as;