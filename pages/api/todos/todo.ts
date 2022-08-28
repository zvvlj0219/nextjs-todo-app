import { NextApiResponse, NextApiRequest } from 'next'
import TodoSchema from '../../../models/Todo'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        body: { todo, _id },
        method,
    } = req

    switch (method) {
        case 'POST': {
            const newTodo = await TodoSchema.create({
                todo
            })
        
            return res.status(200).json({ result: newTodo })
            break
        }
        case 'PUT': {
            const updatedTodo = await TodoSchema.findByIdAndUpdate(
                _id,
                {
                    $set: {
                        todo
                    }
                },
                {
                    returnDocument: 'after'
                }
            )

            return res.status(200).json({ result: updatedTodo })
            break
        }
        case 'DELETE': {
            await TodoSchema.findByIdAndDelete({
                _id
            })

            return res.status(200).json({})
            break
        }
    }



    res.status(200).send({ msg : 'api routes claer'})
}

export default handler