const USER = require("../../models/user/userModel");

module.exports = class userService {
    // Create a new user
    static async createUser(data) {
        try {
            let createUser = await new USER(data).save();
            return createUser;
        } catch (err) {
            return `Could not create user: ${err}: service error`;
        }
    }

    static async findOneUser(query, projection) {
        try {
            let findUser = await USER.findOne(query, projection);
            return findUser;
        } catch (err) {
            return `Could not find user: ${err}: service error`;
        }
    }

    static async findAllUsers(query, projection) {
        try {
            let findUsers = await USER.find(query, projection);
            return findUsers;
        } catch (err) {
            return `Could not find users: ${err}: service error`;
        }
    }

    static async updateUser(query, data) {
        try {
            let updatedUser = await USER.findOneAndUpdate(query, data, { new: true });
            return updatedUser;
        } catch (err) {
            return `Could not update user: ${err}: service error`;
        }
    }

    static async deleteUser(query) {
        try {
            let updatedUser = await USER.findOneAndUpdate(query, {isDeleted:true}, { new: true });
            return updatedUser;
        } catch (err) {
            return `Could not delete user: ${err}: service error`;
        }
    }

    static async aggregateUser(query){
        try {
            let aggregatedUser = await USER.aggregate(query);
            return aggregatedUser;
        } catch (err) {
            return `Could not aggregate user: ${err}: service error`;
        }
    }
}