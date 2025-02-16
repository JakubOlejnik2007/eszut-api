import mongoose from "mongoose"
import LOGTYPES from "./logtypes.enum"

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
    whoSolvedEmail?: string,
    whoSolvedName?: string,
    isUnderRealization: boolean,
    whoDealsName?: string,
    whoDealsEmail?: string,
    CategoryID: mongoose.Schema.Types.ObjectId
}

export interface IComment {
    _id?: mongoose.Schema.Types.ObjectId,
    authorName: string;
    authorEmail: string;
    ProblemID: mongoose.Schema.Types.ObjectId,
    date?: number,
    content: string
}

export interface ILOG {
    date: number,
    content: string,
    userEmail: string,
    type: LOGTYPES
}