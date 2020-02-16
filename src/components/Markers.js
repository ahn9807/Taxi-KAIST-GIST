import { Marker } from "react-native-maps"
import React from 'react'
import { Badge } from "react-native-elements"

const Markers = ({markers, description, pinColor, pinPressedCallback, calloutPressedCallback }) => {
    return(
        markers.map(marker => {
            return(
                <Marker
                    pinColor={pinColor}
                    key={uuidv4()}
                    coordinate={marker.latlng}
                    title={marker.title}
                    description={description}
                    onPress={()=>pinPressedCallback(marker)}
                    onCalloutPress={calloutPressedCallback}
                >
                </Marker>
            )
        })
    )
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export function removeDupulicatedMarkers(targetM, inputM) {
    var returnArray = []
    var tempArray = ['trash']
    for(var i=0;i<targetM.length;i++) {
        var isDupulicated = false
        for(var j=0;j<tempArray.length;j++) {
            if(tempArray[j] == targetM[i].title) {
                isDupulicated = true
            }
        }

        for(var j=0;j<inputM.length;j++) {
            if(inputM[j].title == targetM[i].title) {
                isDupulicated = true
            }
        }

        if(!isDupulicated) {
            returnArray.push(targetM[i])
            tempArray.push(targetM[i].title)
        }
    }

    return returnArray
}
  

export default Markers