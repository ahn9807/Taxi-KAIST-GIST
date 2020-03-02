import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Button } from 'react-native-elements';

const query = {
  key: 'AIzaSyDFND1fH5Cs8laIZKQ_UbUb0nL0gVx_OQ0',
  language: 'ko',
};

const SearchInput = ({ onLocationSelected, rightButtonCallback, focusedOnSource }) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <GooglePlacesAutocomplete
      minLength={2}
      autoFocus={true}
      placeholder={focusedOnSource ? '선택 지점 ➤ 학교' : '학교 ➤ 선택 지점'}
      onPress={onLocationSelected}
      autoFocus={false}
      query={query}
      textInputProps={{
        onFocus: () => {
          setSearchFocused(true);
        },
        onBlur: () => {
          setSearchFocused(false);
        },
        autoCapitalize: 'none',
        autoCorrect: false,
      }}
      renderDescription={row => {
          if(row.terms[1] == undefined) {
            return row.structured_formatting.main_text
          }
          return row.terms[1].value + ' ' + row.structured_formatting.main_text
      }}
      listViewDisplayed={searchFocused}
      fetchDetails={true}
      debounce={200}
      enablePoweredByContainer={false}
      styles={style}
      renderRightButton={()=>
        <Button 
          buttonStyle={style.button} 
          onPress={rightButtonCallback}
          icon={{ name: 'repeat', color: '#5d5d5d'}}
        />
      }
    />
  );
};


SearchInput.propTypes = {
  onLocationSelected: PropTypes.func.isRequired,
};

SearchInput.defaultProps = {};

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: getStatusBarHeight() + 14,
    width: '100%',
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 54,
    marginHorizontal: 20,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    height: 54,
    margin: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRightColor: '#ddd',
    fontSize: 18,
  },
  listView: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
  },
  row: {
    padding: 20,
    height: 58,
  },
  button: {
    height: 54,
    width: 54,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderLeftColor: '#fff',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default SearchInput;
