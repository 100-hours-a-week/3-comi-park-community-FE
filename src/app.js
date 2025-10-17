import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public')));

app.get('/index', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'index', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'public', 'login', 'login.html'));
});

app.listen(port, () => {
    console.log(`Express runs on port ${port}`);
});
