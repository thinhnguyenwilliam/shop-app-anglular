import {
    IsNotEmpty,
    MinLength,
    IsString,
    IsPhoneNumber,
} from 'class-validator';

export class UserLoginDto {
    //@IsPhoneNumber()
    phoneNumber!: string;

    @MinLength(8)
    @IsNotEmpty()
    @IsString()
    password!: string;

    role_id!: number;
}
