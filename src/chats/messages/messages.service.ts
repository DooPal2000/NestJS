import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessagesModel } from "./entity/messages.entity";
import { FindManyOptions, Repository } from "typeorm";
import { CommonService } from "src/common/common.service";
import { BasePaginationDto } from "src/common/dto/base-pagination.dto";

@Injectable()
export class ChatsMessagesService {
    constructor(
        @InjectRepository(MessagesModel)
        private readonly messageRepository: Repository<MessagesModel>,
        private readonly commonService: CommonService,
    ) { }

    createMessage(
        
    ){
        
    }

    paginateChats(
        dto: BasePaginationDto,
        overrideFindOptions: FindManyOptions<MessagesModel>,
    ) {
        return this.commonService.paginate(
            dto,
            this.messageRepository,
            overrideFindOptions,
            'messages',
        )
    }
}