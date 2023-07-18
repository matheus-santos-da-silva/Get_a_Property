const User = require('../models/User');
const Property = require('../models/Property');

const getToken = require('../helpers/get_token');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class PropertyController {

    static async create(req, res) {

        const { type, address, zipcode, price, bedrooms, description } = req.body;
        const images = req.files;

        const available = true;

        if (!type) {
            return res.status(422).json({ message: 'O tipo do imóvel é obrigatório' });
        }

        if (!address) {
            return res.status(422).json({ message: 'O endereço do imóvel é obrigatório' });
        }

        if (!zipcode) {
            return res.status(422).json({ message: 'O cep é obrigatório' });
        }

        if (!price) {
            return res.status(422).json({ message: 'O preço é obrigatório' });
        }

        if (!bedrooms) {
            return res.status(422).json({ message: 'A quantidade de quartos do seu imóvel é obrigatória' });
        }

        if (images.length === 0) {
            return res.status(422).json({ message: 'A imagem é obrigatória.' });
        }

        const token = await getToken(req);
        const user = await getUserByToken(token);

        const property = new Property({
            type,
            address,
            zipcode,
            price,
            bedrooms,
            description,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone
            }
        })

        images.map((image) => {
            property.images.push(image.filename);
        })

        try {

            const newProperty = await property.save();

            return res.status(201).json({
                message: 'Imóvel cadastrado com sucesso.',
                newProperty
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
        }

    }

    static async getAll(req, res) {

        try {
            const properties = await Property.find().sort('-createdAt');
            return res.status(200).json({ properties: properties });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
        }



    }

    static async getUserProperties(req, res) {

        const token = await getToken(req);
        const user = await getUserByToken(token);

        try {

            const properties = await Property.find({ 'user._id': user._id }).sort('-createdAt');
            return res.status(200).json({ properties: properties });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
        }

    }

    static async getUserNegotiations(req, res) {

        const token = await getToken(req);
        const user = await getUserByToken(token);

        try {

            const properties = await Property.find({ 'contractor._id': user._id }).sort('-createdAt');
            return res.status(200).json({ properties: properties });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
        }
    }

    static async getPropertyById(req, res) {

        const id = req.params.id;

        const idExists = await Property.findById(id);
        if (!idExists) {
            return res.status(422).json({ message: 'Imóvel não encontrado.' });
        }

        try {

            const property = await Property.findById(id);
            return res.status(200).json({ property: property });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
        }
    }

    static async deleteProperty(req, res) {

        const id = req.params.id;

        const token = await getToken(req);
        const user = await getUserByToken(token);

        const idExists = await Property.findById(id);
        if (!idExists) {
            return res.status(404).json({ message: 'Imóvel não encontrado.' });
        }

        if (idExists.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({ message: 'Este imóvel não é seu!' });
        }

        try {

            await Property.findByIdAndRemove(id);
            return res.status(200).json({ message: 'Imóvel removido com sucesso!' });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
        }

    }

}