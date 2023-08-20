export function fetcher<JSON = any>(input: any, init?: any): Promise<JSON> {
    return fetch(input, init).then((r) => {
        if (r.ok) {
            return r.json();
        }
        throw new Error(r.statusText);
    });
}
