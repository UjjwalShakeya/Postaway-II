// importing required modules
import ApplicationError from "../../../utils/ApplicationError.js";

let Users = [
  {
    id: 1,
    name: "Ujjwal Shakeya",
    email: "ujjwalshakeya1@gmail.com",
    password: "abc123",
  },
];

export default class UserModel {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async signUp(name, email, password) {
    const newUser = new UserModel(Users.length + 1, name, email, password);
    Users.push(newUser);
    return newUser;
  }

  static async findByEmail(email) {
    return Users.find((u) => u.email === email);
  }
  
  static async updatePassword(email, newPassword) {
    const user = Users.find((u) => u.email === email);
    if (user) {
      user.password = newPassword;
    }
    return user;
  }
}
