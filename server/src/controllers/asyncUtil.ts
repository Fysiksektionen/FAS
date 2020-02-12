
export async function as<T>(promise: Promise<T>): Promise<[null, T] | [object, undefined]> {
    try {
        return [null, await promise];
    } catch (error) {
        return [error, undefined];
    }
}

// USE AT YOUR OWN RISK
export function hang<T>(promise: Promise<T>): T {
    let res, completed = false;
    promise.then((val: T) => {
        res = val;
        completed = true;
    }, (err) => {
        res = err;
        completed = true;
    });
    while (!completed) {
        // Intentional hanging = Risky business
    }
    return res;
}