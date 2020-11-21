const express = require('express')
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL || "postgres://hlufkqnkonmtjn:0c22bc61c87916686b52a97d8549ca243258234bd4b0d8922ddffbd1beb79152@ec2-54-75-150-32.eu-west-1.compute.amazonaws.com:5432/d61cup49q5ghaj",
	ssl: { rejectUnauthorized: false }
});

express()
	.use(bodyParser.json())
	.get('/collection/loc', async (req, res) => {
		try {
			const client = await pool.connect();
			client.query(`SELECT judul, no_lorong, no_rak FROM collection WHERE id=${req.query.id};`, (err, queryresult) => {
				if (err) {
					throw err;
				} else {
					client.release();
					res.json(queryresult.rows[0]);
				}
			});
		} catch (err) {
			res.status(500).send('Error ' + err);
		}
	})
	.post('/collection', async (req, res) => {
		try {
			const client = await pool.connect();
			const { judul, tipe, no_lorong, no_rak } = req.body; 
			client.query(`INSERT INTO collection(judul, tipe, no_lorong, no_rak) VALUES ('${judul}', '${tipe}', '${no_lorong}', '${no_rak}');`, (err) => {
				if (err) {
					throw err;
				}
			});
			client.release();
			res.json(req.body);
		} catch (err) {
			res.status(500).send('Error ' + err);
		}
	})
	.listen(PORT, () => console.log(`Listening on ${PORT}`));
