import { Button, Stack, TextField, Typography, colors, Select, MenuItem, FormControl, Alert } from '@mui/material'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useState } from 'react'
import { ScreenMode } from '../../Pages/SigninPage'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

let API_URL = 'https://backend.srv533347.hstgr.cloud/';

const SignupForm = ({ onSwitchMode }) => {

    const [accountName, setAccountName] = useState('')
    const [accountEmail, setAccountEmail] = useState('')
    const [accountPassword, setAccountPassword] = useState('')
    const [accountType, setAccountType] = useState('')
    const [alertMessage, setAlertMessage] = useState(null)
    const [alertType, setAlertType] = useState('error')
    const [open, setOpen] = useState(false);

    const handleAccountTypeChange = (event) => {
        setAccountType(event.target.value)
    }

    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    const validateForm = () => {

        if (!accountName || !accountEmail || !accountPassword || !accountType) {
            setAlertMessage("All fields are required");
            return false;
        }

        if (!emailRegex.test(accountEmail)) {
            setAlertMessage("Invalid email address");
            return false;
        }

        if (!passwordRegex.test(accountPassword)) {
            setAlertMessage("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and be at least 8 characters long");
            return false;
        }

        return true;
    };

    const signUpHandle = async () => {

        if (!validateForm()) {
            setTimeout(() => {
                setAlertMessage(null);
            }, 2000);
            return;
        }

        setOpen(true);
        axios.post(API_URL + 'signup_account', {
            name: accountName,
            email: accountEmail,
            password: accountPassword,
            account_type: accountType
        }).then((response) => {
            if (response.status === 200) {
                setAlertType('success');
                setAlertMessage('Account has been created successfully! Kindly wait, let the admin accept your account.');
                setOpen(false);
                setTimeout(() => {
                    setAlertMessage(null);
                    setAlertType('error');
                    window.location.reload();
                }, 2500);
            }
        }).catch((error) => {
            console.log("Error", error);
            setAlertMessage(error.response.data);
            setOpen(false);
            setTimeout(() => {
                setAlertMessage(null);
            }, 2000);
        })
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            signUpHandle();
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
                        Create an account
                    </Typography>

                    <Typography color={colors.grey[600]}>
                        necessitatibus assumenda repellat perferendis est reprehenderit maiores?
                    </Typography>
                </Stack>

                <Stack spacing={4}>
                    <Stack spacing={2}>
                        <Stack spacing={1}>
                            <Typography color={colors.grey[800]}>
                                Name
                            </Typography>
                            <TextField onChange={(e) => setAccountName(e.target.value)} onKeyPress={handleKeyPress} />
                        </Stack>

                        <Stack spacing={1}>
                            <Typography color={colors.grey[800]}>
                                Email
                            </Typography>
                            <TextField onChange={(e) => setAccountEmail(e.target.value)} onKeyPress={handleKeyPress} />
                        </Stack>

                        <Stack spacing={1}>
                            <Typography color={colors.grey[800]}>
                                Password
                            </Typography>
                            <TextField type='password' onChange={(e) => setAccountPassword(e.target.value)} onKeyPress={handleKeyPress} />
                        </Stack>

                        <Stack spacing={1}>
                            <Typography color={colors.grey[800]}>
                                Account Type
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    labelId="account-type-label"
                                    id="account-type"
                                    value={accountType}
                                    onChange={handleAccountTypeChange}
                                    onKeyPress={handleKeyPress}
                                >
                                    <MenuItem value="admin">Admin Account</MenuItem>
                                    <MenuItem value="volunteer">Volunteer Account</MenuItem>
                                </Select>
                            </FormControl>
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
                        onClick={signUpHandle}
                    >
                        SignUp
                    </Button>
                </Stack>

                <Stack direction="row" spacing={2}>
                    <Typography>
                        Already have an account?
                    </Typography>
                    <Typography
                        onClick={() => onSwitchMode(ScreenMode.SIGN_IN)}
                        fontWeight={600}
                        sx={{
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        Sign in
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default SignupForm
