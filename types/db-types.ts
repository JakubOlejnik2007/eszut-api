import mongoose from "mongoose"

export interface ICategory {
    _id?: mongoose.Schema.Types.ObjectId,
    name: string
}

export interface IPlaces {
    _id?: mongoose.Schema.Types.ObjectId,
    name: string
}

export interface IProblem {
    _id: mongoose.Schema.Types.ObjectId,
    priority: number,
    PlaceID: mongoose.Schema.Types.ObjectId,
    whoName: string,
    whoEmail: string,
    what: string,
    when: number,
    isSolved: boolean,
    dateOfSolved?: number,
    whoSolvedID?: mongoose.Schema.Types.ObjectId,
    whoSolved?: string,
    isUnderRealization: boolean,
    whoDealsID?: mongoose.Schema.Types.ObjectId,
    whoDeals?: string,
    CategoryID: mongoose.Schema.Types.ObjectId
}

export interface IComment {
    _id?: mongoose.Schema.Types.ObjectId,
    AdministratorID?: mongoose.Schema.Types.ObjectId,
    ProblemID: mongoose.Schema.Types.ObjectId,
    date?: number,
    content: string
}

export interface IUser {
    _id?: string,
    name: string,
    email: string,
    password?: string
}

export interface ILOG {
    date: number,
    content: string,
    error: string
}