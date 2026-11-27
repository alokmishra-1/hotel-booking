import { protect,adminOnly } from '../middleware/authMiddleware.js'
import { getHotel,getHotelId,createHotel,updateHotel,deleteHotel } from '../controller/hotelController.js'
import { Router } from 'express'
import { createRoom } from '../controller/roomController.js'

const router = Router()

router.get('/',getHotel)
router.get('/:id',getHotelId)

router.post('/',protect,createHotel)
router.post('/:id/rooms', protect, createRoom)
router.put('/:id',protect,adminOnly,updateHotel)
router.delete('/:id',protect,adminOnly,deleteHotel)

export default router