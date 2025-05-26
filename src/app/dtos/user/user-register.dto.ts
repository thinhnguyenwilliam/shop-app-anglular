import { 
    IsEmail, 
    IsNotEmpty, 
    MinLength, 
    IsDateString, 
    IsNumber, 
    IsString, 
    IsPhoneNumber,
    IsDate
 } from 'class-validator';

export class UserRegisterDto {
    @IsNotEmpty()
    @IsPhoneNumber()
    phone_number!: string;

    @IsEmail()
    email!: string;

    @MinLength(6)
    password!: string;

    @MinLength(8)
    retype_password!: string;

    @IsNotEmpty()
    fullname!: string;

    @IsDateString()
    date_of_birth!: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNumber()
    facebook_account_id!: number;

    @IsNumber()
    google_account_id!: number;

    @IsNumber()
    role_id!: number;
}
