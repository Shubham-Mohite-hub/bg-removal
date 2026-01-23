// UserController.js
import { Webhook } from "svix"
import { userModel } from "../models/userModel.js"
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModels.js";

const clerkWebhooks = async (req, res) => {
    try {
        // req.body is now a Buffer from express.raw()
        const payload = req.body.toString(); 
        const headers = req.headers;

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify using the raw string payload
        await whook.verify(payload, {
            "svix-id": headers["svix-id"],
            "svix-timestamp": headers["svix-timestamp"],
            "svix-signature": headers["svix-signature"],
        });

        // Parse the verified payload to use in your logic
        const { data, type } = JSON.parse(payload);

        switch (type) {
            case "user.created": {
        const primaryEmail = data.email_addresses?.[0]?.email_address || "";
        const userData = {
            clerkId: data.id,
            email: primaryEmail,
            firstName: data.firstName || data.first_name || "",
            lastName: data.lastName || data.last_name || "",
            photo: data.image_url || "",
            creditBalance: 5
        };

        // This replaces userModel.create(userData)
        // It's smarter: it updates if the user exists, or creates if they don't
        await userModel.findOneAndUpdate(
            { clerkId: data.id }, 
            userData, 
            { upsert: true, new: true }
        );
        
        console.log("✅ User Synced (Created or Updated)!");
        res.json({ success: true });
        break;
    }
    
    case "user.updated": {
        const primaryEmail = data.email_addresses?.[0]?.email_address || "";
        const userData = {
            email: primaryEmail,
            firstName: data.firstName || data.first_name || "",
            lastName: data.lastName || data.last_name || "",
            photo: data.image_url || ""
        }
        await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
        console.log("✅ User Updated!");
        res.json({ success: true });
        break;
    }

    case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        console.log("✅ User Deleted!");
        res.json({ success: true });
        break;
    }

    default:
        res.json({ success: true });
        break;
        }
    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
};



// API control function

const userCredits = async(req, res)=>{
    try {
        const {clerkId} = req.body
        const userData = await userModel.findOne({clerkId})

        if (!userData) {
            return res.json({ 
                success: false, 
                message: "User not found in database. Check if webhooks are working." 
            });
        }

        res.json({success:true,credits:userData.creditBalance})

        if (!userData) {
            console.log("User not found in MongoDB"); // ADD THIS
            return res.json({ success: false, message: "User not found" });
        }
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
        
        
    }
}


// const razorpayInstance = new razorpay({
//     key_id:process.env.RAZORPAY_KEY_ID,
//     key_secret:process.env.RAZORPAY_KEY_SECRET,
// })

// Api to make payment for credits
const paymentRazorpay = async(req, res)=>{
    try {

        const {clerkId, planId} = req.body

        const userData = await userModel.findOne({clerkId})

        if(!userData || !planId){
            return res.json({success:false, message:'Invalid Credintials'})
        }

        let credits, plan, amount, date

        switch (planId) {
            
            
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;


            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50 
                break;


            case 'Bussiness':
                plan = 'Bussiness'
                credits = 5000
                amount = 250 
                break;
        
            default:
                break;
        }


        date = Date.now()

        // creating Transaction
        const transactionData = {
            clerkId,
            plan, 
            amount,
            credits,
            date
        }

        const newTransaction = await transactionModel.create(transactionData)

        const options = {
            amount : amount * 10,
            currency : process.env.CURRENCY,
            reciept : newTransaction._id
        }

        await razorpayInstance.orders.create(options, (error, order)=> {
              if(error){
                return res.json({success:false, message:error.message} )
              }
              res.json({success:true, order})

        })
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }
}

// api controller function to verify the razorpay payment
const verifyRazorpay = async(req, res)=>{

    try {

        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid'){
            const transactionData = await transactionModel.findById(orderInfo.reciept)
            if(transactionData.payment){
                return res.json({success:false, message:'Payment Failed'})
            }
            // Adding Credits in user Data

            const userData = await userModel.findOne({clerkId:transactionData.clerkId})
            const creditBalance = userData.creditBalance + transactionData.credits
            await userModel.findByIdAndUpdate(userData._id, {creditBalance})

            // making the payment true
            await transactionModel.findByIdAndUpdate(transactionData._id, {payment:true})

            res.json({success:true, message:"Credit Added"});

        }
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:error.message})
    }

}

export {clerkWebhooks, userCredits, paymentRazorpay, verifyRazorpay}