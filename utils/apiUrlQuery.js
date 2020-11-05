// Function to generate the API query url
const withQuery = require('with-query').default

const generateQueryUrl = (url) => {
    const baseUrl = url

    // Using the spread operator to pass the object as an array item to the function
    const queryUrl = (...params) => {
        const apiParams = params[0]
        const apiQueryUrl = withQuery(baseUrl, apiParams)
        return apiQueryUrl
    }

    return queryUrl 
}

module.exports = { generateQueryUrl }