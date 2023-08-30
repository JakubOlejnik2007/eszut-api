import mongoose from "mongoose"

export interface ICategory {
    _id?: mongoose.Schema.Types.ObjectId,
    name: String
}

export interface IPlaces {
    _id?: mongoose.Schema.Types.ObjectId,
    name: String
}

export interface IProblem {
    _id?: mongoose.Schema.Types.ObjectId,
    priority: Number,
    PlaceID: mongoose.Schema.Types.ObjectId,
    who: String,
    what: String,
    when: Number,
    isSolved: Boolean,
    dateOfSolved?: Number,
    whoSolvedID?: mongoose.Schema.Types.ObjectId,
    whoSolved?: String,
    isUnderRealization: Boolean,
    whoDealsID?: mongoose.Schema.Types.ObjectId,
    whoDeals?: String,
    CategoryID: mongoose.Schema.Types.ObjectId
}

export interface IAdministrator {
    _id?: mongoose.Schema.Types.ObjectId,
    name: String,
    password?: String,
    email: String
}

export interface IComment {
    _id?: mongoose.Schema.Types.ObjectId,
    AdministratorID?: mongoose.Schema.Types.ObjectId,
    ProblemID: mongoose.Schema.Types.ObjectId,
    date?: Number,
    content: String
}

export interface ISubscription {
    endpoint: string;
    keys: {
        auth: string;
        p256dh: string
    }
}

export interface IUser {
    _id?: string,
    name: string,
    email: string,
    password?: string
}