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
                // internalDocumentation.forEach(doc => {
                //     if(doc.data().endTime < Date.now()) {
                //         doc.ref.delete()
                //     }
                // })

                resolve(doc)
            })
    })
}

export function getChatRoomName() {
    var returnArray = []
    const uid = firebase.auth().currentUser.uid
    internalDocumentation.forEach(function (doc) {
        if (doc.data().users.includes(uid)) {
            var result= Object.assign(doc.data(), {id: doc.id})
            returnArray.push(result)
            // 제대로 하려면 reservation id를 따로 만들어주어야 한다. 

        }
    })

    return returnArray
}
