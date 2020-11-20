const express = require('express')
const bodyParser = require('body-parser');
// const axios = require('axios');

const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false }
});

// function handleSubmit() {
// 	let judul = document.getElementById("inputJudul");
// 	let tipe = document.getElementById("inputTipe");
// 	let lorong = document.getElementById("inputLorong");
// 	let rak = document.getElementById("inputRak");


// 	axios.get('/collection/location').then((res) => {
// 		alert(res);
// 	});
// }


express()
	.use(bodyParser.json())
	// .get('/', async (req, res) => {
		// let htmlForm = `
		// 	<!DOCTYPE html>
		// 	<html>
		// 		<head>
		// 			<title>Input Form</title>
		// 		</head>
		// 		<body>
		// 			<h2>Input Data Koleksi</h2>

					
		// 				<label for="inputJudul">Judul:</label><br>
		// 				<input type="text" id="inputJudul" name="koleksi"><br>

		// 				<label for="inputTipe">Tipe:</label><br>
		// 				<input type="text" id="inputTipe" name="koleksi"><br><br>

		// 				<label for="inputLorong">Nomor Lorong:</label><br>
		// 				<input type="text" id="inputLorong" name="koleksi"><br>

		// 				<label for="inputRak">Nomor Rak:</label><br>
		// 				<input type="text" id="inputRak" name="koleksi"><br>

		// 				<button onclick="handleSubmit()">
					
		// 		</body>
		// 	</html>`
	// })
	.get('/collection/location', async (req, res) => {
		try {
			const client = await pool.connect();
			let result;
			client.query(`SELECT no_lorong, no_rak FROM collection WHERE id=${req.query.id};`, (err, res) => {
				if (err) {
					throw err;
				} else {
					result = res.rows;
				}
			});
			res.json(result);
			client.release();
			// res.json({lorong: '1', rak: '2'});
		} catch (err) {
			// console.error(err);
			res.status(500).send('Error ' + err);
		}
	})
	.post('/collection/new', async (req, res) => {
		try {
			const client = await pool.connect();
			const { judul, tipe, no_lorong, no_rak } = req.body; 
			client.query(`INSERT INTO collection(judul, tipe, no_lorong, no_rak) VALUES (${judul}, ${tipe}, ${no_lorong}, ${no_rak});`, (err) => {
				if (err) {
					throw err;
				}
			});

			res.json(body.res);
			client.release();
		} catch (err) {
			// console.error(err);
			res.status(500).send('Error ' + err);
		}
	})
	.listen(PORT, () => console.log(`Listening on ${PORT}`));
