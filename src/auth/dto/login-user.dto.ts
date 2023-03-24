import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDto{

    @ApiProperty({
        description: 'User Email (unique)',
        example: 'test1@test.com',
        nullable: false
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User Password',
        minLength: 8,
        maxLength: 16,
        nullable: false
    })
    @IsString()
    @MinLength(8)
    @MaxLength(16)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
}