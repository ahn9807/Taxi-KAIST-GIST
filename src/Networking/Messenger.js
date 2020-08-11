//일단 지역명을 kaist로 기본 설정하고, 나중에 users에 넣는 방식으로 고칠 것.
//promise 사용
import firebase from 'firebase'
import 'firebase/firestore'

var regionName
var internalDocumentation
var chatDocumentation
export function setRegion(name) {
    regionName = name
}

export function setUnreadMessage(roomname, uid) {
    var docRef = firebase.firestore()
        .collection(regionName)
        .doc(roomname)

    console.log(roomname)

    return firebase.firestore().runTransaction(function (transaction) {
        return transaction.get(docRef).then(function (doc) {
            if (!doc.exists) {
                alert('可愛いジュンホちゃん。。。')
            }
            var newUnreadMessage = doc.data()[uid] + 1
            if(newUnreadMessage == NaN) {
                newUnreadMessage = 0
            }
            var data = {}
            data[uid] = newUnreadMessage
            transaction.set(docRef, data, { merge: true })
        })
    }).then(function () {
        console.log("Document successfully written!")
    })
    .catch(function (err) {
        console.log('failed-' + err)
    })
}

export function setUnreadMessageToZero(roomname, uid) {
    var docRef = firebase.firestore()
        .collection(regionName)
        .doc(roomname)

    var data = {}
    data[uid] = 0

    docRef.set(data, { merge: true })
}

export function getUnreadMessage(roomname, uid) {
    var returnVal = 0
    internalDocumentation.forEach(function (doc) {
        if (doc.id == roomname) {
            returnVal = doc.data()[uid]
        }
    })

    return returnVal == undefined ? 0 : returnVal
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

export function chatDocumentationData() {
    return new Promise(function (resolve, reject) {
        firebase.firestore()
            .collection("Chatrooms")
            .get()
            .then(function (doc) {
                chatDocumentation = doc
                resolve(doc)
            })
    })
}

export function unSubscribeData(list) {
    list.forEach((i) => {
        firebase.firestore().collection("Chatrooms")
            .doc(i.id)
            .collection("messages")
            .onSnapshot(function () {
                console.log("whatwhat")
            })
    })
}

export function subscribeData(list) {
    var preview = []
    console.log("???")
    console.log(list)
    console.log("^^^")


    list.forEach((i) => {
        console.log("fr")
        console.log(i.id)
        firebase.firestore().collection("Chatrooms")
            .doc(i.id)
            .collection("messages")
            .orderBy('createdAt', 'asc')
            .onSnapshot(
                function (snapshot) {
                    console.log("?!!!")
                    snapshot.docChanges().forEach(function (change) {
                        if (change.type === 'added') {
                            console.log(change.doc.data())
                            preview.push(change.doc.data())
                            console.log("gg")
                        }
                        else {
                            console.log("nono")
                        }
                    })
                }

                // preview.push() 

            )

    }

    )
    console.log(preview)

    return preview

}


export function getAvailableChatRoomName() {
    var returnArray = []
    const uid = firebase.auth().currentUser.uid
    internalDocumentation.forEach(function (doc) {
        if (doc.data().users.includes(uid) && (doc.data().endTime >= Date.now())) {
            var result = Object.assign(doc.data(), { id: doc.id })
            returnArray.push(result)
            // 제대로 하려면 reservation id를 따로 만들어주어야 한다. 
        }
    })
    console.log(returnArray)
    returnArray.sort((a, b) => {
        return a['endTime'] - b['endTime']
    })
    return returnArray
}



export function getCalculationChatRoomName() {
    var returnArray = []
    const uid = firebase.auth().currentUser.uid
    internalDocumentation.forEach(function (doc) {
        if (doc.data().users.includes(uid) && (doc.data().endTime < Date.now())) {
            var result = Object.assign(doc.data(), { id: doc.id })
            returnArray.push(result)
            //console.log('test-' + returnArray[0].id)
        }
    })
    returnArray.sort((a, b) => {
        return a['endTime'] - b['endTime']
    })
    // console.log("calchat ")
    // console.log(returnArray)
    // console.log("end")
    return returnArray
}