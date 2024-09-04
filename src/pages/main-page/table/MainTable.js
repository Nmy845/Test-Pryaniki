import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTableData, createNewRecord, updateRecord, deleteRecord } from '../../../store/slices/dataSlice';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import getSignInTheme from '../../../styles/theme/getSignInTheme';
import TemplateFrame from '../Template/TemplateFrame';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import { format } from 'date-fns';
import Typography from '@mui/material/Typography';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(2),
    gap: theme.spacing(1),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '1900px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

export default function MainTable() {
    const dispatch = useDispatch();
    const { records, status, error } = useSelector((state) => state.data);
    const [mode, setMode] = useState('dark');
    const [showCustomTheme, setShowCustomTheme] = useState(true);

    const [isAdding, setIsAdding] = useState(false);
    const [editableRecord, setEditableRecord] = useState(null);
    const [newRecord, setNewRecord] = useState({
        companySigDate: null,
        companySignatureName: '',
        documentName: '',
        documentStatus: '',
        documentType: '',
        employeeNumber: '',
        employeeSigDate: null,
        employeeSignatureName: '',
    });

    useEffect(() => {
        dispatch(fetchTableData());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRecord((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date, name) => {
        setNewRecord((prev) => ({
            ...prev,
            [name]: date,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createNewRecord(newRecord))
            .unwrap()
            .then(() => {
                setNewRecord({
                    companySigDate: null,
                    companySignatureName: '',
                    documentName: '',
                    documentStatus: '',
                    documentType: '',
                    employeeNumber: '',
                    employeeSigDate: null,
                    employeeSignatureName: '',
                });
                setIsAdding(false);
            })
            .catch((err) => console.error('Error creating record:', err));
    };

    const handleEditChange = (e, field) => {
        const { value } = e.target;
        setEditableRecord((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDateEditChange = (date, field) => {
        setEditableRecord((prev) => ({
            ...prev,
            [field]: date,
        }));
    };

    const handleSave = () => {
        if (editableRecord) {
            dispatch(updateRecord({ id: editableRecord.id, updatedRecord: editableRecord }))
                .unwrap()
                .then(() => setEditableRecord(null))
                .catch((err) => console.error('Error updating record:', err));
        }
    };

    const handleEdit = (row) => {
        setEditableRecord({ ...row });
        setIsAdding(false);
    };

    const handleCancel = () => {
        setEditableRecord(null);
        setNewRecord({
            companySigDate: null,
            companySignatureName: '',
            documentName: '',
            documentStatus: '',
            documentType: '',
            employeeNumber: '',
            employeeSigDate: null,
            employeeSignatureName: '',
        });
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteRecord(id))
            .unwrap()
            .catch((err) => console.error('Error deleting record:', err));
    };

    const handleAddNew = () => {
        setIsAdding(true);
        setEditableRecord(null);
    };

    const handleActionChange = (event, rowId) => {
        const { value } = event.target;
        if (value === 'edit') {
            const row = records.find((record) => record.id === rowId);
            handleEdit(row);
        } else if (value === 'delete') {
            handleDelete(rowId);
        }
    };

    const formatDate = (date) => {
        if (!date) return '';
        return format(new Date(date), 'dd.MM.yy HH:mm');
    };

    const defaultTheme = createTheme({ palette: { mode } });
    const SignInTheme = createTheme(getSignInTheme(mode));

    return (
        <TemplateFrame
            toggleCustomTheme={() => setShowCustomTheme((prev) => !prev)}
            showCustomTheme={showCustomTheme}
            mode={mode}
            toggleColorMode={() => {
                const newMode = mode === 'dark' ? 'light' : 'dark';
                setMode(newMode);
                localStorage.setItem('themeMode', newMode);
            }}
        >
            <ThemeProvider theme={showCustomTheme ? SignInTheme : defaultTheme}>
                <CssBaseline enableColorScheme />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={0}>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={10}>
                                <Card variant="outlined" style={{ marginTop: '20px' }}>
                                    <TableContainer component={Paper}>
                                        {status === 'loading' ? (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: '300px',
                                                }}
                                            >
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="left">Наименование компании</TableCell>
                                                        <TableCell align="center">Дата подписи компании</TableCell>
                                                        <TableCell align="center">Имя документа</TableCell>
                                                        <TableCell align="center">Статус документа</TableCell>
                                                        <TableCell align="center">Тип документа</TableCell>
                                                        <TableCell align="center">Количество работников</TableCell>
                                                        <TableCell align="center">Дата подписания работником</TableCell>
                                                        <TableCell align="center">Имя работника</TableCell>
                                                        <TableCell align="center">Действие</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {status === 'failed' && <TableRow><TableCell colSpan={9}>Error: {error}</TableCell></TableRow>}
                                                    {(!records || records.length === 0) && <TableRow><TableCell colSpan={9}>No data available</TableCell></TableRow>}
                                                    {(records || []).map((row) => (
                                                        <TableRow
                                                            key={row.id}
                                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                        >
                                                            <TableCell align="left">
                                                                {editableRecord && editableRecord.id === row.id ? (
                                                                    <TextField
                                                                        fullWidth
                                                                        value={editableRecord.companySignatureName || ''}
                                                                        onChange={(e) => handleEditChange(e, 'companySignatureName')}
                                                                    />
                                                                ) : (
                                                                    row.companySignatureName || ''
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {editableRecord && editableRecord.id === row.id ? (
                                                                    <DateTimePicker
                                                                        views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                                                                        value={editableRecord.companySigDate ? new Date(editableRecord.companySigDate) : null}
                                                                        onChange={(date) => handleDateEditChange(date, 'companySigDate')}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                    />
                                                                ) : (
                                                                    formatDate(row.companySigDate)
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {editableRecord && editableRecord.id === row.id ? (
                                                                    <TextField
                                                                        fullWidth
                                                                        value={editableRecord.documentName || ''}
                                                                        onChange={(e) => handleEditChange(e, 'documentName')}
                                                                    />
                                                                ) : (
                                                                    row.documentName || ''
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {editableRecord && editableRecord.id === row.id ? (
                                                                    <TextField
                                                                        fullWidth
                                                                        value={editableRecord.documentStatus || ''}
                                                                        onChange={(e) => handleEditChange(e, 'documentStatus')}
                                                                    />
                                                                ) : (
                                                                    row.documentStatus || ''
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {editableRecord && editableRecord.id === row.id ? (
                                                                    <TextField
                                                                        fullWidth
                                                                        value={editableRecord.documentType || ''}
                                                                        onChange={(e) => handleEditChange(e, 'documentType')}
                                                                    />
                                                                ) : (
                                                                    row.documentType || ''
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {editableRecord && editableRecord.id === row.id ? (
                                                                    <TextField
                                                                        fullWidth
                                                                        value={editableRecord.employeeNumber || ''}
                                                                        onChange={(e) => handleEditChange(e, 'employeeNumber')}
                                                                    />
                                                                ) : (
                                                                    row.employeeNumber || ''
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {editableRecord && editableRecord.id === row.id ? (
                                                                    <DateTimePicker
                                                                        views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                                                                        value={editableRecord.employeeSigDate ? new Date(editableRecord.employeeSigDate) : null}
                                                                        onChange={(date) => handleDateEditChange(date, 'employeeSigDate')}
                                                                        renderInput={(params) => <TextField {...params} />}
                                                                    />
                                                                ) : (
                                                                    formatDate(row.employeeSigDate)
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {editableRecord && editableRecord.id === row.id ? (
                                                                    <TextField
                                                                        fullWidth
                                                                        value={editableRecord.employeeSignatureName || ''}
                                                                        onChange={(e) => handleEditChange(e, 'employeeSignatureName')}
                                                                    />
                                                                ) : (
                                                                    row.employeeSignatureName || ''
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {editableRecord && editableRecord.id === row.id ? (
                                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                                        <Button
                                                                            onClick={handleSave}
                                                                            variant="contained"
                                                                            color="primary"
                                                                            size="small"
                                                                        >
                                                                            Сохранить
                                                                        </Button>
                                                                        <Button
                                                                            onClick={handleCancel}
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            size="small"
                                                                        >
                                                                            Отменить
                                                                        </Button>
                                                                    </Box>
                                                                ) : (
                                                                    <FormControl fullWidth>
                                                                        <InputLabel id={`action-select-${row.id}`}></InputLabel>
                                                                        <Select
                                                                            labelId={`action-select-${row.id}`}
                                                                            value="none"
                                                                            onChange={(e) => handleActionChange(e, row.id)}
                                                                        >
                                                                            <MenuItem value="none" disabled>Выберите действие</MenuItem>
                                                                            <MenuItem value="edit">Редактировать</MenuItem>
                                                                            <MenuItem value="delete">Удалить</MenuItem>
                                                                        </Select>
                                                                    </FormControl>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </TableContainer>
                                    <Box sx={{ marginTop: 2 }}>
                                        {!isAdding && editableRecord === null && (
                                            <Button
                                                startIcon={<AddIcon />}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddNew}
                                            >
                                                Добавить новую запись
                                            </Button>
                                        )}
                                        {isAdding && (
                                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="subtitle1" gutterBottom>Наименование организации</Typography>
                                                        <TextField
                                                            fullWidth
                                                            name="companySignatureName"
                                                            value={newRecord.companySignatureName || ''}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="subtitle1" gutterBottom>Наименование документа</Typography>
                                                        <TextField
                                                            fullWidth
                                                            name="documentName"
                                                            value={newRecord.documentName || ''}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="subtitle1" gutterBottom>Дата подписи компании</Typography>
                                                        <DateTimePicker
                                                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                                                            name="companySigDate"
                                                            value={newRecord.companySigDate ? new Date(newRecord.companySigDate) : null}
                                                            onChange={(date) => handleDateChange(date, 'companySigDate')}
                                                            renderInput={(params) => <TextField {...params} />}
                                                            required
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="subtitle1" gutterBottom>Статус документа</Typography>
                                                        <TextField
                                                            fullWidth
                                                            name="documentStatus"
                                                            value={newRecord.documentStatus || ''}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="subtitle1" gutterBottom>Имя работника</Typography>
                                                        <TextField
                                                            fullWidth
                                                            name="employeeSignatureName"
                                                            value={newRecord.employeeSignatureName || ''}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="subtitle1" gutterBottom>Дата подписания работником</Typography>
                                                        <DateTimePicker
                                                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                                                            name="employeeSigDate"
                                                            value={newRecord.employeeSigDate ? new Date(newRecord.employeeSigDate) : null}
                                                            onChange={(date) => handleDateChange(date, 'employeeSigDate')}
                                                            renderInput={(params) => <TextField {...params} />}
                                                            required
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="subtitle1" gutterBottom>Число работников</Typography>
                                                        <TextField
                                                            fullWidth
                                                            name="employeeNumber"
                                                            value={newRecord.employeeNumber || ''}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12} md={4}>
                                                        <Typography variant="subtitle1" gutterBottom>Тип документа</Typography>
                                                        <TextField
                                                            fullWidth
                                                            name="documentType"
                                                            value={newRecord.documentType || ''}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
                                                    <Button type="submit" variant="contained" color="primary" size="small">
                                                        Добавить
                                                    </Button>
                                                    <Button type="button" variant="outlined" color="secondary" size="small" onClick={handleCancel}>
                                                        Отменить
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                </Card>
                            </Grid>
                            <Grid item xs={1}></Grid>
                        </Grid>
                    </Box>
                </LocalizationProvider>
            </ThemeProvider>
        </TemplateFrame>
    );
}
