import { Button, Stack, TextField, Typography, colors, Alert } from '@mui/material'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react'
import { ScreenMode } from '../../Pages/SigninPage'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

let API_URL = 'https://backend.srv533347.hstgr.cloud/';

const SigninForm = ({ onSwitchMode, set_token }) => {
    const [accountEmail, setAccountEmail] = useState('')
    const [accountPassword, setAccountPassword] = useState('')
    const [open, setOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState('error')

    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    const validateForm = () => {
        if (!accountEmail || !accountPassword) {
            setAlertMessage("All fields are required");
            return false;
        }

        if (!emailRegex.test(accountEmail)) {
            setAlertMessage("Invalid email address");
            return false;
        }

        if (!passwordRegex.test(accountPassword)) {
            setAlertMessage("Invalid password");
            return false;
        }

        return true;
    };

    const signInHandle = async () => {
        if (!validateForm()) {
            setTimeout(() => {
                setAlertMessage(null);
            }, 2000);
            return;
        }

        setOpen(true);
        axios.post(API_URL + 'account_signin', {
            email: accountEmail,
            password: accountPassword
        }).then((response) => {
            if (response.status === 200) {
                setAlertType('success');
                setAlertMessage('Successful Login');
                setOpen(false);
                setTimeout(() => {
                    setAlertMessage(null);
                    setAlertType('error');
                    navigate('/dashboard');
                }, 1500);
                let data = Object.fromEntries(Object.entries(response.data).filter(([_, v]) => v != null));
                localStorage.setItem('token', JSON.stringify(data));
                set_token(data);
            }
        }).catch((error) => {
            console.log("Error", error);
            setAlertMessage(error.response.data);
            setOpen(false);
            setTimeout(() => {
                setAlertMessage(null);
            }, 2200);
        })
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            signInHandle();
        }
    }

    return (
        <Stack
            justifyContent='center'
            alignItems='center'
            sx={{
                height: '100%',
                color: colors.grey[800]
            }}
        >
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {alertMessage && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: '999',
                    width: '90%',
                    maxWidth: '500px',
                    padding: '0 16px',
                    boxSizing: 'border-box'
                }}>
                    <Alert severity={alertType}>{alertMessage}</Alert>
                </div>
            )}
            <Stack
                spacing={5}
                sx={{
                    width: '100%',
                    maxWidth: '500px',
                    px: { xs: 2, sm: 0 }
                }}
            >
                <Stack>
                    <Typography variant='h4' fontWeight={600} color={colors.grey[800]}>
                        Welcome back
                    </Typography>

                    <Typography color={colors.grey[600]}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </Typography>
                </Stack>

                <Stack spacing={4}>
                    <Stack spacing={2}>
                        <Stack spacing={1}>
                            <Typography color={colors.grey[800]}>
                                Email
                            </Typography>
                            <TextField 
                                onChange={(e) => setAccountEmail(e.target.value)} 
                                onKeyPress={handleKeyPress} 
                            />
                        </Stack>

                        <Stack spacing={1}>
                            <Typography color={colors.grey[800]}>
                                Password
                            </Typography>
                            <TextField 
                                type='password' 
                                onChange={(e) => setAccountPassword(e.target.value)} 
                                onKeyPress={handleKeyPress} 
                            />
                        </Stack>
                    </Stack>

                    <Button
                        variant='contained'
                        size='large'
                        sx={{
                            backgroundColor: colors.grey[800],
                            "&:hover": {
                                backgroundColor: colors.grey[600]
                            }
                        }}
                        onClick={signInHandle}
                    >
                        Sign In
                    </Button>
                </Stack>

                <Stack direction="row" spacing={2}>
                    <Typography>
                        Don't have an account?
                    </Typography>
                    <Typography
                        onClick={() => onSwitchMode(ScreenMode.SIGN_UP)}
                        fontWeight={600}
                        sx={{
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        Sign up now
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default SigninForm
