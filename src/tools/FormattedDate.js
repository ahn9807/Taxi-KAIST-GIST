export default function FormattedDate(date, line = false) {
    var d = new Date(date)
    var h = d.getHours()
    var m = d.getMinutes()
    var cvt = 12
    var str = '오전'

    if(h >= 12) {
        str='오후'
    }

    if(h == 12) {
        cvt = 12
    } else {
        cvt = h % 12
    }
    
    if(line ==false) {
        return str + '\n' + cvt + ':' + m
    } else {
        return str + ' ' + cvt + ':' + n(m)
    }

}

function n(n){
    return n > 9 ? "" + n: "0" + n;
}
