const MedicineRequest = require("../models/MedicineRequest");

// create
exports.createMedicineRequest = async (req, res) => {
  try {
    const newReq = await MedicineRequest.create(req.body);
    res.status(201).json(newReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all
exports.getAllMedicineRequests = async (req, res) => {
  try {
    const data = await MedicineRequest.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get by id
exports.getMedicineRequestById = async (req, res) => {
  try {
    const item = await MedicineRequest.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update status
exports.updateMedicineStatus = async (req, res) => {
  try {
    const item = await MedicineRequest.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    item.status = req.body.status;
    item.fulfilled_by = req.body.fulfilled_by ?? item.fulfilled_by;
    item.fulfilled_date = req.body.fulfilled_date ?? item.fulfilled_date;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete
exports.deleteMedicineRequest = async (req, res) => {
  try {
    const deleted = await MedicineRequest.destroy({
      where: { request_id: req.params.id }
    });

    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
