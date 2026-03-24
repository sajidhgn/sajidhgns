'use client';

import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Card, CardContent, IconButton, InputAdornment, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { locale } = useParams();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push(`/${locale}/admin`);
            } else {
                setError(data.error || 'Login failed');
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
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Welcome Back</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>Login to manage your portfolio</Typography>
                        </Box>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Username"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ mb: 3, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' } }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' } }}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ mb: 1, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' }, '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' } }, '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' } }}
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

                            <Box sx={{ textAlign: 'right', mb: 3 }}>
                                <Button
                                    sx={{ color: '#0070f3', textTransform: 'none', p: 0 }}
                                    onClick={() => router.push(`/${locale}/forgot-password`)}
                                >
                                    Forgot Password?
                                </Button>
                            </Box>

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
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
};

export default LoginPage;
