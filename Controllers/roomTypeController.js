const RoomType = require('../Models/roomTypeModel')
const Room = require('../Models/roomModel')


exports.roomClasses = async(req, res) =>{
    try{
        const roomClass = ['Deluxe', 'Executive', 'Junior suite', 'Family suite']
        const { name,description, capacity, basePrice, amenities, size, bedType } = req.body;
        const suite =  new RoomType({
            name,
            description,
            capacity,
            basePrice,
            amenities,
            size,
            bedType})

            const existingSuite = await RoomType.findOne({name})
            if(existingSuite){
                return res.status(401).json({
                    message:'Room type already exists'
                })
            }
        if(!roomClass.includes(suite.name)){
            return res.status(404).json({
                message: 'Room type not found'
            })
        }else{
            await suite.save()
            return res.status(201).json({
                status: 'Success',
                message: 'Room type successfully created',
                data:{
                    id:suite._id,
                    name:suite.name,
                    description:suite.description,
                    capacity:suite.capacity,
                    basePrice:suite.basePrice,
                    amenities:suite.amenities,
                    size:suite.size,
                    bedType:suite.bedType
                }
            })
        }
        
    }catch(err){
        return res.status(400).json({
            status: 'Fail',
            message: 'Something went wrong',
            error: err.message
        })
    }
}

exports.getAllRoomClasses = async(req, res) =>{
    try{
        const allClasses = await RoomType.find()
        return res.status(200).json({
            status: 'Success',
            message: 'Room classes successfully Fetched',
            data: allClasses
        })
    }catch(err){
        return res.status(400).json({
            status: 'Fail',
            message: 'Something went wrong',
            error: err.message
        })
    }
}

exports.getRoomClassesById = async(req, res) =>{
    const {id} = req.params
    try{
        const getRoom = await RoomType.findById(id)
        if(!getRoom){
            return res.status(404).json({
                status:'Fail',
                message:'Room class not found'
            })
        }else{
            return res.status(200).json({
                status: 'Success',
                message: 'Room class successfully fetched',
                data:getRoom
            })
        }
    }catch(err){
        return res.status(400).json({
            status: 'Fail',
            message: 'Something went wrong',
            error: err.message
        })
    }
}

exports.updateRoomClass = async(req, res) =>{
   const {id} = req.params
   try{
    const updatedClass = await RoomType.findByIdAndUpdate(id,req.body, {new:true, runValidators:true})
    if(!updatedClass){
        return res.status(404).json({
            status: 'Fail',
            message: 'Room class not found'
        })
    }else{
        return res.status(200).json({
            status:'Success',
            message: 'Room class updated succcessfully',
            data:updatedClass
        })
    }

   }catch(err){
    return res.status(400).json({
        status: 'Fail',
        message: 'Something went wrong',
        error: err.message
    })
}
}

exports.deleteRoomClass = async(req, res) =>{
    const {id} = req.params
    try{
        const deletedRoomClass = await RoomType.findByIdAndDelete(id)
        if(!deletedRoomClass){
            return res.status(404).json({message: 'Room class not found'})
        }
        return res.status(200).json({
            status:'Success',
            message: 'Room class successfully deleted'
        })
    }catch(err){
    return res.status(400).json({
        status: 'Fail',
        message: 'Something went wrong',
        error: err.message
    })
}
}