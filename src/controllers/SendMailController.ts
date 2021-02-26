import { Request, Response } from 'express';
import {resolve} from 'path';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import {SurveyUserRepository} from '../repositories/SurveyUserRepository'
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
class SendMailController{
    async execute(request: Request, response: Response){
        const {email,survey_id} = request.body;
        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveyUserRepository);

        const user = await usersRepository.findOne({email})
        if(!user){
            return response.status(400).json({
                error:"User does not exists",
            })
        }

        const surveys = await surveysRepository.findOne({id:survey_id})
        if(!surveys){
            return response.status(400).json({
                error:"Survey does not exists",
            })
        }
        const variables ={
            name:user.name,
            title:surveys.title,
            description:surveys.description,
            user_id:user.id,
            link:process.env.URL_MAIL
        }
        const npsPath = resolve(__dirname,"..","views","emails","npsMail.hbs");
        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where:[{user_id :user.id}, {value:null}]
        })

        if(surveyUserAlreadyExists){
            await SendMailService.execute(email,surveys.title,variables,npsPath)
            return response.json(surveyUserAlreadyExists)
        }
        const surveyUser = surveysUsersRepository.create({
            user_id:user.id,
            survey_id:survey_id
        })
        
        await surveysUsersRepository.save(surveyUser)

        await SendMailService.execute(email,surveys.title,variables,npsPath)
        return response.json(surveyUser)
    }
}

export {SendMailController}

