'use strict'

const Register =  require('../models/register')

function getRegister(req,res){
  let registerId = req.params.registerId

  Register.findById(registerId, (err, register) => {
    console.log(err)
    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!register) return res.status(404).send({message:'Ese registro no existe'})

  res.status(200).send(register)
  })
}

function getRegisters(req, res){
  Register.find({}, (err, deliveries)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(deliveries.length == 0)return res.status(404).send({message:'No hay registros'})

    res.status(200).send(deliveries)
  })
}

function saveRegister(req,res){

  let register = new Register()
  register.worker = req.body.client
  register.domiciliario = req.body.domiciliario

  register.save((err, registerStored)=>{
    if(err){
      res.status(500).send({message :`Error al guardar el registro en la base de datos: ${err}`})
    }
    res.status(200).send({register: registerStored})
  })
}

function updateRegister(req,res){
  let registerId = req.params.registerId
  let update = req.body
  Register.findByIdAndUpdate(registerId, update,  (err, registerUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar el registro de la base de datos ${err}`})
    res.status(200).send(registerUpdated)
  })
}

function deleteRegister(req,res){
  let registerId = req.params.registerId
  Register.findById(registerId, (err, register) =>{
    if(err) return res.status(500).send({message:`Error al borrar el registro de la base de datos ${err}`})

    register.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar el registro de la base de datos ${err}`})
        res.status(200).send({message:'El registro ha sido borrada.'})
    })
  })
}

module.exports ={
  getRegister,
  getDeliveries,
  saveRegister,
  updateRegister,
  deleteRegister
}
