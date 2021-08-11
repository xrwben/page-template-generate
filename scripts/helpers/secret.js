/**
 * 服务器信息
 */

module.exports = {
    local: { /* ! 本地测试 发布服务器 功能时使用 (其他情况请勿使用) ! */
        host: '192.168.184.128',
        username: 'root',
        password: '123456'
    },
    test: {
        videochat: {
            host: '106.75.92.124',
            username: 'webuser',
            password: '9A1KJEjGQb1q'
        },
        social: {
            host: '106.75.48.95',
            username: 'webuser',
            password: '9A1KJEjGQb1q'
        }
    }
}
