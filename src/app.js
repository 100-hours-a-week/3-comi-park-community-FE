import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT;

app.use(express.static(path.join(import.meta.dirname, 'public')));

app.get('/index', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'index', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'login', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'register', 'index.html'));
});

app.get('/write', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'write', 'index.html'));
});

app.get('/read', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'read', 'index.html'));
});

app.get('/update', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'update', 'index.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'account', 'index.html'));
});

app.get('/account-password', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'account', 'index.html'));
});

app.listen(port, () => {
    console.log(`Express runs on port ${port}`);
});
