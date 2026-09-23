// Route transition state: a thin gold line under the nav on the light canvas,
// so page content (and its reveal animations) is never hidden behind an overlay.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="min-h-[60vh] bg-canvas">
      <div className="fixed top-20 inset-x-0 z-40 h-0.5 overflow-hidden bg-line/60">
        <div className="h-full w-1/3 bg-accent animate-loader-bar" />
      </div>
    </div>
  );
}
