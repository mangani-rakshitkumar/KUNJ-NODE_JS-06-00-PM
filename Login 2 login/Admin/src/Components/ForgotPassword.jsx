import { useState } from 'react'
import './ForgotPassword.css'

const ForgotPassword = ({ onBack }) => {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSendOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const response = await fetch('http://localhost:8080/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await response.json()
            
            setMessage(data.message)
            if (data.message === "OTP sent to your email!") {
                setStep(2)
            }
        } catch (error) {
            setMessage('Network error!')
        }
        setLoading(false)
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            const response = await fetch('http://localhost:8080/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            })
            const data = await response.json()
            
            setMessage(data.message)
            if (data.verified) {
                setStep(3)
            }
        } catch (error) {
            setMessage('Network error!')
        }
        setLoading(false)
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match!')
            return
        }
        
        setLoading(true)
        
        try {
            const response = await fetch('http://localhost:8080/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            })
            const data = await response.json()
            
            setMessage(data.message)
            if (data.message === "Password reset successfully!") {
                // Show success message for 3 seconds then redirect
                setTimeout(() => {
                    alert('✅ Password Reset Successful!\n\nYou can now login with your new password.')
                    onBack()
                }, 1500)
            }
        } catch (error) {
            setMessage('Network error!')
        }
        setLoading(false)
    }

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="card-header">
                    <h2>Reset Password</h2>
                    <div className="step-indicator">
                        <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                        <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
                    </div>
                </div>

                {step === 1 && (
                    <form onSubmit={handleSendOTP} className="form">
                        <h3>Enter your email address</h3>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="form">
                        <h3>Enter OTP</h3>
                        <p>We've sent a 6-digit code to {email}</p>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                            Change Email
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="form">
                        <h3>Create New Password</h3>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary">
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {message && (
                    <div className={`message ${message.includes('successfully') || message.includes('sent') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <button onClick={onBack} className="back-btn">
                    ← Back to Login
                </button>
            </div>
        </div>
    )
}

export default ForgotPassword