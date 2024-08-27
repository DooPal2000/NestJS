import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatsService } from "./chats.service";
import { EnterChatDto } from "src/common/dto/enter-chat.dto";
import { CreateMessageDto } from "./messages/dto/create-messages.dto";
import { ChatsMessagesService } from "./messages/messages.service";
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { SocketCatchHttpExceptionFilter } from "src/common/exception-filter/socket-catch-http.exception-filter";
import { SocketBearerTokenGuard } from "src/auth/guard/socket/socket-bearer-token.guard";
import { UsersModel } from "src/users/entity/users.entity";
import { UsersService } from "src/users/users.service";
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({
    // ws://localhost:3000/chats
    namespace: 'chats'
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly messagesService: ChatsMessagesService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

    @WebSocketServer()
    server: Server;

    afterInit(server: any) {
        console.log(`after gateway init`);
    }

    handleDisconnect(socket: Socket & { user: UsersModel }) {
        console.log(`on disconnect called : ${socket.id}`);
    }

    async handleConnection(socket: Socket & { user: UsersModel }) {
        console.log(`on connect called: ${socket.id}`);

        const headers = socket.handshake.headers;

        const rawToken = headers['authorization'];

        if (!rawToken) {
            socket.disconnect();
        }

        try {
            const token = this.authService.extractTokenFromHeader(
                rawToken,
                true,
            );

            const payload = this.authService.verifyToken(token);
            const user = await this.usersService.getUserByEmail(payload.email);

            // RestApi 였으면  req 에 담을 텐데, 현재는 ws이기에 소켓에 담는다
            socket.user = user;
            // socket.token = token;
            // socket.tokenType = payload.tokenType;

            return true;
        } catch (e) {
            socket.disconnect();
        }

    }

    @SubscribeMessage('create_chat')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    async createChat(
        @MessageBody() data: CreateChatDto,
        @ConnectedSocket() socket: Socket & { user: UsersModel },
    ) {
        const chat = await this.chatsService.createChat(
            data,
        );
    }

    @SubscribeMessage('enter_chat')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    async enterChat(
        // 방의 ID들을 리스트로 받는다.
        @ConnectedSocket() socket: Socket & { user: UsersModel },
        @MessageBody() data: EnterChatDto,
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
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    @UseFilters(SocketCatchHttpExceptionFilter)
    async sendMessage(
        @MessageBody() dto: CreateMessageDto,
        @ConnectedSocket() socket: Socket & { user: UsersModel },
    ) {
        const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);
        if (!chatExists) {
            throw new WsException(`존재하지 않는 채팅방입니다. Chat ID : ${dto.chatId}`);
        }
        const message = await this.messagesService.createMessage(
            dto,
            socket.user.id,
        );
        // 아래의 경우, broadCasting 이기 때문에, 자신 제외하고 메세지 전송
        socket.to(message.chat.id.toString()).emit("receive_message", message.message);

        // 아래의 경우, 보낸 자신까지도 포함하여 메세지 전송
        // this.server.in(
        //     message.chatId.toString()
        // ).emit('receive_message', message.message);
        // console.log(message);
    }
}