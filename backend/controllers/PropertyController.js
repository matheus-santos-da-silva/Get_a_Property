const User = require('../models/User');
const Property = require('../models/Property');

const getToken = require('../helpers/get_token');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class PropertyController {

    static async create(req, res) {

        const { type, address, zipcode, price, bedrooms, description, title } = req.body;
        const images = req.files;

        const validations = [
            { field: 'type', message: 'O tipo do imóvel é obrigatório' },
            { field: 'address', message: 'O endereço do imóvel é obrigatório' },
            { field: 'zipcode', message: 'O cep é obrigatório' },
            { field: 'price', message: 'O preço é obrigatório' },
            { field: 'bedrooms', message: 'A quantidade de quartos do seu imóvel é obrigatória' },
            { field: 'title', message: 'O título para o seu imóvel é obrigatório' }
        ];

        const available = true;

        for (const validation of validations) {
            if (!req.body[validation.field]) {
                res.status(422).json({ message: validation.message });
                return; 
            }
        }

        if (images.length === 0) {
            res.status(422).json({ message: 'A imagem é obrigatória.' });
            return; 
        }

        const token = await getToken(req);
        const user = await getUserByToken(token);

        const property = new Property({
            type,
            address,
            zipcode,
            price,
            bedrooms,
            title,
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

            res.status(201).json({
                message: 'Imóvel cadastrado com sucesso.',
                newProperty
            });
            return;

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
            return;
        }
    }

    static async getAll(req, res) {

        try {
            const properties = await Property.find().sort('-createdAt');
            res.status(200).json({ properties: properties });
            return; 
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
            return;
        }

    }

    static async getUserProperties(req, res) {

        const token = await getToken(req);
        const user = await getUserByToken(token);

        try {

            const properties = await Property.find({ 'user._id': user._id }).sort('-createdAt');
            res.status(200).json({ properties: properties });
            return; 

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
            return; 
        }

    }

    static async getUserNegotiations(req, res) {

        const token = await getToken(req);
        const user = await getUserByToken(token);

        try {

            const properties = await Property.find({ 'contractor._id': user._id }).sort('-createdAt');
            res.status(200).json({ properties: properties });
            return; 

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
            return; 
        }
    }

    static async getPropertyById(req, res) {

        const id = req.params.id;

        const idExists = await Property.findById(id);
        if (!idExists) {
            res.status(422).json({ message: 'Imóvel não encontrado.' });
            return; 
        }

        try {

            const property = await Property.findById(id);
            res.status(200).json({ property: property });
            return; 

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
            return; 
        }
    }

    static async deleteProperty(req, res) {

        const id = req.params.id;

        const token = await getToken(req);
        const user = await getUserByToken(token);

        const idExists = await Property.findById(id);
        if (!idExists) {
            res.status(404).json({ message: 'Imóvel não encontrado.' });
            return; 
        }

        if (idExists.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Este imóvel não é seu!' });
            return;
        }

        try {

            await Property.findByIdAndRemove(id);
            res.status(200).json({ message: 'Imóvel removido com sucesso!' });
            return; 

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
            return; 
        }
    }

    static async editProperty(req, res) {

        const id = req.params.id;
        const { type, address, zipcode, price, bedrooms, description, title } = req.body;
        const images = req.files;

        const available = true;

        const validations = [
            { field: 'type', message: 'O tipo do imóvel é obrigatório' },
            { field: 'address', message: 'O endereço do imóvel é obrigatório' },
            { field: 'zipcode', message: 'O cep é obrigatório' },
            { field: 'price', message: 'O preço é obrigatório' },
            { field: 'bedrooms', message: 'A quantidade de quartos do seu imóvel é obrigatória' },
            { field: 'title', message: 'O título para o seu imóvel é obrigatório' }
        ];

        const updatedData = {};

        const token = await getToken(req);
        const user = await getUserByToken(token);

        const idExists = await Property.findOne({ _id: id });
        if (!idExists) {
            res.status(404).json({ message: 'Imóvel não encontrado.' });
            return; 
        }

        if (idExists.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Este imóvel não é seu!' });
            return; 
        }

        for (const validation of validations) {
            if (!req.body[validation.field]) {
                res.status(422).json({ message: validation.message });
                return; 
            }
        }

        updatedData.type = type;
        updatedData.address = address;
        updatedData.zipcode = zipcode;
        updatedData.price = price;
        updatedData.bedrooms = bedrooms;
        updatedData.title = title;
        updatedData.description = description;


        if (images.length > 0) {
            updatedData.images = [];
            images.map((image) => {
                updatedData.images.push(image.filename);
            })
        }

        try {

            await Property.findByIdAndUpdate(id, updatedData);
            res.status(200).json({ message: 'Imóvel atualizado com sucesso!' });
            return; 

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
            return; 
        }
    }

    static async schedule(req, res) {

        const id = req.params.id;

        const property = await Property.findOne({ _id: id });
        if (!property) {
            res.status(404).json({ message: 'Imóvel não encontrado.' });
            return;
        }

        const token = await getToken(req);
        const user = await getUserByToken(token);

        if (property.user._id.toString() === user._id.toString()) {
            res.status(404).json({ message: 'Você não pode agendar uma visita para o seu próprio imóvel.' });
            return;
        }

        if (property.contractor._id.toString() === user._id.toString()) {
            res.status(404).json({ message: 'Você já agendou uma visita a esse imóvel.' });
            return;
        }


        try {

            property.contractor = {
                _id: user._id,
                name: user.name,
                phone: user.phone
            }

            await Property.findByIdAndUpdate(id, property);
            res.status(200).json({ message: `Visita agendada com sucesso entre em contato com o ${property.user.name}, pelo telefone ${property.user.phone}` });
            return;


        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro na requisição, tente novamente mais tarde.'
            });
            return;
        }
    }

    static async concludeNegotiation(req, res) {

        const id = req.params.id;

        const property = await Property.findOne({ _id: id });
        if (!property) {
            res.status(404).json({ message: 'Imóvel não encontrado.' });
            return;
        }

        const token = await getToken(req);
        const user = await getUserByToken(token);

        if (property.user._id.toString() !== user._id.toString()) {
            res.status(422).json({ message: 'Este imóvel não é seu!' });
            return;
        }

        property.available = false;

        try {

            await Property.findByIdAndUpdate(id, property);
            res.status(200).json({ message: 'Parabéns! o processo de negociação foi finalizado com sucesso!' });
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