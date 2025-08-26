
let Users = [
  {
    id: 1,
    name: "Ujjwal Shakeya",
    email: "ujjwalshakeya1@gmail.com",
    password: "abc123",
  },
];

export default class UserModel {
  constructor(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
  
  static async updatePassword(email, newPassword) {
    const user = Users.find((u) => u.email === email);
    if (user) {
      user.password = newPassword;
    }
    return user;
  }
}
