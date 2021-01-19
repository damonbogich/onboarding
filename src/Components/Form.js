import {useState, useEffect} from 'react';
import {formSchema} from './formSchema';
import Axios from 'axios';

import * as yup from "yup";

export default function Form({addUser}) {
    //set up at least 2 validations using YUP
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
        terms: false
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        terms: ""
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);

    const validate = e => {
        yup.reach(formSchema)
        .validate(e.target.value)
        .then((valid) => {
            setErrors({
                ...errors,
                [e.target.name] : ""
            })
        })
        .catch((err) => {
            setErrors({
                ...errors,
                [e.target.name] : err.errors
            })
        })
    }

    //determines if submit is enabled or disabled
    useEffect(() => {
        /* We pass the entire state into the entire schema, no need to use reach here. 
        We want to make sure it is all valid before we allow a user to submit
        isValid comes from Yup directly */
        formSchema.isValid(userInfo).then(valid => {
          setButtonDisabled(!valid);
        });
      }, [userInfo]);

    const inputChange = e => {
        validate(e);
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setUserInfo({
            ...userInfo,
            [name] : value
        });
    };
    
    const handleSubmit = e => {
        e.preventDefault();
        console.log('form submitted')
        Axios.post("https://reqres.in/api/users", userInfo)
        .then(res => {
            console.log(res.data)
            addUser(res.data)
        })
        .catch(err => {
            console.log(err);
        })
    };

    return (
        <form onSubmit={handleSubmit} >
            <label> Name
                <input name="name" id="name" value={userInfo.name} onChange={inputChange}/>
            </label>
            <label> Email
                <input name="email" id="email" value={userInfo.email} onChange={inputChange}/>
            </label>
            <label> Password
                <input name="password" id="password" type="password" value={userInfo.password} onChange={inputChange}/>
            </label>
            <label> I agree to the terms of service
                <input type="checkbox" name="terms" id="terms" checked={userInfo.terms} onChange={inputChange} />
            </label>
            <button disabled={buttonDisabled}>Submit</button>
        </form>
    )
}