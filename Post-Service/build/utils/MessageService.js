import { connect } from "amqplib";
import "dotenv/config";
let connection;
let channel;
// RabbitMQ Sender class
export class MessageSender {
    queue;
    constructor(queue) {
        this.queue = queue;
    }
    // Send a message
    async sendMessage(message) {
        if (!connection) {
            connection = await connect(process.env.AMQP_URI);
        }
        if (!channel) {
            channel = await connection.createChannel();
        }
        if (channel) {
            channel.sendToQueue(this.queue, Buffer.from("fkldfjdl"));
        }
        else {
            throw new Error("Channel is closed or undefined");
        }
    }
}
// RabbitMQ Consumer class
export class MessageConsumer {
    queue;
    constructor(queue) {
        this.queue = queue;
    }
    // Consume a message
    async consumeMessage() {
        return new Promise(async (resolve, reject) => {
            try {
                if (!connection) {
                    connection = await connect(process.env.AMQP_URI);
                }
                if (!channel) {
                    channel = await connection.createChannel();
                }
                if (channel) {
                    channel.consume(this.queue, (msg) => {
                        if (msg !== null) {
                            const message = msg.content.toString();
                            console.log(`Received message: ${message}`);
                            // Acknowledge the message
                            channel.ack(msg);
                            resolve(message);
                        }
                    });
                }
                else {
                    throw new Error("Channel is closed or undefined");
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
