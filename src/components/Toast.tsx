import { useUI } from '../contexts/UIContext';

export default function Toast() {
  const { toastMessage } = useUI();
  
  return (
    <div className={`toast ${toastMessage ? 'show' : ''}`} id="toast">
      {toastMessage}
    </div>
  );
}
