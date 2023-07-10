const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* helpers */
const createUserToken = require('../helpers/create-user-token');
const checkUserExists = require('../helpers/check-if-user-exists');
const getToken = require('../helpers/get_token');

module.exports = class UserController {

    static async register(req, res) {
        const { name, email, phone, age, password, confirmpassword  } = req.body;

        const userExists = await checkUserExists(email);

        if(!name) {
            return res.status(422).json({ message: 'O nome é obrigatório' });
        }

        if(!email) {
            return res.status(422).json({ message: 'O email é obrigatório' });
        }

        if(userExists) {
            return res.status(422).json({ message: 'Já existe um usuário com este email' });
        }

        if(!phone) {
            return res.status(422).json({ message: 'O telefone é obrigatório' });
        }

        if(!age) {
            return res.status(422).json({ message: 'A idade é obrigatória' });
        }

        if(password.length < 8) {
            return res.status(422).json({ message: 'A senha precisa ter pelo menos 8 caracteres' });
        }

        if(!password) {
            return res.status(422).json({ message: 'A senha é obrigatória' });
        }

        if(!confirmpassword) {
            return res.status(422).json({ message: 'A confirmação de senha é obrigatória' });
        }

        if(confirmpassword !== password) {
            return res.status(422).json({ message: 'As senhas não condizem' });
        }

        /* Encrypting password */
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password.toString(), salt);

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            age: age,
            password: passwordHash
        });

        try {

            const newUser = await user.save();
            await createUserToken(newUser, req, res);
            res.status(201).json({ message: 'Registrado com sucesso!' });

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
        }
    }

    static async login(req, res) {

        const { email, password } = req.body;

        const user = await checkUserExists(email);

        if (!user) {
            return res.status(422).json({ message: 'Este usuário não existe.' });
        }

        if (!email) {
            return res.status(422).json({ message: 'O email é obrigatório' });
        }

        if (!password) {
            return res.status(422).json({ message: 'A senha é obrigatória' });
        }

        /* checking password */
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(422).json({ message: 'Senha inválida, tente novamente' });
        }

        try {

            await createUserToken(user, req, res);
            res.status(201).json({ message: 'Logado com sucesso!' });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ 
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.' 
            });
        }
    }

    static async checkUser(req, res) {

        let currentUser;

        if (!req.headers.authorization) return res.status(401).json({
            message: 'O token é necessário.'
        })

        const token = await getToken(req);
        const decoded = jwt.verify(token, `${process.env.SECRET_JWT}`);

        try {

            currentUser = await User.findById(decoded.id).select('-password');

            res.status(201).json({ currentUser });

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
        }
    }

    static async getUserById(req, res) {

        const id = req.params.id;

        try {

            const user = await User.findById({ _id: id }).select('-password');
            if (!user) throw new Error();

            res.status(200).json({ user });

        } catch (error) {

            console.log(error);
            return res.status(500).json({
                message: 'Usuário não encontrado.'
            });

        }

    }

}