const ecpress = require('express');
const router = ecpress.Router();
const shlokController = require('../controllers/shlokController');

router.get('/random',shlokController.getRandomShlok);
module.exports = router;