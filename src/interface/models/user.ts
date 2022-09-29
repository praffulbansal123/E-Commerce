export default interface IUser {
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