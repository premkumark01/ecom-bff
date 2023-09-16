
module.exports = class ProcessEventListener {
    static listen(app) {
        process.on('uncaughtException', (err) => {
            console.log({ event: 'ERROR:APP:PROCESS::UNCAUGHTEXCEPTION', err: err })
        })

        process.on('unhandledRejection', (reason) => {
            console.log({ event: 'ERROR:APP:PROCESS::UNHANDLEDREJECTION', err: reason })
        })

        process.on('SIGTERM', () => {
            app.close(() => {
                console.log('Shuitting down server gracefully')
                process.exit()
            })
        })

        process.on('SIGINT', () => {
            console.log('SIGINT: Shutting down server gracefully')
            process.exit()
        })
    }
}