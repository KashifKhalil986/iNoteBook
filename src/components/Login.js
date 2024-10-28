
import React , {useState} from 'react';
import {useNavigate} from 'react-router-dom'


const Login = (props) => {
    const [credentials, setcredentials] = useState({email:"",password:""});
    const onChange = (e)=>{
        setcredentials({ ...credentials, [e.target.name]: e.target.value });
    }
    let Navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email:credentials.email,
              password:credentials.password
              }),
        });
        const json = await response.json();
       
        if(json.success===true){
            localStorage.setItem('token',json.authtoken)
            Navigate('/')
            props.showAlert("Login Successfully ","success")
        }
        else{
            props.showAlert("Invalid Credentials" ,"danger")
        }
    }
    return (
        <div className="mt-3">
            <h2>Login to continue iNoteBook</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email"  name="email" onChange={onChange} value ={credentials.email} aria-describedby="emailHelp" />
               
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name="password" onChange={onChange} value={credentials.password} />
            </div>

            <button type="submit" className="btn btn-primary" >Submit</button>
        </form>
        </div>
    );
}

export default Login;
