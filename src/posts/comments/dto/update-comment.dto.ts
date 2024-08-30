import { PartialType, PickType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { CreateCommentsDto } from "./create-comments.dto";

export class UpdateCommentsDto extends PartialType(CreateCommentsDto) {}