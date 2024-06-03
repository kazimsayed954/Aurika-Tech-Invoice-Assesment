import express from 'express';
import cors from 'cors';
import path from 'path';
import invoiceRoute from './routes/invoice.route';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, '../public'))); 
app.use(cors());


app.use('/invoice',invoiceRoute)
app.get('/', (req, res) => {
    res.json({
        data:"hello"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

