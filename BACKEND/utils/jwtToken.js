export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  
  // Ensure JWT_EXPRIES is used for cookie expiration
  const jwtExpiresInSeconds = parseInt(process.env.JWT_EXPRIES, 10) || 1296000; // Default to 15 days if undefined

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
      expires: new Date(Date.now() + jwtExpiresInSeconds * 1000),  // Align with token expiry
      httpOnly: true,  // Secure flag if necessary
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
