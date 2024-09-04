
export const saveToken = (token) => {
    try {
        localStorage.setItem('token', token);
    } catch (error) {
        console.error('Error saving auth token to localStorage:', error);
    }
};

export const getToken = () => {
    try {
        return localStorage.getItem('token');
    } catch (error) {
        console.error('Error retrieving auth token from localStorage:', error);
        return null;
    }
};

export const removeToken = () => {
    try {
        localStorage.removeItem('token');
    } catch (error) {
        console.error('Error removing auth token from localStorage:', error);
    }
};

export const saveTheme = (theme) => {
    try {
        localStorage.setItem('themeMode', theme);
    } catch (error) {
        console.error('Error saving theme mode to localStorage:', error);
    }
};

export const getTheme = () => {
    try {
        return localStorage.getItem('themeMode') || 'light';
    } catch (error) {
        console.error('Error retrieving theme mode from localStorage:', error);
        return 'light';
    }
};
export const removeTheme = () => {
    try {
        localStorage.removeItem('themeMode');
    } catch (error) {
        console.error('Error removing theme mode from localStorage:', error);
    }
};
