import express, { response } from 'express'

import ClassController from './controllers/ClassesController';
import ConnectionController from './controllers/ConnectionsController';

const routes = express.Router()

// Controllers
const classesController = new ClassController()

routes.post('/classes', classesController.create)
routes.get('/classes', classesController.index)

const connectionController = new ConnectionController()

routes.post('/connections', connectionController.create)
routes.get('/connections', connectionController.index)

export default routes;