import {User, IUserSerialized} from "../models/user";

export class UserFactory {
    public async Create(userData: IUserSerialized, password: string) {
        const user = new User();
        user.username = userData.username;
        user.email = userData.email;
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        await user.updatePassword(password);
        return user;
    }
}
