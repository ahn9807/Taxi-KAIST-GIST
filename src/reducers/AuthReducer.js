import AppNavigator from '../App'

export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SIGNUP = 'SIGNUP'

export default function reducer(state = {}, action = {}) {
    switch(action.type) {
        default:
            break;
    }
}

export function Login() {
    return { type: LOGIN }
}