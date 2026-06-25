export default function Privacy() {
  return (
    <section className="container-tight py-16 max-w-3xl">
      <h1 className="display-2 mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>We respect your privacy. This page outlines what data we collect, why we collect it, and how we protect it.</p>
        <h2 className="text-foreground font-display text-xl mt-8">Data we collect</h2>
        <p>Account info (email, name), listing content you publish, and analytics necessary to operate the platform.</p>
        <h2 className="text-foreground font-display text-xl mt-8">How we use it</h2>
        <p>To operate your account, surface your listing on the directory, and emit structured data to public LLM-readable endpoints (you control what's published).</p>
        <h2 className="text-foreground font-display text-xl mt-8">Your rights</h2>
        <p>You may export or delete your data at any time. Contact us at privacy@geolisted.example.com.</p>
      </div>
    </section>
  );
}
