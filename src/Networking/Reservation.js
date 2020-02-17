import firebase from '../config/Firebase'
import { Alert } from 'react-native'

var regionName
var internalDocumentation

const defaultResponse = {
    size: 0
}

export function setRegion(name) {
    regionName = name
}

//일단은 여기서 시간이 지난 데이터를 삭제하도록 하자...
export function fetchReservationData() {
    return new Promise(function (resolve, reject) {
        firebase.firestore()
        .collection(regionName)
        .get()
        .then(function(doc) {
            internalDocumentation = doc
            internalDocumentation.forEach(doc => {
                if(doc.data().endTime < Date.now()) {
                    doc.ref.delete()
                }
            })

            resolve(doc)
        })
    })
}

export function searchReservationBySourceDest(source, dest) {
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().source == source && doc.data().dest == dest) {
            returnArray.push(doc.data())
        }
    })

    return returnArray
}

export function getReservationBySource(source) {
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().source == source && doc.data().endTime > Date.now()) {
            returnArray.push(doc.data())
        }
    })
    
    return returnArray
}

export function getReservationByDate(year, month, day, offset=0) {
    var returnArray = []
    var refDate = Date(year, month, day)
    internalDocumentation.forEach(function(doc) {
        if(doc.data.endTime > refDate + offset) {
            returnArray.push(doc.data())
        }
    })

    return returnArray.sort((a,b) => {
        if(a.endTime == b.endTime){ return 0 }
        return a.endTime > b.endTime ? 1 : -1
    })
}

export function getMarkerBySource(source) {
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().source == source && doc.data().endTime > Date.now() && doc.data().marker != undefined) {
            returnArray.push(doc.data().marker)
        }
    })

    return returnArray
}

export function getMarkerByDest(dest) {
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().source == dest && doc.data().endTime > Date.now() && doc.data().marker != undefined) {
            returnArray.push(doc.data().marker)
        }
    })

    return returnArray
}

export function getReservationByDest(dest) {
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().dest == dest && doc.data().endTime > Date.now()) {
            returnArray.push(doc.data())
        }
    })
    
    return returnArray
}

export function makeReservation(source, dest, startTime, endTime, marker, userUid) {
    return new Promise(function(resolve, reject) {
        var docRef = firebase.firestore()
        .collection(regionName)
        .doc(source + '->' + dest + ' s:' + startTime + ' d:' + endTime)
    
        docRef.get().then(function(doc) {
            if(doc.exists) {
                var tempArray = doc.data().users
                console.log(tempArray.length)
                //유저가 3명 이하인지 확인한다.
                if(doc.data().users != undefined && tempArray.length < 4) {
                    //유저가 이미 가입했는지 확인한다.
                    var alreadyContained = false
                    for(var i=0;i<tempArray.length;i++) {
                        if(tempArray[i] == userUid) {
                            alreadyContained = true
                        }
                    }
                    //전체 유저가 3명 이하이며, 자기자신이 가입되어 있지 않는다면
                    if(!alreadyContained) {
                        tempArray.push(userUid)
                        docRef.set({
                            users: tempArray
                        }, { merge: true})
                    } else {
                        resolve(false)
                    }
                } else {
                    //유저가 이미 4명이라서 방에 가입할 수 없는 상태이다.
                    resolve(false)
                }
            } else {
                docRef.set({
                    source: source,
                    dest: dest,
                    startTime: startTime,
                    endTime: endTime,
                    marker: marker,
                    users: [userUid],
                })
            }
        })

        resolve(true)
    })
}

export function removeReservation(source, dest, startTime, endTime, marker, userUid) {
    return new Promise(function(resolve, reject) {
        var docRef = firebase.firestore()
        .collection(regionName)
        .doc(source + '->' + dest + ' s:' + startTime + ' d:' + endTime)
    
        docRef.get().then(function(doc) {
            if(doc.exists) {
                var tempArray = doc.data().users
                var contained = false
                for(var i=0;i<tempArray.length;i++) {
                    if(tempArray[i] == userUid) {
                        contained = true
                        tempArray.splice(i, 1)
                    }
                }

                if(contained) {
                    //만약 아무도 가입하지 않은 예약이면 예약을 삭제한다
                    if(tempArray.length == 0) {
                        docRef.delete()
                    }
                    //누군가 가입한 방이면 예약을 삭제하지 않는다 
                    else {
                        docRef.set({
                            users: tempArray
                        }, { merge: true })
                    }
                    
                    resolve(false)
                }
            }
        })

        resolve(false)
    })
}