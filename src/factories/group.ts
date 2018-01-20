import {Group, IGroup} from "../models/entities/group";

export class GroupFactory {
    public async Create(groupData: IGroup) {
        const group = new Group();
        group.id = groupData.id;
        group.name = groupData.name;
        return group;
    }
}
