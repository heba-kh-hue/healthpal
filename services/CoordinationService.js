class CoordinationService {
    constructor(repo) { this.repo = repo; }

    async addInventory(data, userId, file) {
        const item = {
            name: data.name,
            type: data.type,
            quantity: data.quantity,
            location: data.location,
            source_id: userId,
            image_url: file ? file.filename : null
        };
        return await this.repo.addItem(item);
    }

    async search(city) { return await this.repo.searchItems(city); }
    
    async requestItem(data, userId) {
        return await this.repo.createRequest({ ...data, patient_id: userId });
    }

    async fulfill(data, userId) {
        return await this.repo.fulfillTransaction(data.request_id, data.inventory_id, userId);
    }
}
module.exports = CoordinationService;