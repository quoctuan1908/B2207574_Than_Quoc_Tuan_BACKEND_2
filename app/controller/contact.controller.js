const ApiError = require("../api-error");
const ContactService = require("../service/contact.service.js");
const MongoDB = require("../utils/mongodb.utils.js");


exports.create = async (req, res, next) => {
    console.log(req.body)
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        let contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        res.send(document)
    } catch (err) {
        return next(
            new ApiError(500, "this is error")
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await contactService.findByName(name);
        } else {
            documents = await contactService.find({});
        }

    } catch (err) {
        return next(new ApiError(500, "An error occurred while creating the contact"));
    }

    res.send(documents)
}

exports.findOne = async (req, res, next) => {
    let document = {};
    try {
        const contactService = new ContactService(MongoDB.client);
        document = await contactService.findById(req.params.id);
    } catch (err) {
        return next(new ApiError(500, "Error retrieving contact"));
    }

    res.send(document)
}

exports.update = async (req, res, next) => {

    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data update can't not be empty"));
    }

    let document = {};

    try {
        const contactService = new ContactService(MongoDB.client);
        document = await contactService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Contact not found"))
        }
        res.send({ message: "Contact was updated successfully" });
    }
    catch (err) {
        return next(new ApiError(500, "Error updating contact with id:" + req.params.id))
    }
}

exports.delete = async (req, res, next) => {

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
    } catch (err) {
        return next(new ApiError(500, "Error with deleting contact with id:" + req.params.id))
    }

    res.send({ message: "Delete completed." })
}

exports.deleteAll = async (req, res, next) => {

    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message: `${deletedCount} contact were deleted.`
        })
    } catch (err) {
        return next(new ApiError(500, "Error occured when delete all contacts"));
    }
}

exports.findAllFavorites = async (req, res, next) => {

    try {
        const contactService = new ContactService(MongoDB.client);
        const favorites = contactService.findAllFavorite();
        res.send(favorites)
    } catch (err) {
        return next(new ApiError(500, "Error occured when find all favorite contacts"));
    }
}
