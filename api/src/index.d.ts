declare namespace Express {
  export interface Request {
    actor: {
      id: string
      permissions: string[]
      system: boolean
    }
  }
}

declare module "http" {
  export interface IncomingHttpHeaders {
    ["x-api-key"]?: string
  }
}
