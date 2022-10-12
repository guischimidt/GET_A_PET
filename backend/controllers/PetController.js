const Pet = require('../models/Pet');

//helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class PetController {
    //create a Pet
    static async create(req, res) {

        const { name, age, weight, color } = req.body;
        const available = true;
        const images = req.files;

        //images upload

        //validation
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        }
        if (!age) {
            res.status(422).json({ message: "A idade é obrigatória!" });
            return;
        }
        if (!weight) {
            res.status(422).json({ message: "O peso é obrigatório!" });
            return;
        }
        if (!color) {
            res.status(422).json({ message: "A cor é obrigatória!" });
            return;
        }
        if (!images) {
            res.status(422).json({ message: "A imagem é obrigatória!" });
            return;
        }

        //get pet owner
        const token = getToken(req);
        const user = await getUserByToken(token);

        //create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,
            },
        })

        images.map((image) => {
            pet.images.push(image.filename);
        });

        try {
            const newPet = await pet.save();
            res.status(201).json({ message: 'Pet cadastrado com sucesso', newPet, });

        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt');

        res.status(200).json({ pets: pets, });
    }

    static async getPetById(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'A id não é válida' });
            return;
        }

        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' });
            return;
        }

        res.status(200).json({ pet });
    }

    static async getAllUserPets(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt');
        res.status(200).json({ pets, });
    }

    static async getAllUserAdoptions(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt');
        res.status(200).json({ pets });
    }

    static async remove(req, res) {

        const id = req.params.id;
        console.log(id);

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        // check if pet exists
        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        // check if user registered this pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() != user._id.toString()) {
            res.status(404).json({
                message:
                    'Houve um problema em processar sua solicitação, tente novamente mais tarde!',
            });
            return;
        }

        await Pet.findByIdAndRemove(id);

        res.status(200).json({ message: 'Pet removido com sucesso!' });
    }

    static async update(req, res) {

        const id = req.params.id;
        const { name, age, weight, color, available } = req.body;
        const images = req.files;

        const updatedData = {};

        // check if id is valid
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        // check if pet exists
        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        // check if user registered this pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() != user._id.toString()) {
            res.status(404).json({
                message:
                    'Houve um problema em processar sua solicitação, tente novamente mais tarde!',
            });
            return;
        }

        //validation
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
            return;
        } else {
            updatedData.name = name;
        }
        if (!age) {
            res.status(422).json({ message: "A idade é obrigatória!" });
            return;
        } else {
            updatedData.age = age;
        }
        if (!weight) {
            res.status(422).json({ message: "O peso é obrigatório!" });
            return;
        } else {
            updatedData.weight = weight;
        }
        if (!color) {
            res.status(422).json({ message: "A cor é obrigatória!" });
            return;
        } else {
            updatedData.color = color;
        }
        if (images.length > 0) {
            updatedData.images = [];
            images.map((image) => {
                updatedData.images.push(image.filename);
            });
        }

        if (!available) {
            res.status(422).json({ message: 'O status é obrigatório!' });
            return;
        } else {
            updatedData.available = available;
        }

        //updatedData.description = description

        await Pet.findByIdAndUpdate(id, updatedData);

        res.status(200).json({ pet: pet, message: 'Pet atualizado com sucesso!' })


    }

    static async schedule(req, res) {
        const id = req.params.id;

        //check if pet exists
        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' });
            return;
        }

        //check if user registered pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.equals(user._id)) {
            res.status(422).json({ message: 'Você não pode agendar visita para o seu próprio pet.' });
            return;
        }

        //check if user already schedule a visit
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                res.status(422).json({ message: 'Você já agendou uma visita para este Pet' });
                return;
            }
        }

        //add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        };

        await Pet.findByIdAndUpdate(id, pet);

        res.status(200).json({
            message:
                `Interesse registrado, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`
        });
        return;

    }

    static async concludeAdoption(req, res) {
        const id = req.params.id;

        //check if pet exists
        const pet = await Pet.findOne({ _id: id });

        if (!pet) {
            res.status(404).json({ message: 'Pet não encontrado' });
            return;
        }

        // check if user registered this pet
        const token = getToken(req);
        const user = await getUserByToken(token);

        if (pet.user._id.toString() != user._id.toString()) {
            res.status(404).json({
                message:
                    'Houve um problema em processar sua solicitação, tente novamente mais tarde!',
            });
            return;
        }

        pet.available = false;

        await Pet.findByIdAndUpdate(id, pet);

        res.status(200).json({ message: 'Pet adotado com sucesso' });
    }
}