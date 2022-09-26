export type IFiles =
  | {
      [fieldname: string]: Express.Multer.File[];
    }
  | Express.Multer.File[]
  | any;