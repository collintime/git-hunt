# git-hunt
Github repository search api/ui using hapi and react. 

# local dev
This repository contains two apps with independent `package.json` files. Once the ui is built, the api can serve ui static files as well as respond to search requests. Built with node v10.9.0.

## ui
`cd ui && npm install && npm run build`

## api
`cd api && npm install && npm test && npm start`

## browser
[localhost:8000/](localhost:8000/)

## api routes
| method | port | path | returns |
| ------ | ---- | ---- | ---- |
| `GET` | 8000 | `/` | `index.html` file |
| `GET` | 8000 | `/index.js` | `index.js` bundled file |
| `GET` | 8000 | `/repositories/search?q={query}&sort={sort}&page={page}` | `{ total, repositories }` |

# next steps
- ui tests
- make ui pretty
- serve ui from port 8080
- configure webpack dev-server to limit manual `npm run build`
- split app into seperate repositories
