declare namespace Express {
  export interface Request {
    actor: {
      name?: string
    }
  }
}

declare module "http" {
  export interface IncomingHttpHeaders {
    ["x-api-key"]?: string
  }
}
