import express from 'express'
import cors from 'cors'
import { handlerRaw } from './s3'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

app.use(cors())

app.get('/tiles/*', async (request, response) => {
    console.log(request.url)

    const resp = await handlerRaw(request.url) 
    const headersKeys = Object.keys(resp.headers)
    if (headersKeys.length) {
        headersKeys.forEach(name => {
            const value = resp.headers[name]
            if (typeof value === 'string') {
                response.setHeader(name, value)
            }
        })
    }
    response.status(resp.statusCode)
    response.send(resp.body)
    response.end()
})

app.use(express.static(path.resolve(__dirname, '../static')))

async function main() {
    app.listen(8080, () => {
        console.log('Listen at :8080')
    })
}

main()
