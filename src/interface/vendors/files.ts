// import Espress.Multer from "multer";

// export interface IFiles{
//   files?: {[fieldname: string]: Express.Multer.File[]} | Express.Multer.File[] | undefined;
// }

export type IFiles =
  | {
      [fieldname: string]: Express.Multer.File[];
    }
  | Express.Multer.File[]
  | any