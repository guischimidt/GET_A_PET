const router = require('express').Router();

const PetController = require('../controllers/PetController');

//middlewares
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/upload-image');

router.post('/create', verifyToken, imageUpload.array('images'), PetController.create);
router.get('/mypets', verifyToken, PetController.getAllUserPets);
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions);
router.patch('/schedule/:id', verifyToken, PetController.schedule);
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption);
router.get('/:id', PetController.getPetById);
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.update);
router.delete('/:id', verifyToken, PetController.remove);
router.get('/', PetController.getAll);

module.exports = router;