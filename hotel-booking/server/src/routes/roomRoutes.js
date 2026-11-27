import {Router} from 'express'
import { protect,adminOnly } from '../middleware/authMiddleware.js'
import {createRoom,updateRoom, deleteRoom} from '../controller/roomController.js'

const router  = Router()
router.put('/:id',protect,adminOnly,updateRoom)
router.delete('/:id',protect,adminOnly,deleteRoom)

export default router

