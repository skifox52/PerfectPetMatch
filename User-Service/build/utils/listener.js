import { MessageConsumer } from "./MessageService.js";
(async () => {
    try {
        const queue = "populateUserForAllPosts";
        const consumer = new MessageConsumer(queue);
        const message = await consumer.consumeMessage();
        console.log(message);
    }
    catch (error) {
        console.error(error);
    }
})();
