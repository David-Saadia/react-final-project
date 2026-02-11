import './SettingItem.css';

export default function SettingItem({ title, description, children, danger }) {
    return (
        <div className={`setting-item ${danger ? 'danger-zone' : ''}`}>
            <div className="setting-info">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <div className="setting-control">
                {children}
            </div>
        </div>
    );
}
