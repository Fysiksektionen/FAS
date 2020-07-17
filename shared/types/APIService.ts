interface APIServiceInit {
    status: 'init'
}
interface APIServiceLoading {
    status: 'loading'
}
interface APIServiceLoaded<T> {
    status: 'loaded'
    payload: T
}
interface APIServiceUnauthorized {
    status: 'unauthorized'
}
interface APIServiceError {
    status: 'error'
    error: Error
}

export type APIService<T> =
    | APIServiceInit
    | APIServiceLoading
    | APIServiceLoaded<T>
    | APIServiceUnauthorized
    | APIServiceError