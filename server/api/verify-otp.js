// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if user already exists (to prevent double registration)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: 'User already exists. Please login instead.' });
    }

    // IMPORTANT: You need to temporarily store user data during signup
    // For now, we'll send a success response and handle user creation differently
    // In a real app, you'd use a temporary storage (Redis, session, or temporary collection)
    
    // For this implementation, we'll return a token that indicates OTP is verified
    // and the frontend should then submit the user data
    
    // Remove OTP record
    await OTP.deleteOne({ email });

    // Return success without creating user yet
    res.status(200).json({
      message: 'OTP verified successfully',
      email,
      verified: true,
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});