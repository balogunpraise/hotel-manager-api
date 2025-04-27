const Booking = require('../Models/bookingModel')

exports.bookRoom = async(req, res)=>{
    try{
        const {guest, room, checkInDate, checkOutDate, totalAmount} = req.body
        const bookedRoom = new Booking({
            guest,
            room,
            checkInDate,
            checkOutDate,
            totalAmount
        })
        if(!bookedRoom){
            return res.status(404).json({
                status:'Fail',
                message:'User has not yet booked a room'
            })
        }
            
        const existingBookedRoom = await Booking.findOne({guest})
        if(existingBookedRoom){
            return res.status(401).json({
                status:'Fail',
                message:'User already booked a room',
            })
        }else{
          await bookedRoom.save()
        return res.status(201).json({
            status:'Success',
            message:'Booking successful',
            data:bookedRoom
        })
    }

    }catch(err){
        return res.status(500).json({
            status:'Fail',
            message:'Internal server error',
            error: err.message
        })
    }
}

exports.getAllBookedRooms = async(req, res) =>{
    try{
        const allBooked = await Booking.find()
        return res.status(200).json({
            status:'Success',
            message:'datas fetched for all bookings',
            data:allBooked
        })
    }catch(err){
        return res.status(500).json({
            status:'Fail',
            message:'Internal server error',
            error: err.message
        })
    }
}

exports.getBookedRoomById = async(req, res)=>{
    const {id} = req.params
    try{
        const bookedRoom = await Booking.findById(id)
        if(!bookedRoom){
            return res.status(404).json({
                status:'Fail',
                message:'no booking found'
            })
        }
        return res.status(200).json({
            status:'Success',
            message:'Data fetched for a booking',
            data:bookedRoom
        })
    }catch(err){
        return res.status(500).json({
            status:'Fail',
            message:'Internal server error',
            error: err.message
        })
    }
}

exports.updateBooking = async(req, res) =>{
    const {id} = req.params
    try{
        const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {new:true, runValidators:true})
        if(!updatedBooking){
            return res.status(404).json({
                message:'No booking found'
            })
        }
        return res.status(200).json({
            status:'Success',
            message:'Booking successfully updated',
            data:updatedBooking
        })
    }catch(err){
        return res.status(500).json({
            status:'Fail',
            message:'Internal server error',
            error: err.message
        })
    }
}

exports.deleteBookedRoom = async(req, res) =>{
    const {id} = req.params
    try{
        const deletedBooking = await Booking.findByIdAndDelete(id)
        return res.status(200).json({
            status:'success',
            message:'Booking successfully deleted',
            data:null
        })
    }catch(err){
        return res.status(500).json({
            status:'Fail',
            message:'Internal server error',
            error: err.message
        })
    }
}