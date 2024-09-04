const BASE_URL = 'https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs';

const formatDateISO8601 = (date) => {
    if (!(date instanceof Date)) {
        throw new Error('Invalid Date object');
    }
    return date.toISOString();
};

export const login = async (credentials) => {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }
    return data;
};

export const fetchData = async (token) => {
    const response = await fetch(`${BASE_URL}/userdocs/get`, {
        method: 'GET',
        headers: {
            'x-auth': token,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
    }
    return data;
};

export const createData = async (token, newData) => {
    const formattedData = {
        ...newData,
        companySigDate: formatDateISO8601(new Date(newData.companySigDate)),
        employeeSigDate: formatDateISO8601(new Date(newData.employeeSigDate))
    };

    const response = await fetch(`${BASE_URL}/userdocs/create`, {
        method: 'POST',
        headers: {
            'x-auth': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to create data');
    }
    return data;
};

export const updateData = async (token, id, updatedData) => {
    const formattedData = {
        ...updatedData,
        companySigDate: formatDateISO8601(new Date(updatedData.companySigDate)),
        employeeSigDate: formatDateISO8601(new Date(updatedData.employeeSigDate))
    };

    const response = await fetch(`${BASE_URL}/userdocs/set/${id}`, {
        method: 'POST',
        headers: {
            'x-auth': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update data');
    }

    const data = await response.json();
    return data;
};

export const deleteData = async (token, id) => {
    const response = await fetch(`${BASE_URL}/userdocs/delete/${id}`, {
        method: 'POST',
        headers: {
            'x-auth': token,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to delete data');
    }
    return id;
};
