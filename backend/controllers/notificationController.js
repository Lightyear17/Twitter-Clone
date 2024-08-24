import Notification from "../model/NotificationModel.js";

export const getNotifications = async (req, res) => {

    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const userId = req.user._id;
        
        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "userName profileImg"
        });
        

        if (!notifications) {
            return res.status(404).json({ message: "No notifications found" });
        }

        await Notification.updateMany({ to: userId }, { read: true });

        res.status(200).json({ notifications });

    } catch (error) {
        
        res.status(500).json({ message: "Internal Server Error" });
    }   
}

export const deleteNotification = async (req, res) => {
        try {

            const userId = req.user._id;
            await Notification.deleteMany({ to: userId });

            res.status(200).json({ message: "Notifications deleted Successfully" });



        } catch (error) {
            
            
            res.status(500).json({ message: error.message });

        }
}