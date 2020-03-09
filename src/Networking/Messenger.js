//일단 지역명을 kaist로 기본 설정하고, 나중에 users에 넣는 방식으로 고칠 것.
//promise 사용
import firebase from 'firebase'
import 'firebase/firestore'

var regionName
var internalDocumentation

export function setRegion(name) {
    regionName = name
}

export function fetchReservationData() {
    return new Promise(function (resolve, reject) {
        firebase.firestore()
            .collection(regionName)
            .get()
            .then(function (doc) {
                internalDocumentation = doc
                resolve(doc)
            })
    })
}

export function getAvailableChatRoomName() {
    var returnArray = []
    const uid = firebase.auth().currentUser.uid
    internalDocumentation.forEach(function (doc) {
        if (doc.data().users.includes(uid) && (doc.data().endTime >= Date.now()) ) {
            var result= Object.assign(doc.data(), {id: doc.id})
            returnArray.push(result)
            // 제대로 하려면 reservation id를 따로 만들어주어야 한다. 
        }
    
        
    })
    console.log(returnArray)
    returnArray.sort((a, b)=>{
        return a['endTime']-b['endTime']
    })
    return returnArray
}

export function getCalculationChatRoomName() {
    var returnArray = []
    const uid = firebase.auth().currentUser.uid
    internalDocumentation.forEach(function (doc) {
        if (doc.data().users.includes(uid) && (doc.data().endTime < Date.now())) {
            var result= Object.assign(doc.data(), {id: doc.id})
            returnArray.push(result)
        }
        
    })
    returnArray.sort((a, b)=>{
        return a['endTime']-b['endTime']
    })
    console.log("calchat ")
    console.log(returnArray)
    console.log("end")
    return returnArray
}