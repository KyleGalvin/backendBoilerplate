import {User, IUserSerialized, IUser} from "../models/entities/user";

export class UserFactory {
    public async Create(userData: IUserSerialized): Promise<IUser> {
        const user = new User();
        user.username = userData.username;
        user.email = userData.email;
        user.firstName = userData.firstName;
        user.lastName = userData.lastName;
        await user.updatePassword(userData.password);
        return user;
    }
}
