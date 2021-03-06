import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyUserRepository } from '../repositories/SurveyUserRepository';
class AnswerController {
    async execute(request: Request, response: Response){
        const {value} = request.params
        const {u} = request.query

        const surveysUsersRepository = getCustomRepository(SurveyUserRepository)

        const surveyUser = await surveysUsersRepository.findOne({
            id:String(u)
        })

        if(!surveyUser){
            return response.status(400).json({
                error:"Survey User does not exists"
            })
        }

        surveyUser.value = Number(value);

        await  surveysUsersRepository.save(surveyUser)

        return response.json(surveyUser)
    }
}

export {AnswerController}