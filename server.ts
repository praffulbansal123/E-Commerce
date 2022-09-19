import app from './src/app'
import logger from './src/logger/logger'


// server initialization
app.listen(app.get('port'), () => {
    logger.info(`Server listening on port ${app.get('port')}`);
})