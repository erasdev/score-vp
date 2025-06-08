---
layout: doc
title: Request
---

# Request

Fill out the form below to request a piece of sheet music. We'll do our best to find or create it for you.

<form name="request" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="request-form">
  <input type="hidden" name="form-name" value="request" />
  <input type="hidden" name="subject" value="Request for {title}" />
  <p class="hidden">
    <label>Don't fill this out if you're human: <input name="bot-field" /></label>
  </p>

  <div class="form-group">
    <label for="title">Title *</label>
    <input type="text" id="title" name="title" required />
  </div>

  <div class="form-group">
    <label for="artists">Artists *</label>
    <input type="text" id="artists" name="artists" required />
  </div>

  <div class="form-group">
    <label for="notes">Additional Notes</label>
    <textarea id="notes" name="notes" rows="4"></textarea>
  </div>

  <div class="form-group">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required />
  </div>

  <button type="submit" class="submit-button">Submit Request</button>
</form>

<style>
.request-form {
  margin: 2rem auto;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.form-group textarea {
  resize: vertical;
}

.submit-button {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background: var(--vp-c-brand-dark);
}

.hidden {
  display: none;
}
</style> 