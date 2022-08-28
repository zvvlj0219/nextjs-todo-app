import { ObjectId } from "mongoose"

export type Todo = {
    _id: string
    todo?: string
}

export type Doc = {
    _id: ObjectId
    createdAt: string
    updatedAt: string
}


// {
//     _id: new ObjectId("630b198dd26ebae1c29a414f"),
//     todo: 'created from todoschema',
//     createdAt: 2022-08-28T07:30:21.782Z,
//     updatedAt: 2022-08-28T07:30:21.782Z,
//     __v: 0
//   }