import "./Loading.css";
export default function Loading() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="spinner-text">Loading projects...</div>
    </div>
  );
}
