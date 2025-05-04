const Booking = require('../Models/bookingModel')
const Room = require('../Models/roomModel')

exports.bookRoom = async(req, res)=>{
    try{
        const {guestId, roomId, checkInDate, checkOutDate, totalAmount} = req.body
        const room = await Room.findById(roomId)
        if(!room){
            return res.status(404).json({
                message:'Room not Found'
            })
        } 
        const existingBookedRoom = await Booking.findOne({roomId})
        if(existingBookedRoom){
            return res.status(401).json({
                status:'Fail',
                message:'Room already booked',
            })
        }
        const bookedRoom = new Booking({
            guestId,
            roomId,
            checkInDate,
            checkOutDate,
            totalAmount
        })
        
        bookedRoom.bookingStatus = "checked-in"
          await bookedRoom.save()

          room.status = "occupied"
          await room.save()
         
        return res.status(201).json({
            status:'Success',
            message:'Booking successful',
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


exports.getAllBookedRooms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // default to page 1
        const limit = parseInt(req.query.limit) || 10; // default to 10 per page
        const skip = (page - 1) * limit;

        const search = req.query.search || '';
        const statusFilter = req.query.status;

        const query = {};

        if(search){
            query.$or = [
                {guestName:{$regex:search, $options:'i'}},
                {bookingStatus:{$regex:search, $options:'i'}},
            ]
        }

        if(statusFilter){
            query.status = statusFilter;
        }

        const sortField = req.query.sort || '-createdAt'
        const sortBy = {}

        if(sortField.startsWith('-')){
            sortBy[sortField.substring(1)] = -1;
        }else {
            sortBy[sortField] = 1
        }

        const total = await Booking.countDocuments(query);
        const allBooked = await Booking.find(query)
            .skip(skip)
            .limit(limit)
            .sort(sortBy); // optional: sort latest first
            

           
             if(skip >= total && total !== 0) {
                throw new Error('This page does not exist')
             }

        return res.status(200).json({
            status: 'Success',
            message: 'Data fetched for all bookings',
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: allBooked
        });
    } catch (err) {
        return res.status(500).json({
            status: 'Fail',
            message: 'Internal server error',
            error: err.message
        });
    }
};



exports.getBookedRoomById = async(req, res)=>{
    const {bookingId} = req.params
    try{
        const bookedRoom = await Booking.findById(bookingId)
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
    const {bookingId} = req.params
    try{
        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, req.body, {new:true, runValidators:true})
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

exports.cancelBooking = async(req, res) =>{
    try{
        const {bookingId} = req.params
        const cancelledBooking = await Booking.findByIdAndUpdate(bookingId,{active:false})
        if(!cancelledBooking){
            return res.status(404).json({
                message:'Booking not found'
            })
        }
        const room = await Room.findById(cancelledBooking.roomId)
        if(room){
            cancelledBooking.bookingStatus = "cancelled"
            await cancelledBooking.save()
            room.status = "available";
            await room.save()
        }
        return res.status(200).json({
            status:'success',
            message:'Booking successfully cancelled',
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