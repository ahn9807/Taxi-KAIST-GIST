import firebase from 'firebase'
import 'firebase/firestore'
// import * as Reservation from "./Reservation"

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
    // console.log(item)
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

export function deleteCalculation(calculationId) {
    //일단 reservation에서 1명일때 데이터 처리를 위한 삭제 옵션 만들었다
    //. 정산 데이터는 임의 삭제 안되게 할듯? 
    return new Promise(function (resolve, reject) {
        var docRef = firebase.firestore()
            .collection('Calculation')
            .doc(calculationId)

        docRef.get().then(function (doc) {

            if (doc.exists) {

                docRef.delete()
            }
        })
        resolve(false)
    })
}

//받을 때 보낼 때 나누자...
export function completeCalculation(calculationId){
    //history로 보내기, reservationdata에서도 없애야 함... 후 
    //내일 준호랑 cost에 대해 이야기 해보고 만들자.
    return new Promise(function(resolve, reject) {
        var docRef = firebase.firestore()
        .collection('Calculation')
        .doc(calculationId)
        
        var resDoc=firebase.firestore()
        .collection('KAIST') //아직 kaist. regionName도 받아와야겠지
        .doc(calculationId)

        docRef.get().then(function(doc) {
  
            if(doc.exists){
                const data=doc.data()

                data.users.forEach((uid)=>{
                    firebase.firestore()
                    .collection('History')
                    .doc(uid)
                    .collection('Data')
                    .doc(calculationId)
                    .set({
                        source: data.source,
                        dest: data.dest,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        hostId: data.hostId,
                        users: data.users,
                        accountBank: data.accountBank,
                        accountNumber: data.accountNumber,
                        charge: data.charge
                    })
                    
                })

                docRef.delete()
                resDoc.delete()


            }
        })
        resolve(false)
    })

}