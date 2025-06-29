import "./Modal.css";

type props = {
  message: string;
  onClick():void;
};

export default function Modal({message,onClick}:props) {

  return (
    <div className="modal ">
      <div className="modal-contents">
        <p>{message}</p>
        <button onClick={onClick}>Play again</button>
      </div>
    </div>
  );
}
