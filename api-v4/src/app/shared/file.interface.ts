export interface FileResponse {
    status_code: number,
    data: FilePayload,
    message: string
}

interface FilePayload {
    filename: string,
    originalname: string,
    mimetype: string,
    size: number,
    encoding: string,
    uri: string
}