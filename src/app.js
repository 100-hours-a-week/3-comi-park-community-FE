import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

import { authGuard } from './middlewares/auth-guard.js';

const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(authGuard);
app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use('/write', express.static(path.join(import.meta.dirname, 'public', 'post-write')));
app.use('/read', express.static(path.join(import.meta.dirname, 'public', 'post-read')));
app.use('/update', express.static(path.join(import.meta.dirname, 'public', 'post-update')));

app.get('/index', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'index', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'login', 'login.html'));
});

app.get('/write', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'post-write', 'post-write.html'));
});

app.get('/read/:postId', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'post-read', 'post-read.html'));
});

app.get('/update/:postId', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'post-update', 'post-update.html'));
});

app.listen(port, () => {
    console.log(`Express runs on port ${port}`);
});
