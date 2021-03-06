import firebase from 'firebase'
import 'firebase/firestore'
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
// 히스토리 남게 안하도록 수정함. . 
export function fetchReservationData() {
    return new Promise(function (resolve, reject) {
        firebase.firestore()
        .collection(regionName)
        .get()
        .then(function(doc) {
            internalDocumentation = doc
            // internalDocumentation.forEach(doc => {
            //     if(doc.data().endTime < Date.now()) {
            //         doc.ref.delete()
            //     }
            // })

            resolve(doc)
        }).catch(function(err) {
            alert(err.message)
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

export function getReservationByDest(dest) {
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().dest == dest && doc.data().endTime > Date.now()) {
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

export function getReservationByDateAndSource(date_, source) {
    var tempArray = []
    var returnArray = []
    var date = new Date(date_).setHours(0,0,0,0)
    internalDocumentation.forEach(function(doc) {
        if(doc.data().source == source && doc.data().endTime > Date.now()) {
            tempArray.push(doc.data())
        }
    })

    tempArray.forEach(function(doc) {
        if((doc.endTime > date && doc.endTime <= date + 86400000) || (doc.startTime > date && doc.startTime <= date + 86400000)) {
            returnArray.push(doc)
        }
    })

    return SortByEndTime(returnArray)
}

export function getReservationByDateAndDest(date_, dest) {
    var tempArray = []
    var returnArray = []
    var date = new Date(date_).setHours(0,0,0,0)
    internalDocumentation.forEach(function(doc) {
        if(doc.data().dest == dest && doc.data().endTime > Date.now()) {
            tempArray.push(doc.data())
        }
    })

    tempArray.forEach(function(doc) {
        if((doc.endTime > date && doc.endTime <= date + 86400000) || (doc.startTime > date && doc.startTime <= date + 86400000)) {
            returnArray.push(doc)
        }
    })

    return SortByEndTime(returnArray)
}

// For new home screen - 전체 내역 시간순으로 가져오는 함수 
export function getRecentReservation(){
    // var tempArray = []
    var returnArray = []
    internalDocumentation.forEach((doc)=>{
        // console.log(doc.data())
        returnArray.push(doc.data())
    })
    return SortByStartTime(returnArray)
}


export function SortByStartTime(inputArray) {
    return inputArray.sort((a,b) => {
        if(a.startTime == b.startTime){ return 0 }
        return a.startTime > b.startTime ? 1 : -1
    })
}

export function SortByEndTime(inputArray) {
    return inputArray.sort((a,b) => {
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
        if(doc.data().dest == dest && doc.data().endTime > Date.now() && doc.data().marker != undefined) {
            returnArray.push(doc.data().marker)
        }
    })

    return returnArray
}

export function makeReservation(item, index = 0, navigateToChat) {
    console.log('make Reservation')
    var source = item.source
    var dest = item.dest
    var startTime = item.startTime
    var endTime = item.endTime
    var marker = item.marker
    var userUid = firebase.auth().currentUser.uid
    var comment = item.comment

    var fullName=item.fullName


    console.log(" fn: "+ fullName)

    if(startTime.getTime != undefined) {
        console.log(startTime.getTime())
        startTime = startTime.getTime()
        item.startTime = startTime
    }
    if(endTime.getTime != undefined) {
        endTime = endTime.getTime()
        item.endTime = endTime
    }

    return new Promise(function(resolve, reject) {
        var docRef = firebase.firestore()
        .collection(regionName)
        .doc(source + '->' + dest + ' s:' + startTime + ' d:' + endTime + 'index:' + index)
    
        docRef.get().then(function(doc) {

            // console.log(doc.data())
            if(doc.exists) {
                var uidArray = doc.data().users
                var fullNameArray = doc.data().fullNames
                console.log(uidArray.length)
                //유저가 3명 이하인지 확인한다.
                if(doc.data().users != undefined && uidArray.length < 4) {
                    //유저가 이미 가입했는지 확인한다.
                    var alreadyContained = false
                    for(var i=0;i<uidArray.length;i++) {
                        if(uidArray[i] == userUid) {
                            alreadyContained = true
                        }
                    }
                    //전체 유저가 3명 이하이며, 자기자신이 가입되어 있지 않는다면
                    if(!alreadyContained) {
                        uidArray.push(userUid)
                        fullNameArray.push(fullName)
                        docRef.set({
                            users: uidArray,
                            fullNames: fullNameArray

                        }, { merge: true})
                        Alert.alert('가입되었습니다', '', [{
                            text: '확인', onPress: ()=>{ return null}
                        },
                        { text: "채팅방으로 이동", onPress: ()=>{ 

                            navigateToChat()

                       


                        }}
                        ])
                        resolve(true)
                    } else {
                        alert('이미 가입되어 있습니다')
                        resolve(false)
                    }
                } else {
                    //유저가 이미 4명이라서 방에 가입할 수 없는 상태이다.
                    //이경우 새로운 방을 판다
                    if(index > 10) {
                        //에러일 가능성 100%
                        alert('동일 시간대에 이미 많은 방이 있습니다. 살짝만 시간을 피해서 예약해 주세요.')
                        resolve(false)
                    }
                    makeReservation(item, index + 1)
                }
            } else {
                docRef.set({
                    source: source,
                    dest: dest,
                    startTime: startTime,
                    endTime: endTime,
                    marker: marker,
                    comment: comment,
                    users: [userUid],
                    fullNames: [fullName], 
                })
                alert('여정이 생성되었습니다')
                resolve(true)
            }
        }).catch(function(err) {
            alert(err.message)
            resolve(false)
        })
    })
}

export function removeReservation(source, dest, startTime, endTime, index = 0) {
    return new Promise(function(resolve, reject) {
        var docRef = firebase.firestore()
        .collection(regionName)
        .doc(source + '->' + dest + ' s:' + startTime + ' d:' + endTime + 'index:' + index)

        var userUid = firebase.auth().currentUser.uid

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
                else {
                    removeReservation(source, dest, startTime, endTime, userUid, index + 1)
                }
            }
        })

        resolve(false)
    })
}

export function removeReservationById(reservationId, fullName) {
    return new Promise(function(resolve, reject) {
        var docRef = firebase.firestore()
        .collection(regionName)
        .doc(reservationId)

        // 사람 없는 채팅방도 삭제
        var chatDoc=firebase.firestore()
            .collection('ChatRooms')
            .doc(reservationId)
        
        var calDoc= firebase.firestore()
            .collection('Calculation')
            .doc(reservationId)

        var userUid = firebase.auth().currentUser.uid
        
        docRef.get().then(function(doc) {
            if(doc.exists) {
                var tempArray = doc.data().users
                // console.log("ahahahhah")
                var fullNameArray=doc.data().fullNames
                // console.log("haha")
                var contained = false
                for(var i=0;i<tempArray.length;i++) {
                    if(tempArray[i] == userUid) {
                        contained = true
                        tempArray.splice(i, 1)
                    }
                }

                
                for(var i=0;i<fullNameArray.length;i++) {
                    if(fullNameArray[i] == fullName) {
                        contained = true
                        fullNameArray.splice(i, 1)
                    }
                }
                console.log("???"+ fullNameArray)

                if(contained) {
                    //만약 아무도 가입하지 않은 예약이면 예약을 삭제한다
                    if(tempArray.length == 0) {
                        // console.log("rrrr")
                        docRef.delete()
                        chatDoc.delete()
                        calDoc.delete()
                    }
                    //누군가 가입한 방이면 예약을 삭제하지 않는다 
                    else {
                        // console.log("dddd")
                        docRef.set({
                            users: tempArray,
                            fullNames: fullNameArray
                        }, { merge: true })
                    }
                    
                    resolve(false)
                }
            }
        })

        resolve(false)
    })
}

