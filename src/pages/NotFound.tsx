import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container-tight py-32 text-center">
      <div className="display-1 gradient-text mb-4">404</div>
      <h1 className="display-3 mb-3">We couldn't find that page.</h1>
      <p className="text-muted-foreground mb-8">It may have been moved, or the link is just plain wrong.</p>
      <Link to="/" className="btn-gradient">Back to home</Link>
    </section>
  );
}
