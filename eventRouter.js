// router factory
const router = () => {

  //const sound = 'eventRouter ready to use...'
  const routes = {}

  return {
    hello: () => {
      console.log( 'Hello' )
    },
    add: (event,handler) => {
      // fsdj
    }
  }

}

const eventRouter = router()
module.exports = eventRouter
