import { Group, IGroup, IGroupSerialized } from "../models/entities/group";

export class GroupFactory {
    public async Create(groupData: IGroupSerialized) {
        const group = new Group();
        group.id = groupData.id;
        group.name = groupData.name;
        return group;
    }
}
