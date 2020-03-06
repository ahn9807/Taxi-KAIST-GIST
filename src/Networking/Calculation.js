import firebase from 'firebase'
import 'firebase/firestore'

// var regionName
var internalDocumentation

export function fetchCalculationData() {
    return new Promise(function (resolve, reject) {
        firebase.firestore()
        .collection("Calculation")
        .get()
        .then(function(doc) {
            internalDocumentation = doc
            resolve(doc)

        }).catch(function(err) {
            alert(err.message)
        })
    })
}


export function makeCalculation(item){
    console.log(item)
    console.log("make cal")

    return new Promise(function(resolve, reject) {
        var docRef = firebase.firestore()
        .collection("Calculation")
        .doc(item.calculationId)


        docRef.get().then(function(doc){
            docRef.set({
                calculationId: item.calculationId,
                source: item.source,
                dest: item.dest,
                startTime: item.startTime,
                endTime: item.endTime,
                hostId: item.hostId,
                users: item.users,
                accountBank: item.accountBank,
                accountNumber: item.accountNumber,
                charge: item.charge
            })

            alert('정산이 시작되었습니다.')
            resolve(true)

        }).catch((err)=>{
            alert(err.message)
            resolve(false)
        })

    })
}

export function searchCalculationByUId(uid) {
    console.log("hgf")
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().users.includes(uid)) {
            returnArray.push(doc.data())
        }
    })
    console.log(returnArray+ "312312")
    return returnArray
}


export function searchCalculationIdsByUId(uid) { //messengerlobby
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().users.includes(uid)) {
            returnArray.push(doc.data().calculationId)
        }
    })
    return returnArray
}


export function searchCalculationHostByUId(uid) {
    console.log("hgf")
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().users.includes(uid) && doc.data().hostId===uid) {
            returnArray.push(doc.data())
        }
    })

    return returnArray
}

export function searchCalculationSendByUId(uid) {
    console.log("hgf")
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().users.includes(uid) && doc.data().hostId!==uid) {
            returnArray.push(doc.data())
        }
    })
    return returnArray
}



//받을 때 보낼 때 나누자...
export function completeCalculation(){
    //history로 보내기, reservationdata에서도 없애야 함... 후 
    //내일 준호랑 cost에 대해 이야기 해보고 만들자.



}