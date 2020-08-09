import db from '../database/connection'
import convertHourToMinutes from '../utils/convertHoursToMinutes'
import { Request, Response } from 'express';

interface ScheduleItem
{
    week_day: number,
    from: string,
    to: string
}

export default class ClassController
{
    async index(req: Request, res: Response) 
    {
        const { week_day, subject, time } = req.query;

        if (!week_day || !subject || !time)
        {
            return res.status(400).json({ error: "missing filters" })
        }

        const timeInMinutes = convertHourToMinutes(time as string)

        const classes = await db('classes')
            .whereExists(function ()
            {
                this.select('classes_schedule.*')
                    .from('classes_schedule')
                    .whereRaw(
                        '`classes_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw(
                        '`classes_schedule`.`week_day` = ??',
                        [ Number(week_day) ])
                    .whereRaw(
                        '`classes_schedule`.`from` <= ??',
                        [ timeInMinutes ])
                    .whereRaw(
                        '`classes_schedule`.`to` > ??',
                        [ timeInMinutes ])
            })
            .where("classes.subject", "=", subject as string)
            .join("users", "classes.user_id", "=", "users.id")
            .select([ "classes.*", "users.*" ])

        return res.json(classes)
    }



    async create(req: Request, res: Response) 
    {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = req.body;

        // transaction make multiple actions at same time,
        // if one should failed roll back all of them.
        const trx = await db.transaction()

        try
        {

            const user_id = (await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            }))[ 0 ]

            const class_id = (await trx('classes').insert({
                subject,
                cost,
                user_id
            }))[ 0 ]

            const parsedSchedule = schedule.map(
                ({ week_day, from, to }: ScheduleItem) =>
                {
                    return {
                        class_id,
                        week_day,
                        from: convertHourToMinutes(from),
                        to: convertHourToMinutes(to)
                    }
                })

            const schedules_ids = await trx('classes_schedule').insert(parsedSchedule)

            // persist data
            await trx.commit();

            return res.status(201).send()
        }
        catch (e)
        {
            console.log(e)
            trx.rollback()
            return res.status(400).json({
                error: "Unexpected Error while creating new class!"
            })
        }
    }
}

