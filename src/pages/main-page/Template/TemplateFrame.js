import * as React from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import getSignInTheme from '../../../styles/theme/getSignInTheme';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/loginSlice';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    backgroundImage: 'none',
    zIndex: theme.zIndex.drawer + 1,
    flex: '0 0 auto',
}));

function TemplateFrame({ mode, children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const signInTheme = createTheme(getSignInTheme(mode));

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <ThemeProvider theme={signInTheme}>
            <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
                <StyledAppBar>
                    <Toolbar
                        variant="dense"
                        disableGutters
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            p: '8px 12px',
                        }}
                    >
                        <Button
                            variant="text"
                            size="small"
                            aria-label="Log out"
                            onClick={handleLogout}
                            startIcon={<ArrowBackRoundedIcon />}
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                        >
                            Выйти из учетной записи
                        </Button>
                        <IconButton
                            size="small"
                            aria-label="Log out"
                            onClick={handleLogout}
                            sx={{ display: { xs: 'auto', sm: 'none' } }}
                        >
                            <ArrowBackRoundedIcon />
                        </IconButton>

                    </Toolbar>
                </StyledAppBar>
                <Box sx={{ flex: '1 1', overflow: 'auto' }}>{children}</Box>
            </Box>
        </ThemeProvider>
    );
}


export default TemplateFrame;
