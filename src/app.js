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

app.get('/', (req, res) => {
	return res.status(200).json({ status: 'Success', message: 'Server running' });
});

app.post('/', async (req, res) => {
	const { api_key } = req.headers;
	if (!api_key | (api_key !== APIKEY))
		return res.status(403).json({ status: 'Error', message: 'No estás autorizado.' });

	const { name, email, message } = req.body;
	if (!name | !email | !message)
		return res.status(400).json({ status: 'Error', message: 'Faltan datos para enviar el mail.' });

	const { data, error } = await resend.emails.send({
		from: 'Portfolio <onboarding@resend.dev>',
		to: ['bracoagustin@gmail.com'],
		subject: 'Contacto web',
		html: `
			<html lang="es">
				<body style="background-color: #F5F5F4;">
					<table width="100%" cellspacing="0" cellpadding="0">
						<tr>
							<td align="center">
								<table width="600" cellspacing="0" cellpadding="0">
									<tr>
										<td align="center" style="padding: 20px 0;">
											<h1 style="color: #333;">Contacto web</h1>
										</td>
									</tr>
									<tr>
										<td align="center" style="padding: 0 20px;">
											<p style="color: #666;">Nombre: ${name}</p>
											<p style="color: #666;">Correo: ${email}</p>
											<p style="color: #666;">Mensaje: ${message}</p>
										</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</body>
			</html>
    `,
	});

	if (error)
		return res.status(400).json({ status: 'Error', message: 'El mensaje no pudo ser enviado' });

	return res.status(200).json({ status: 'Enviado', message: 'Gracias por tu mensaje' });
});

app.listen(3000);
