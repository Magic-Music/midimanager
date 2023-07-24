const findBySlug = (items, slugValue, slugKey='slug') => {
    return items.find(function(item) {return item[slugKey] === slugValue})
}

module.exports = {
    findBySlug
}