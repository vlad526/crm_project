export interface IApiError {
    statusCode?: number;
    messages?: string | string[];
    message?: string | string[];
    timestamp?: string;
    path?: string;
}
