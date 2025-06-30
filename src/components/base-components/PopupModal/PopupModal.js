import "./PopupModal.css"

export default function PopupModal(props){

    if(!props.isOpen) return null;

    return(
        <div id="popup-backdrop" onClick={props.onClose}>
            <div id="popup-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={props.onClose}>X</button>
                {props.children}
            </div>
        </div>);
}