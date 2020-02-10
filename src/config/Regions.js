import Region_GIST from './Region_GIST'
import { Alert } from 'react-native'

export default function findRegionByName(name) {
    switch(name) {
        case 'GIST':
            return Region_GIST
            break
        default:
            Alert('Region Not Find! Critical Error')
    }
}