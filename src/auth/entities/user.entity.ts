import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';


@Entity('users')
export class User {

    @ApiProperty({
        example: '265e3d00-d50a-4e89-902d-bb3123e126a8',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ApiProperty({
        example: 'test1@test.com',
        description: 'User Email',
        uniqueItems: true
    })
    @Column('text',{
        unique: true
    })
    email: string;

    @ApiProperty({
        description: 'User Password',
        minLength: 8,
        maxLength: 16
    })
    @Column('text', {
        select: false
    })
    password: string;

    @ApiProperty({
        description: 'User FullName',
        minLength: 1
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        description: 'User isActive',
        default: true
    })
    @Column('bool',{
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        example: ['user', 'admin'],
        description: 'User Role',
        isArray: true,
        default: ['user']
    })
    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[];


    // RELACIONES


    // @OneToMany(
    //     () => Product,
    //     (product) => product.user
    // )
    // product?: Product[];



    // TRIGGERS

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }
}
