import { Document } from 'mongoose'

export default interface IUser extends Document{
  fname: string,
  lname: string,
  email: string,
  profileImage: string,
  phone: string,
  password: string,
  address: {
    shipping: {
      street: string,
      city: string,
      pincode: number
    },
    billing: {
      street: string,
      city: string,
      pincode: number
    }
  }
}