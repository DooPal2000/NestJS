import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatsService } from "./chats.service";
import { EnterChatDto } from "src/common/dto/enter-chat.dto";

@WebSocketGateway({
    // ws://localhost:3000/chats
    namespace: 'chats'
})
export class ChatsGateway implements OnGatewayConnection {
    constructor(
        private readonly chatsService: ChatsService,
    ) { }

    @WebSocketServer()
    server: Server;

    handleConnection(socket: Socket) {
        console.log(`on connect called: ${socket.id}`);
    }

    @SubscribeMessage('create_chat')
    async createChat(
        @MessageBody() data: CreateChatDto,
        @ConnectedSocket() socket: Socket,
    ) {
        const chat = await this.chatsService.createChat(
            data,
        );
    }

    @SubscribeMessage('enter_chat')
    async enterChat(
        // 방의 ID들을 리스트로 받는다.
        @MessageBody() data: EnterChatDto,
        @ConnectedSocket() socket: Socket,
    ) {
        for (const chatId of data.chatIds) {
            const exists = await this.chatsService.checkIfChatExists(
                chatId,
            );

            if (!exists) {
                throw new WsException({
                    code: 100,
                    message: `존재하지 않는 chat 입니다. chatId: ${chatId}`,
                });
            }
        }


        socket.join(data.chatIds.map((x) => x.toString()));

        // for (const chatId of data) {
        //     socket.join(chatId.toString());
        // }
    }

    //socket.on('send_message',(msg) => { console.log(msg) });
    @SubscribeMessage('send_message')
    sendMessage(
        @MessageBody() message: { message: string, chatId: number },
        @ConnectedSocket() socket: Socket,
    ) {
        // 아래의 경우, broadCasting 이기 때문에, 자신 제외하고 메세지 전송
        socket.to(message.chatId.toString()).emit("receive_message", message.message);

        // 아래의 경우, 보낸 자신까지도 포함하여 메세지 전송
        // this.server.in(
        //     message.chatId.toString()
        // ).emit('receive_message', message.message);
        // console.log(message);
    }
}