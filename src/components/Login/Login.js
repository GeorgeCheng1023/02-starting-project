import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context'
const emailReducer = (state, action) => {
  if(action.type === 'USER_INPUT'){
    return {value: action.value, isValid: action.value.includes('@')}
  }else if(action.type === 'INPUT_BLUR'){
    return {value: state.value, isValid: state.value.includes('@')}
  }
  return {value: '', isValid: false}
}

const passwordReducer = (state, action) => {
  if(action.type === 'USER_INPUT'){
    return {value: action.value, isValid: action.value.trim().length > 6}
  }else if(action.type === 'INPUT_BLUR'){
    return {value: state.value, isValid: state.value.trim().length > 6}
  }
  return {value: '', isValid: false}
}


const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, emailDispatcher] = useReducer(emailReducer, {value: '', isValid: null});
  const [passwordState, passwordDispatcher] = useReducer(passwordReducer, {value:'', isValid: null});

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(
        emailState.value.includes('@') && passwordState.value.trim().length > 6
      );
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailState.isValid, passwordState.isValid]);

  const emailChangeHandler = (event) => {
    emailDispatcher({type: 'USER_INPUT' , value: event.target.value})
    setFormIsValid(
      event.target.value.includes('@') && passwordState.value.length > 6
    );
  };

  const passwordChangeHandler = (event) => {
    passwordDispatcher({type: 'USER_INPUT' , value:event.target.value})
    setFormIsValid(
      emailState.value.includes('@') && event.target.value.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    emailDispatcher({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    passwordDispatcher({type: 'INPUT_BLUR'})
  };

  const authContext = useContext(AuthContext)
  const submitHandler = (event) => {
    event.preventDefault();
    authContext.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
