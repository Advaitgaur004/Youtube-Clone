const generateAccessAndRefreshToken = async (user, User) => {
    try {
        const user_ = await User.findById(user._id);
        if (!user_) {
            throw new Error('User not found');
        }

        const accessToken = await user_.generateAccessToken();
        const refreshToken = await user_.generateRefreshToken();

        user_.refreshToken = refreshToken;
        await user_.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
        
    } catch (err) {
        console.error('Error generating tokens:', err);
        throw err; // re-throw the error to handle it in the calling function
    }
};

export default generateAccessAndRefreshToken;
