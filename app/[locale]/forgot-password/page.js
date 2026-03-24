'use client';

import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { locale } = useParams();

    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.error || 'Failed to process request');
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
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Reset Password</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Enter your email to receive a reset link</Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}

                        <form onSubmit={handleRequest}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' } }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' } }}
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
                                    fontWeight: 600,
                                    mb: 2
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                            </Button>

                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => router.push(`/${locale}/login`)}
                                sx={{ color: 'rgba(255, 255, 255, 0.6)', textTransform: 'none' }}
                            >
                                Back to Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
};

export default ForgotPasswordPage;
