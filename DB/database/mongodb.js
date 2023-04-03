async function getOne(Coll, filters, callback){
    Coll.findOne(filters, (err, object) => {
        callback(err, object)
    })
}

async function add(Coll, object, callback){
    Coll.create(object, (err, obj) => {
        callback(err, obj)
    })
}

async function getAll(Coll, callback){
    Coll.find({}, (err, objects) => {
        callback(err, objects)
    }).lean()
}

async function removeOne(Coll, filters, callback){
    Coll.deleteOne(filters, (err) => {
        callback(err)
    })
}

module.exports = { getOne, add, getAll, removeOne }