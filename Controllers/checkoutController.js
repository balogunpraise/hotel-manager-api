const Booking = require('../Models/bookingModel')
const Room = require('../Models/roomModel')


exports.checkoutRoom = async(req, res) =>{
    try{
        const {bookingId} = req.params
        const booking = await Booking.findById(bookingId)
        if(!booking){
            return res.status(404).json({
                status:'Fail',
                message:'Booking not found'
            })
        }
        const room = await Room.findById(booking.roomId)
        if(!room){
            return res.status(404).json({
                status:'Fail',
                message:'Room not found'
            })
        }
        room.status = "available"
        await room.save();

       booking.bookingStatus = "checked-out"
       await booking.save()

        return res.status(200).json({
            status:'Success',
            message: 'Checkout successful, room is now available'
        })
    } catch (err) {
        return res.status(500).json({ status: 'Error', message: err.message });
    }
}