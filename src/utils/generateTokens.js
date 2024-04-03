const generateAccessAndRefreshToken = async (user,User) => {
    try{
        const user_ = await User.findById(user._id)
        const accessToken = await user_.generateAccessToken()
        const refreshToken = await user_.generateRefreshToken()

        user_.refreshToken = refreshToken
        await user_.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    }
    catch(err){
        console.error(err)
    }
}

export default generateAccessAndRefreshToken;