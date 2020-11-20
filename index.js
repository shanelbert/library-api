const express = require('express')
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000


express()
	.use(bodyParser.json())
	.get('/collection/location', (req, res) => {
		// try {
			res.json({lorong: '1', rak: '2'});
		// } catch (err) {
		// 	console.error(err);
		// 	res.status(500).send('Error ' + err);
		// }
	})
	.post('/collection', (req, res) => {
		// try {
			res.json(req.body);
		// } catch (err) {
		// 	console.error(err);
		// 	res.status(500).send('Error ' + err);
		// }
	})
	.listen(PORT, () => console.log(`Listening on ${PORT}`));
