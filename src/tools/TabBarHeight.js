import { Dimensions, Platform } from "react-native"
import { getStatusBarHeight } from "react-native-iphone-x-helper";

const isLandscape = () => {
    const dim = Dimensions.get('screen')
    return dim.width >= dim.height
}
export default function tabBarHeight() {
    const majorVersion = parseInt(Platform.Version, 10);
    const isIos = Platform.OS === 'ios';
    const isIOS11 = majorVersion >= 11 && isIos;
    
    if(Platform.isPad) return 49;
    if(isIOS11 && !isLandscape()) return 49 + getStatusBarHeight()
    return 49
}