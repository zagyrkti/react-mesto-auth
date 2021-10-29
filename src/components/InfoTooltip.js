import {useEffect, useCallback} from "react";
import success from "../images/success.svg"

function InfoTooltip(props) {
  const {onClose} = props
  const successMessage = "Вы успешно зарегистрировались!"
  const failMessage = "Что-то пошло не так!\n" +
      "Попробуйте ещё раз."
  const handlePopupClose = useCallback((evt) => {
    if (evt.target.classList.contains("popup_opened") || evt.target.classList.contains("popup__close") || (evt.key === "Escape")) {
      if (onClose) {
        onClose()
      }
    }
  }, [onClose])

  useEffect(() => {
    if (props.isOpen) {
      document.addEventListener("keydown", handlePopupClose);

      return () => {
        document.removeEventListener("keydown", handlePopupClose);
      }
    }
  }, [props.isOpen, handlePopupClose])

  return (
      <div className={`popup_type_infoTooltip popup ${props.isOpen && 'popup_opened'}`}
           onClick={handlePopupClose}>
        <div className="popup-form popup-form_type_infoTooltip">
          <img src={success} className="popup-form__status-image" alt="статус"/>
          <p className="popup-form__status-message">{failMessage}</p>
          <button type="button"
                  className={`popup__close popup-form__close popup-form__close_owner_failMessage link link_type_normal`}>
          </button>
        </div>
      </div>
  )
}

export default InfoTooltip