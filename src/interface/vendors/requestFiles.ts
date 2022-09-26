import {Request} from 'express'

export default interface IImage extends Request{
    image: string | any[] | { [fieldname: string]: Express.Multer.File[]; } | undefined
}

