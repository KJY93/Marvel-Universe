// Loading libraries
const fetch = require('node-fetch')
const withQuery = require('with-query').default
const handlebars = require('express-handlebars')
const express = require('express')
const { md5Hash } = require('./utils/hash.js')
const { generateQueryUrl } = require('./utils/apiUrlQuery.js')


// Configuring port
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000

// Declaring constants
const BASEURL = 'https://gateway.marvel.com:443/v1/public/comics'
const PUBLIC_API_KEY = process.env.PUBLIC_API_KEY || ""
const PRIVATE_API_KEY = process.env.PRIVATE_API_KEY || ""
const formatType = 'collection'
const LIMIT = 18

// Creating an instance of the express application
const app = express()

// Loading static files
app.use(express.static(__dirname + '/static'))

// Setting up view engine to handle hbs file
app.engine('hbs',
    handlebars({
        defaultLayout: 'default.hbs'
    })
)
app.set('view engine', 'hbs')

// Starting the application
if ((PUBLIC_API_KEY) && (PRIVATE_API_KEY)) {
    app.listen(
        PORT,
        () => {
            console.info(`Application has started on PORT ${PORT} at ${new Date()}`)
        }
    )
}
else {
    console.error('Missing API keys')
}

// API call
const getMarvelComics = async (formatType) => {

    // Getting hash value for API call
    hash = md5Hash(PRIVATE_API_KEY, PUBLIC_API_KEY)

    const apiParams = {
        ts: hash[0],
        apikey: PUBLIC_API_KEY,
        hash: hash[1],
        formatType: formatType,
        limit: LIMIT,
    }

    // Getting queryUrl 
    const queryUrl = generateQueryUrl(BASEURL)(apiParams)

    try {
        const response = await fetch(queryUrl)
        const result = (await response.json())['data']['results']
        return result
    }
    catch (err) {
        console.info(err)
        return
    }
}

const getMarvelComicsCharsByComicId = async (comicId) => {
    // Getting hash value for API call
    hash = md5Hash(PRIVATE_API_KEY, PUBLIC_API_KEY)
    
    const apiParams = {
        ts: hash[0],
        apikey: PUBLIC_API_KEY,
        hash: hash[1],
    }

    // Getting queryUrl 
    const queryUrl = generateQueryUrl(`${BASEURL}/${comicId}/characters`)(apiParams)  

    try {
        const response = await fetch(queryUrl)
        const result = (await response.json())['data']['results']
        return result
    }
    catch (err) {
        console.error(err)
    }
}

// Routes endpoint
app.get('/', async (req, res) => {

    const comics = await getMarvelComics(formatType)
    res.status(200)
    res.type('text/html')
    res.render('index', {
        comics,
        hasContent: comics.length > 0
    })
})

app.get('/chars/:comicId', async (req, res) => {
    let getComicId = req.params.comicId

    // Getting hash value for API call
    hash = md5Hash(PRIVATE_API_KEY, PUBLIC_API_KEY)

    // Fetching list of characters by comic id
    const comicChars = await getMarvelComicsCharsByComicId(getComicId)

    res.status(200)
    res.type('text/html')
    res.render('charlist', {
        comicChars,
        hasContent: comicChars.length > 0
    })
})