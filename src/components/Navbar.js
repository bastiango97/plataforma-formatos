import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('https://camunda-task-completion.onrender.com/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                navigate('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            handleMenuClose();
        }
    };

    return (
        <AppBar position="static" style={{ backgroundColor: '#f8f9fa', color: '#333' }}>
            <Toolbar>
                {/* Align links to the left */}
                <Box sx={{ display: 'flex', flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        style={{ textDecoration: 'none', color: '#333', marginRight: '20px' }}
                    >
                        Formatos
                    </Typography>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/consultas"
                        style={{ textDecoration: 'none', color: '#333', marginRight: '20px' }}
                    >
                        Consultas
                    </Typography>
                </Box>

                {/* Account icon stays on the right */}
                <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="profile-menu"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    color="inherit"
                >
                    <AccountCircle sx={{ fontSize: 50 }} />
                </IconButton>
                <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem>Configuración y privacidad</MenuItem>
                    <MenuItem>Pantalla y accesibilidad</MenuItem>
                    <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
