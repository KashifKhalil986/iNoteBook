import React , {useState} from 'react';
import {useNavigate} from 'react-router-dom'
const Signup = (props) => {
  const [credentials, setcredentials] = useState({name:"",email:"",password:""});
  const onChange = (e)=>{
      setcredentials({ ...credentials, [e.target.name]: e.target.value });
  }
  let Navigate = useNavigate();
  const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name:credentials.name,
            email:credentials.email,
            password:credentials.password
            }),
      });
      const json = await response.json();

      if(json.success===true){
          localStorage.setItem('token',json.authtoken)
          Navigate('/')
          props.showAlert("Account Created Successfully","success")
      }
      else{
        props.showAlert("Invalid Credentials","danger")
      }
  
  }

  return (
    <div className="mt-3">
      <h2>Create Account to used iNoteBook</h2>
    <form onSubmit={handleSubmit}>

<div className="mb-3">
      <label htmlFor="name" className="form-label">User Name</label>
      <input type="text" className="form-control" onChange={onChange}  id="name" name="name"required minLength={3}  />
     
    </div>

    <div className="mb-3">
      <label htmlFor="email" className="form-label">Email address</label>
      <input type="email" className="form-control" onChange={onChange}  id="email" name="email" aria-describedby="emailHelp"/>
     
    </div>
    <div className="mb-3">
      <label htmlFor="password" className="form-label">Password</label>
      <input type="password" className="form-control"onChange={onChange}  id="password" name="password" required minLength={8}  />
    </div>

    <div className="mb-3">
      <label htmlFor="cpassword" className="form-label">Confirm Password</label>
      <input type="password" className="form-control" onChange={onChange} id="cpassword" name="cpassword" required minLength={8} />
    </div>
  
    <button type="submit" className="btn btn-primary">Submit</button>
  </form>
  </div>
  )
}

export default Signup
