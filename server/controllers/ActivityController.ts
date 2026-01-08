const Activity = require("../models/domain/Activity");
import { IActivity } from '../models/domain/Activity';
const fns = require('date-fns');

const register = async (activity: IActivity) => {
    try {
        const { _id, ...activityWithoutId } = activity;
        let newActivity = await Activity.create(activityWithoutId);
        return newActivity;
    } catch (err: any) {
        console.log("Error: " + err.message);
    }
}

module.exports = {
    register
};