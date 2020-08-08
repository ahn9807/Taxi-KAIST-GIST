import React from 'react'
import { Image } from 'react-native'
import shorthash from 'shorthash'
import * as FileSystem from 'expo-file-system'

export default class CacheImage extends React.Component {
    state = {
        source:null
    }

    componentDidMount = async () => {
        const {uri} = this.props
        const name = shorthash.unique(uri)
        const path = `${FileSystem.cacheDirectory}${name}`
        const image = await FileSystem.getInfoAsync(path)
        if(image.exists){
            console.log('Read Image')
            this.setState({
                source: {
                    uri: image.uri,
                }
            })

            return
        }

        console.log('Download Image')

        const newImage = await FileSystem.downloadAsync(uri, path)
        this.setState({
            source:{
                uri: newImage.uri,
            }
        })
    }

    render() {
        return (
            <Image
                style={this.props.style}
                source={this.state.source}
            />
        )
    }
}