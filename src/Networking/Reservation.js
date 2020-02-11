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

export function fetchReservationData(name) {
    return new Promise(function (resolve, reject) {
        firebase.firestore()
        .collection(name)
        .get()
        .then(function(doc) {
            internalDocumentation = doc
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
        if(doc.data().source == source) {
            returnArray.push(doc.data())
        }
    })
    
    return returnArray
}

export function getReservationByDest(dest) {
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        if(doc.data().dest == dest) {
            returnArray.push(doc.data())
        }
    })
    
    return returnArray
}