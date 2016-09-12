// router factory
const router = () => {

  var logger
  const routes = {}

  return {
    logStatus: () => {
      logger.debug('Registry: '+JSON.stringify(routes))
    },
    add: (event,handler) => {
      // fsdj
      routes[event] = handler
    },
    setLogger: (aLogger) => {
      logger = aLogger
    }
  }

}

const eventRouter = router()
module.exports = eventRouter
