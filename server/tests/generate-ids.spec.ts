import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

test('generate hash', () => {
    const hash = bcrypt.hashSync('password', 10)
    console.log(hash)
})

test('generate random uuid', () => {
    console.log(uuid())
})
