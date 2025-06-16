

export const otpCreationAndExpiration = async () => {
  const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
  const otpExpiresIn = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

  return { otp, otpExpiresIn };
};
