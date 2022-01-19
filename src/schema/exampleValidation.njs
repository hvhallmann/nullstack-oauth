import Ajv from 'ajv';
const ajv = new Ajv()
import { nft } from './db.njs';

const validate = ajv.compile(nft)

const data = {
    metaData: {
        title: 'test'
    },
    shopId: '3434'
}

const valid = validate(data)

console.log(valid && 'is valid' || 'not valid');
if (!valid) console.log(validate.errors)