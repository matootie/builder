declare module "*.jpeg"
declare module "*.jpg"
declare module "*.png"
declare module "*.webp"
declare module "*.tiff"
declare module "*.heic"
declare module "*.heif"
declare module "*.avif"
declare module "*.raw"

declare global {
  interface Guild {
    id: string
    name: string
    icon: string
  }
}

export {}
