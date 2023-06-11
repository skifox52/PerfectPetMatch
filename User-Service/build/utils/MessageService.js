import { connect } from "amqplib";
import "dotenv/config";
let connection;
let channel;
//RabbitMQ Sender class
export class MessageSender {
    queue;
    constructor(queue) {
        this.queue = queue;
    }
    //Send a message
    async sendMessage(message) {
        try {
            if (!connection) {
                connection = await connect(process.env.AMQP_URI);
            }
            if (!channel) {
                channel = await connection.createChannel();
            }
            channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)));
        }
        catch (error) {
            throw error;
        }
    }
}
//RabbitMQ Consumer class
export class MessageConsumer {
    queue;
    constructor(queue) {
        this.queue = queue;
    }
    //Consume a message
    async consumeMessage() {
        return new Promise(async (resolve, reject) => {
            try {
                if (!connection) {
                    connection = await connect(process.env.AMQP_URI);
                }
                if (!channel) {
                    channel = await connection.createChannel();
                }
                channel.consume(this.queue, (msg) => {
                    if (msg !== null) {
                        const message = msg.content.toString();
                        console.log(`Recieved message: ${message}`);
                        //Acknowledge the message
                        channel.ack(msg);
                        resolve(message);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
