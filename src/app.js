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

app.get('/index', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'index', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'login', 'login.html'));
});

app.get('/write', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'post-write', 'post-write.html'));
});

app.listen(port, () => {
    console.log(`Express runs on port ${port}`);
});
