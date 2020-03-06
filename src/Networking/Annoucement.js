import firebase from 'firebase'
import 'firebase/firestore'
import { Alert } from 'react-native'

var internalDocumentation


export function fetchAnnoucement() {
    var returnArray = []
    return new Promise(function (resolve, reject) {
        firebase.firestore()
        .collection('Annoucement')
        .get()
        .then(function(doc) {
            internalDocumentation = doc
            internalDocumentation.forEach(function(doc) {
            })
            resolve(doc)
        }).catch(function(err) {
            alert(err.message)
        })
    })
}

export function getAnnoucement() {
    var returnArray = []
    internalDocumentation.forEach(function(doc) {
        returnArray.push({
            title: doc.data().title,
            subTitle: doc.data().subTitle,
            content: doc.data().content,
            imageUri: doc.data().uri,

            //세팅들
            accordion: true,
        })
    })

    return returnArray
}