import User from "../models/user.model.js";

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.create({ email, password });

        res.status(201).json({ 
            success: true,
            message: "User created successfully",
            data: user
         });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Something went wrong",
            error: error.message
         });
    }
};

const login = async (req, res) => {};


const userControlers = {
    register,
    login
}

export default userControlers;