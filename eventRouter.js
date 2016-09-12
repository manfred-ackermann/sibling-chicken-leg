// router factory
const router = () => {

  var logger
  const routes = {}

  return {
    hello: () => {
      logger.info('Hello')
    },
    add: (event,handler) => {
      // fsdj
    },
    addLogger: (aLogger) => {
      logger = aLogger
    }
  }

}

const eventRouter = router()
module.exports = eventRouter
