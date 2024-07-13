import { ValidationArguments } from "class-validator";

export const emailValidationMessage = (args: ValidationArguments) => {
    /**
     * ValidationArguments 프로퍼티들
     * 1. value -> 검증되고 있는 값
     * 2. constraints -> 파라미터에 입력된 제한 사항들
     *  args.constraints[0] -> 1
     *  args.constraints[1] -> 20
     * 3. targetName -> 검증하고 있는 클래스의 이름
     * 4. object -> 검증하고 있는 객체
     * 5. property -> 검증되고 있는 객체의 프로퍼티 이름(= nickname)
     */
    return `${args.property}는 반드시 이메일 형식을 맞춰야 합니다.`
}