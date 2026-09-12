
export const create = async ({ model, data = [{}], options = { validateBeforeSave: true } } = {}) => {
    return await model.create(data, options)
}
export const createOne = async ({ model, data = {}, options = {} } = {}) => {
    const [doc] = await model.create([data], options)
    return doc
}

export const insertMany = async ({ model, data } = {}) => {
    return await model.insertMany(data)
}

export const updateOne = async ({ model, filter, update, options = {} } = {}) => {
    return await model.updateOne(filter || {}, { ...update, $inc: { __v: 1 } }, options)
}

export const findOne = async ({ model, filter = {}, options = {}, select = '' } = {}) => {
    const doc = model.findOne(filter).select(select)
    if (options.lean) doc.lean()
    if (options.populate) doc.populate(options.populate)
    return await doc.exec()
}
export const find = async ({ model, filter = {}, options = {} } = {}) => {
    const doc = model.find(filter)
    if (options.select) doc.select(options.select)
    if (options.lean) doc.lean(options.lean)
    if (options.populate) doc.populate(options.populate)
    if (options.limit) doc.limit(options.limit)
    if (options.skip) doc.skip(options.skip)
    if (options.sort) doc.sort(options.sort)
    return await doc.exec()
}
export const findById = async ({ model, id, options = {} } = {}) => {
    const doc = model.findById(id)
    if (options.select) doc.select(options.select)
    if (options.lean) doc.lean(options.lean)
    if (options.populate) doc.populate(options.populate)
    return await doc.exec()
}
export const findByIdAndUpdate = async ({ model, id, update, options = { new: true } } = {}) => {
    return await model.findByIdAndUpdate(id, { ...update, $inc: { __v: 1 } }, options)
}

export const deleteOne = async ({ model, filter } = {}) => {
    return await model.deleteOne(filter || {})
}
export const deleteMany = async ({ model, filter } = {}) => {
    return await model.deleteMany(filter || {})
}
export const findOneAnddelete = async ({ model, filter } = {}) => {
    return await model.findOneAndDelete(filter || {})
}
















