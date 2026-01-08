
const Role = require('../models/domain/Role');
const UserRole = require('../models/domain/UserRole');

import { Types } from 'mongoose';
import { IUserRole } from '../models/domain/UserRole';
import { IRole } from '../models/domain/Role';

export const getRoleName = async (companyId: string | Types.ObjectId, userId: string | Types.ObjectId) => {

    let userRole: IUserRole = await UserRole.findOne({ companyId: companyId, userId: userId });
    if (!userRole) return "";

    let role: IRole = await Role.findOne({ _id: userRole.roleId });
    if (!role) return "";

    return role.name;
}
    