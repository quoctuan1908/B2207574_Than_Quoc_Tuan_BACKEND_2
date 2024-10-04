const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.contact = client.db("blog").collection("posts");
    }
    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phoneNumber: payload.phoneNumber,
            favorite: payload.favorite
        }
        Object.keys(contact).forEach((key) => {
            contact[key] == undefined && delete contact[key];
        });
        return contact;
    }
    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = this.contact.findOneAndUpdate(contact,
            {
                $set: { favorite: contact.favorite == true }
            },
            {
                returnDocument: "after", upsert: true
            }
        );
        return result;
    }

    async find(filter) {
        return await this.contact.find(filter).toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(new RegExp(name)), $option: "i" }
        })
    }

    async findById(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        }
        return await this.contact.findOne(filter)
    }

    async findAllFavorite() {
        return await this.find({ "favorite": true })
    }

    async update(id, body) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        }
        let update = this.extractContactData(body);
        const result = await this.contact.findOneAndUpdate(filter, { $set: update }, { returnDocument: "after" })
        return result;
    }

    async delete(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        }
        const result = await this.contact.findOneAndDelete(filter)
        return result;
    }

    async deleteAll() {
        const result = await this.contact.deleteMany({});
        return result.deletedCount;
    }

}

module.exports = ContactService;