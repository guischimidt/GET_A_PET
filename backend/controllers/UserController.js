const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Helpers
const createUserToken = require('../helpers/create-user-token');
const getUserByToken = require('../helpers/get-user-by-token');
const getToken = require('../helpers/get-token');


module.exports = class UserController {
    static async register(req, res) {
        const { name, email, password, confirmpassword, phone } = req.body;
console.log(name)
        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' });
            return;
        }
        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' });
            return;
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória' });
            return;
        }
        if (!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória' });
            return;
        }
        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' });
            return;
        }
        if (password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem!' });
            return;
        }

        //Check if user exists

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            res.status(422).json({ message: 'Usuário já cadastrado' });
            return;
        }

        //Generate a password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        //Create a User

        const user = new User({
            name,
            email,
            password: passwordHash,
            phone,
        });

        try {
            const newUser = await user.save();
            await createUserToken(newUser, req, res);
        }
        catch (error) {
            res.status(500).json({ message: error });
        }

    }

    static async login(req, res) {
        const { email, password } = req.body;

        if (!email) {
            res.status(422).json({ message: 'O e-mail é obrigatório!' });
            return;
        }
        if (!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' });
            return;
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(422).json({ message: 'Usuário não existe!' });
            return;
        }

        //Check if password matchs

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            res.status(422).json({ message: 'Senha incorreta' });
            return;
        }

        await createUserToken(user, req, res);
    }

    static async checkUser(req, res) {

        let currentUser;

        console.log(req.headers.authorization);

        if (req.headers.authorization) {
            const token = getToken(req);
            const decoded = jwt.verify(token, 'nossosecret');

            currentUser = await User.findById(decoded.id);

            currentUser.password = undefined;
        }
        else {
            currentUser = null;
        }

        res.status(200).send(currentUser);
    }

    static async getUserById(req, res) {
        const id = req.params.id;

        const user = await User.findById(id).select('-password');

        if (!user) {
            res.status(422).json({
                message: 'Usuário não encontrado',
            });
            return;
        }

        res.status(200).json({ user });
    }

    static async editUser(req, res) {
        const id = req.params.id;

        const token = getToken(req);
        const user = await getUserByToken(token);

        const { name, phone, email, password, confirmpassword } = req.body;
        
        if(req.file){
            user.image = req.file.filename;
        }

        // Validations

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' });
            return;
        }
        user.name = name;

        if (!email) {
            res.status(422).json({ message: 'O email é obrigatório' });
            return;
        }


        // check if user exists
        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro e-mail!' })
            return
        }

        user.email = email

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório' });
            return;
        }

        user.phone = phone

        if (password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem!' });
            return;
        } else if (password === confirmpassword && password != null) {
            // creating password
            const salt = await bcrypt.genSalt(12)
            const reqPassword = req.body.password

            const passwordHash = await bcrypt.hash(reqPassword, salt)

            user.password = passwordHash
        }

        try {
            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true },
            )
            res.status(200).json({ message: 'Usuário atualizado com sucesso!' });

        } catch (err) {
            res.status(500).json({ message: err });
            return;
        }
    }
};

