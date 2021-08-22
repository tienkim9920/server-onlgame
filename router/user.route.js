const User = require('../model/user.model')
const fs = require('fs')

const express = require('express')

const router = express.Router()

router.post('/', async (req, res) => {

    const { username } = req.body

    const user = await User.findOne({ username })

    if (user){
        res.json({
            msg: "Invalid"
        })
    }else{
        await User.create(req.body)

        res.json({
            msg: "Success"
        })
    } 
})

router.post('/login', async (req, res) => {

    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (user){
        if (password === user.password){
            res.json(user)
        }else{
            res.json({
                msg: 'Password invalid'
            })
        }
    }else{
        res.json({
            msg: 'Username invalid'
        })
    }

})

router.get('/:id', async (req, res) => {
    
    const id = req.params.id

    const user = await User.findOne({ _id: id })

    res.json(user)

})

router.patch('/', async (req, res) => {

    const { _id, password, fullname } = req.body

    const user = await User.findOne({ _id })

    user.fullname = fullname
    user.password = password

    user.save()

    res.json("Update Success")
    
})

router.patch('/image', async (req, res) => {

    const user = await User.findOne({ _id: req.body._id })

    // the first must be delete image previous
    const path = user.image
    
    // const newPath = path.replace('https://server-lover.herokuapp.com/', './public/')
    const newPath = path.replace('http://localhost:4000/', './public/')
    
    // delete file path
    fs.unlink(newPath, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })

    // next step will update image
    var fileImage = req.files.file;

    var fileName = fileImage.name

    // create path to client get image
    // var fileProduct = "https://server-lover.herokuapp.com/" + fileName
    var fileProduct = "http://localhost:4000/" + fileName

    user.image = fileProduct

    // move file name in folder public
    fileImage.mv('./public/' + fileName)

    user.save()

    res.json({
        msg: "Success",
        image: fileProduct
    })

})

module.exports = router