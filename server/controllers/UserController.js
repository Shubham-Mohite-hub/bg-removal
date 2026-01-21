// UserController.js
import { Webhook } from "svix"
import { userModel } from "../models/userModel.js"

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

export {clerkWebhooks, userCredits}