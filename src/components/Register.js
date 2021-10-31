import {useState} from "react";
import {Link} from "react-router-dom";

function Register(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [processing, setProcessing] = useState(false)

  function reset() {
    setEmail('')
    setPassword('')
  }

  function handleNameChange(e) {
    setEmail(e.target.value)
  }

  function handleLinkChange(e) {
    setPassword(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onRegistration(email, password, setProcessing, reset);
  }

  return (
        <form className="popup-form popup-form_type_sign-x" name="register" onSubmit={handleSubmit}>
          <h2 className="popup-form__title popup-form__title_type_sign-x">Регистрация</h2>
          <label>
            <input type="email" name="email" minLength="2" maxLength="30" required value={email}
                   className="popup-form__input popup-form__input_type_top popup-form__input_data_email"
                   placeholder="Email" onChange={handleNameChange}/>
            <span className="popup-form__input-error popup-form__input-error_type_email"></span>
          </label>
          <label>
            <input type="password" name="password" required value={password}
                   className="popup-form__input popup-form__input_type_normal popup-form__input_data_password"
                   placeholder="Пароль" onChange={handleLinkChange}/>
            <span className="popup-form__input-error popup-form__input-error_type_password"></span>
          </label>
          <button type="submit"
                  className={`popup-form__save popup-form__save_owner_sign-x link link_type_save`}>
            {processing ? "Регистрация" : "Зарегистрироваться"}
          </button>
          <Link to="/sign-in" className="popup-form__message link link_type_normal">Уже зарегистрированы? Войти</Link>
        </form>
  )
}

export default Register