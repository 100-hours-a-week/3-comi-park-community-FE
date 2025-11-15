import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT;

app.use(express.static(path.join(import.meta.dirname, 'public')));

app.listen(port, () => {
    console.log(`Express runs on port ${port}`);
});
