import cron from 'node-cron';

const registerCron = () => {
    if (global.cronStarted) return;

    cron.schedule('*/5 * * * *', () => {
        console.log('Checando prazo');
    });

    global.cronStarted = true;
};

export default registerCron;