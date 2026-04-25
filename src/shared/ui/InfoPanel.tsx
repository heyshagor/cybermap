export default function InfoPanel() {
  return (
    <aside className="info-panel">
      <section className="info-panel-section">
        <h3>About</h3>
        <div className="hug-rows">
          <div className="hug-row">
            <span className="hug-row-label">LinkedIn</span>
            <div className="hug-row-content">
              <a
                className="github-badge"
                href="https://www.linkedin.com/in/itzshagor"
                target="_blank"
                rel="noreferrer"
              >
                itzshagor
              </a>
            </div>
          </div>
          <div className="hug-row">
            <span className="hug-row-label">Instagram</span>
            <div className="hug-row-content">
              <a
                className="github-badge"
                href="https://www.instagram.com/heyshagor"
                target="_blank"
                rel="noreferrer"
              >
                heyshagor
              </a>
            </div>
          </div>
          <div className="hug-row">
            <span className="hug-row-label">Facebook</span>
            <div className="hug-row-content">
              <a
                className="github-badge"
                href="https://www.facebook.com/0heyshagor"
                target="_blank"
                rel="noreferrer"
              >
                0heyshagor
              </a>
            </div>
          </div>
          <div className="hug-row">
            <span className="hug-row-label">Home</span>
            <div className="hug-row-content">
              <a
                className="github-badge"
                href="https://heyshagor.github.io/"
                target="_blank"
                rel="noreferrer"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}
