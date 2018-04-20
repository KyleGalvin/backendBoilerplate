import {Group, IGroupSerialized} from "../models/entities/group";
import {IGroup} from "../models/entities/IGroup";

export class GroupFactory {
    public async Create(groupData: IGroupSerialized) {
        const group = new Group();
        group.id = groupData.id;
        group.name = groupData.name;
        return group;
    }
}
