const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* helpers */
const createUserToken = require('../helpers/create-user-token');
const checkUserExists = require('../helpers/check-if-user-exists');
const getToken = require('../helpers/get_token');
const getUserByToken = require('../helpers/get-user-by-token');
const encryptingPass = require('../helpers/encrypt-password');

module.exports = class UserController {

    static async register(req, res) {
        const { name, email, phone, age, password, confirmpassword  } = req.body;

        const userExists = await checkUserExists(email);

        const validations = [
            { field: 'name', message: 'O nome é obrigatório' },
            { field: 'email', message: 'O email é obrigatório' },
            { field: 'phone', message: 'O telefone é obrigatório' },
            {
                field: 'age', message: 'A idade é obrigatória e deve ser maior que 18 anos',
                check: () => parseInt(age, 10) >= 18
            },
            { field: 'password', message: 'A senha é obrigatória' },
            { field: 'confirmpassword', message: 'A confirmação de senha é obrigatória' },
        ];

        for (const validation of validations) {
            if (!req.body[validation.field] || (validation.check && !validation.check())) {
                res.status(422).json({ message: validation.message });
                return;
            }
        }

        if(userExists) {
            res.status(422).json({ message: 'Já existe um usuário com este email' });
            return;
        }

        if(confirmpassword !== password) {
            res.status(422).json({ message: 'As senhas não condizem' });
            return;
        }

        /* Encrypting password */
        const passwordHash = await encryptingPass(password);

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

        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: error
            });
            return;
        }
    }

    static async login(req, res) {

        const { email, password } = req.body;

        const user = await checkUserExists(email);

        if (!user) {
            res.status(422).json({ message: 'Este usuário não existe.' });
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

        /* checking password */
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            res.status(422).json({ message: 'Senha inválida, tente novamente' });
            return;
        }

        try {

            await createUserToken(user, req, res);

        } catch (error) {
            console.log(error)
            res.status(500).json({ 
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.' 
            });
            return;
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
            return;

        } catch (error) {

            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
            return;
        }
    }

    static async getUserById(req, res) {

        const id = req.params.id;

        try {

            const user = await User.findById({ _id: id }).select('-password');
            if (!user) throw new Error();

            res.status(200).json({ user });
            return;

        } catch (error) {

            console.log(error);
            res.status(500).json({
                message: 'Usuário não encontrado.'
            });
            return;

        }

    }

    static async editUser(req, res) {

        const id = req.params.id;
        const { name, email, phone, age, password, confirmpassword } = req.body;

        const token = await getToken(req);
        const user = await getUserByToken(token);

        const idExists = await User.findById(id);
        if (!idExists) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
            return;
        }

        if (!user) {
            res.status(404).json({ message: 'Usuário não encontrado.' });
            return;
        }

        const validations = [
            { field: 'name', message: 'O nome é obrigatório' },
            { field: 'email', message: 'O email é obrigatório' },
            { field: 'phone', message: 'O telefone é obrigatório' },
            {
                field: 'age', message: 'A idade é obrigatória e deve ser maior que 18 anos',
                check: () => parseInt(age, 10) >= 18
            }
        ];

        const userExists = await User.findOne({ email: email });

        if (user.email !== email && userExists) {
            res.status(422).json({ message: 'Utilize outro email!' });
            return;
        }

        user.email = email;

        for (const validation of validations) {
            if (!req.body[validation.field] || (validation.check && !validation.check())) {
                res.status(422).json({ message: validation.message });
                return;
            }
        }

        user.name = name;
        user.phone = phone;
        user.age = age;

        if (confirmpassword !== password) {
            res.status(422).json({ message: 'As senhas não condizem' });
            return;

        } else if (password === confirmpassword && password !== undefined) {
            const passwordHash = await encryptingPass(password);
            user.password = passwordHash
        }

        try {

            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )

            res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
            return;

        } catch (error) {

            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
            return;
        }
    }
}