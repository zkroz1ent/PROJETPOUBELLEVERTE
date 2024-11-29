const express = require('express');
const arretController = require('./ArretController');
const router = express.Router();

router.get('/', arretController.getAllArrets);
router.post('/', arretController.createArret);
router.get('/:id', arretController.getArretById);
router.put('/:id', arretController.updateArret);
router.post('/dechetupdate', arretController.updateArretquantitedechet);

router.delete('/:id', arretController.deleteArret);
// router.put('/:arretId/desservable', updateArretStatus);
router.put('/:arretId/desservable/desservable', arretController.updateArretStatus);
router.get('/non-desservis/non-desservis/', arretController.getNonDesservisArrets);
router.get('/ruesetarrets/ruesetarrets', arretController.getAllRuesEtArrets);
router.put('/:arretId/quantite_dechets', arretController.updateArretQuantiteDechets);
router.get('/arrets/non-attribues', arretController.getUnassignedArrets);
module.exports = router;