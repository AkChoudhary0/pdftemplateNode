const Counter = require("../../models/user/counter");

async function getNextSequence(name) {
    const updated = await Counter.findOneAndUpdate(
        { name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return updated.seq;
}

module.exports = getNextSequence;
