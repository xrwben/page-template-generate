
const fs = require('fs')

const avatar = fs.readFileSync('./avatar.txt', { encoding: 'utf8' })
const name = fs.readFileSync('./name.txt', { encoding: 'utf8' })

const data = name.trim().split('\n').map(item => {
    const kv = item.trim().split('\t')
    return {
        id: kv[0].trim(),
        nickname: kv[1].trim()
    }
})

avatar.trim().split('\n').map(item => {
    const kv = item.trim().split('\t')
    data.find(item => item.id === kv[0].trim()).avatar = kv[1].trim()
})

fs.writeFileSync('./output.json', JSON.stringify(data))
