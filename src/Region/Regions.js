import GIST from './GIST'
import KAIST from './KAIST'
import { Alert } from 'react-native'

export default function findRegionByName(name) {
    switch(name) {
        case 'GIST':
            return GIST
            break
        case 'KAIST':
            return KAIST
            break
        default:
            Alert('Region Not Find! Critical Error')
    }
}