import express from 'express';
import cors from 'cors';
import config from './config.js';
import { Resend } from 'resend';

const APIKEY = config.APIKEY;

const resend = new Resend(APIKEY);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/', async (req, res) => {
	const { name, email, message } = req.body;

	const { data, error } = await resend.emails.send({
		from: 'Portfolio <onboarding@resend.dev>',
		to: ['bracoagustin@gmail.com'],
		subject: 'Contacto web',
		html: `
      <p>${name}</p>
      <p>${email}</p>
      <p>${message}</p>
    `,
	});

	if (error) return res.status(400).json({ status: 'Error', message: 'The email was not sent', error });

	return res.status(200).json({ status: 'Success', message: 'Email sent', data });
});

app.listen(3000);
