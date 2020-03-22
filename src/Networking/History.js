import firebase from 'firebase'
import 'firebase/firestore'
// import * as Reservation from "./Reservation"

// var regionName
var internalDocumentation

export function fetchHistoryDataById(uid) {
    return new Promise(function (resolve, reject) {
        firebase.firestore()
        .collection("History")
        .doc(uid)
        .collection('Data')
        .get()
        .then(function(doc) {
            internalDocumentation = doc
            resolve(doc)

        }).catch(function(err) {
            alert(err.message)
        })
    })
}

export function getData() { 
    var returnData=[]

    internalDocumentation.forEach(function(doc){
        data=doc.data()
        const rowData=[]
        rowData.push(FormattedDate(data.endTime))
        rowData.push(data.source +' ➤ '+ data.dest)
        rowData.push(data.users.length)
        rowData.push(data.charge * (data.users.length))
        rowData.push(data.charge * (data.users.length-1))
        
        returnData.push(rowData)
    })

    return returnData
}

//     var returnArray = []
//     internalDocumentation.



// }

function n(n){
    return n > 9 ? "" + n: "0" + n;
}

function FormattedDate(date) { //일단 날짜만
    var f = new Date(date)
    var month=f.getMonth()+1
    var d = f.getDate()
    var h = f.getHours()
    var m = f.getMinutes()

    return month +'/'+ d
}

