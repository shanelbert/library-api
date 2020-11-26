const express = require('express')
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false }
});

express()
	.use(bodyParser.json())
	.get('/collection/loc', async (req, res) => {		
		try {
			if (req.query.id === undefined || req.query.id === "") {
				res.status(400).send("Parameter id tidak lengkap");
			} else { 
				const client = await pool.connect();
				client.query(`SELECT judul, no_lorong, no_rak FROM collection WHERE id=${req.query.id};`, (err, queryresult) => {
					if (err) {
						client.release();
						res.status(500).send("Operasi gagal");
					} else {
						client.release();
						res.json(queryresult.rows[0]);
					}
				});
			}
		} catch (err) {
			res.status(500).send("Operasi gagal");
		}		
	})
	.post('/collection', async (req, res) => {
		try {
			
			let requiredAttribute = ["judul", "tipe", "no_lorong", "no_rak"];
			let valid;
			requiredAttribute.every((val) => {
				valid = ((req.body[val] !== undefined) && (req.body[val] !== ""));
				return valid;
			});
			
			if (!valid) {
				res.status(400).send("Request body tidak lengkap");
			} else {
				const { judul, tipe, no_lorong, no_rak } = req.body;
				const client = await pool.connect();
				client.query(`INSERT INTO collection(judul, tipe, no_lorong, no_rak) VALUES ('${judul}', '${tipe}', '${no_lorong}', '${no_rak}');`, (err) => {
					if (err) {
						client.release();
						res.status(500).send("Operasi gagal");
					} else {
						client.query(`SELECT id, judul, no_lorong, no_rak FROM collection WHERE id = (SELECT MAX(id) FROM collection)`, (err, queryresult) => {
							if (err) {
								client.release();
								res.status(500).send("Operasi berhasil tapi data koleksi gagal diperoleh");
							} else {
								client.release();
								res.json(queryresult.rows[0]);
							}
						});
					}
					
				});
			}
		} catch (err) {
			res.status(500).send(err);
		}
	})
	.listen(PORT, () => console.log(`Listening on ${PORT}`));
