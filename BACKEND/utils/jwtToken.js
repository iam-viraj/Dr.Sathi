export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
    
    // Ensure the environment variable for cookie expiry is correctly read and used
    const cookieExpireDays = process.env.COOKIE_EXPIRE ? parseInt(process.env.COOKIE_EXPIRE) : 7;  // Default to 7 days if undefined
  
    // Determine the cookie name based on the user's role
    let cookieName;
    if (user.role === 'Admin') {
        cookieName = 'adminToken';
    } else if (user.role === 'Patient') {
        cookieName = 'patientToken';
    } else if (user.role === 'Doctor') {
        cookieName = 'doctorToken';  // Set the cookie name for doctors
    }

    res
      .status(statusCode)
      .cookie(cookieName, token, {
        expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),  // Cookie expiration time in milliseconds
        httpOnly: true,  // Secure flag if necessary
      })
      .json({
        success: true,
        message,
        user,
        token,
      });
};
