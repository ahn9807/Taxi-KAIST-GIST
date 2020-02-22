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
      placeholder={focusedOnSource ? '출발지 검색' : '도착지 검색'}
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
          return row.structured_formatting.main_text
      }}
      listViewDisplayed={searchFocused}
      fetchDetails={true}
      debounce={200}
      enablePoweredByContainer={false}
      styles={style}

      renderRightButton={()=>
        <Button buttonStyle={style.button} title={focusedOnSource ? '출발지' : '도착지'} onPress={rightButtonCallback}/>
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
    borderRadius: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.0,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 18,
  },
  listView: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { x: 0, y: 0 },
    shadowRadius: 15,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
  },
  row: {
    padding: 20,
    height: 58,
  },
  button: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default SearchInput;
