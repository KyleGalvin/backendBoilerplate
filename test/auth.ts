import "mocha";

// https://jonathas.com/token-based-authentication-in-nodejs-with-passport-jwt-and-bcrypt/

import User from "../src/models/users";

const testUser = { "username": "testuser", "password": "mytestpass" };

const createUser = async (): Promise<any> => {
    const UserModel = new User(testUser);
    await UserModel.save();
};

const getUser = async (): Promise<any> => {
    let users = await User.find({});
    if (users === null || users.length === 0 || users === undefined) {
        await createUser();
        return await getUser();
    } else {
        return new Promise((resolve, reject) => resolve(users[0]));
    }
};

export const login = async (): Promise<any> => {
    let user = await getUser();
    return request.post(process.env.API_BASE + "login")
        .send({ "username": user.username, "password": testUser.password })
        .expect(200);
};