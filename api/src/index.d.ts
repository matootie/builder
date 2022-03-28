declare namespace Express {
  export interface Request {
    actor: {
      sub: string
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
