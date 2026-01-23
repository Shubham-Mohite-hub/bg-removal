import mongoose from 'mongoose'

const transctionSchema = new mongoose.Schema({
    clerkId:{type:String, required:true},
    plan:{type:String, required:true},
    ammount:{type:Number, required:true},
    credits:{type:Number, required:true},
    payment:{type:Boolean, required:true},
    date:{type:Number}

})

const transactionModel = mongoose.models.transaction || mongoose.model('transction',transctionSchema)

export default transactionModel