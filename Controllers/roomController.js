const { query } = require('express-validator')
const Room = require('../Models/roomModel')

exports.createRoom = async(req, res) =>{
    try{
        const {roomNumber, roomType, floor} = req.body
        const room = await Room.create({
            roomNumber,
            roomType,
            floor
        })
        console.log(req.body)
        if(!room){
            return res.status(404).json({
                status: 'Fail',
                message: 'Room not Found'
            })
        }
        return res.status(201).json({
            status:'Success',
            message: 'Room successfully created',
            data:room
        })
    }catch(err){
        return res.status(400).json({
            status: 'Fail',
            message: 'Bad request',
            error: err.message
        })
    }
}

exports.getAllRooms = async(req, res) =>{
    try{
        const page = parseInt(req.query.page)|| 1
        const limit = parseInt(req.query.limit)|| 10
        const skip = (page - 1) * limit
        const total = await Room.countDocuments()
        const allRooms = await Room.find()
              .skip(skip)
              .limit(limit)
              .sort({createdAt: -1})

         if(page){
            total
            if(skip >= total) throw new Error('This page does not exist')
         }     
        return res.status(200).json({
            status: 'Success',
            message: 'successfully fetched rooms',
            total,
            page,
            totalPages: Math.ceil(total/limit),
            data: allRooms
        })
        
    }catch(err){
        return res.status(400).json({
            status: 'Fail',
            message: 'Bad request',
            error: err.message
        })
    }
}

exports.getRoomById = async(req, res) =>{
    const {id} = req.params
    try{
        const room = await Room.findById(id)
        if(!room){
            return res.status(404).json({
                status: 'Fail',
                message: 'Room not found'
            })
        }
        return res.status(200).json({
            status: 'Success',
            message: 'successfully fetched a room',
            data:room
        })
    }catch(err){
        return res.status(400).json({
            status: 'Fail',
            message: 'Bad request',
            error: err.message
        })
    }
}

exports.updateRoom = async(req, res) =>{
    const {id} = req.params
    try{
        const updatedRoom = await Room.findByIdAndUpdate(id, req.body, {new:true, runValidators:true})
        if(!updatedRoom){
            return res.status(404).json({
                status: 'Fail',
                message: 'Room not Found'
            })
        }
        return res.status(200).json({
            status: 'Success',
            message: 'Room successfully Updated',
            data: updatedRoom
        })
    }catch(err){
        return res.status(400).json({
            status: 'Fail',
            message: 'Bad request',
            error: err.message
        })
    }
}

exports.deleteRoom = async(req, res) =>{
    const {id} = req.params
    try{
        const deletedRoom = await Room.findByIdAndDelete(id)
        if(!deletedRoom){
            return res.status(404).json({
                status: 'Fail',
                message: 'Room not found'
            })
        }
        return res.status(200).json({
            status: 'success',
            message: 'Room successfully deleted',
            data:null
        })
    }catch(err){
        return res.status(400).json({
            status: 'Fail',
            message: 'Bad request',
            error: err.message
        })
    }
}