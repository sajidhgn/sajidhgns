'use client';

import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, IconButton, InputAdornment, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { locale, token } = useParams();

    const handleReset = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Password reset successfully. Redirecting to login...');
                setTimeout(() => {
                    router.push(`/${locale}/login`);
                }, 3000);
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e1e2f 0%, #121212 100%)',
                p: 2
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card sx={{ maxWidth: 450, width: '100%', borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'white' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>New Password</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Enter your new secure password</Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}

                        <form onSubmit={handleReset}>
                            <TextField
                                fullWidth
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' } }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                                <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={{ mb: 4, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' } }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' } }}
                                required
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    bgcolor: '#0070f3',
                                    '&:hover': { bgcolor: '#005bb5' },
                                    fontWeight: 600
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
};

export default ResetPasswordPage;
