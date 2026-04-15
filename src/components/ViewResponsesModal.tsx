import './ViewResponsesModal.css';

interface Props {
  voters: {
    available: string[];
    tentative: string[];
    unavailable: string[];
  };
  onClose: () => void;
}

export default function ViewResponsesModal({ voters, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content responses-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Poll Responses</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="responses-body">
          <div className="response-group">
            <h3 className="text-success">Available ({voters.available.length})</h3>
            {voters.available.length > 0 ? (
              <ul className="response-list">
                {voters.available.map((name, i) => <li key={i}>{name}</li>)}
              </ul>
            ) : <p className="empty-response">None</p>}
          </div>

          <div className="response-group">
            <h3 className="text-warning">Tentative ({voters.tentative.length})</h3>
            {voters.tentative.length > 0 ? (
              <ul className="response-list">
                {voters.tentative.map((name, i) => <li key={i}>{name}</li>)}
              </ul>
            ) : <p className="empty-response">None</p>}
          </div>

          <div className="response-group">
            <h3 className="text-danger">Unavailable ({voters.unavailable.length})</h3>
            {voters.unavailable.length > 0 ? (
              <ul className="response-list">
                {voters.unavailable.map((name, i) => <li key={i}>{name}</li>)}
              </ul>
            ) : <p className="empty-response">None</p>}
          </div>
        </div>
        <div className="modal-actions" style={{ padding: '0 1.5rem 1.5rem' }}>
          <button type="button" className="cancel-btn w-full" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
