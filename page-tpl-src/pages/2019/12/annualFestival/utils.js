import sharePic from './mobile/images/share.jpg'

export function getQs (key) {
    const search = location.search

    const map = {}

    search.slice(1).split('&').forEach((kv) => {
        if (!kv) return
        const keyVal = kv.split('=')
        map[keyVal[0].trim()] = keyVal[1] ? keyVal[1].trim() : true
    })

    return map[key]
}

export function setShare (title, content) {
    window.gjShareParam = JSON.stringify({
        title,
        content,
        link: location.href,
        imgLink: location.protocol + sharePic // eslint-disable-line
    })

    typeof gBridge !== 'undefined' && gBridge.setShareData(window.gjShareParam) // eslint-disable-line

    document.title = title
}

export default {
    getQs,
    setShare
}
