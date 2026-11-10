import { useState } from "react";
import type { FormEvent } from "react";
import emailjs from "emailjs-com";
import { Page, Section } from "../components/Page";
import { Pager } from "../components/Pager";
import { profile } from "../data/profile";
import { adjacent } from "../nav";

const EMAILJS = {
  service: "service_nbqu8z5",
  template: "template_rlu2k5c",
  user: "CPqj8tXgHxo2XUrio",
};

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const { prev } = adjacent("/contact");
  const crumbs = [
    { name: "Overview", path: "/" },
    { name: "Contact", path: "/contact" },
  ];


  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      await emailjs.sendForm(EMAILJS.service, EMAILJS.template, form, EMAILJS.user);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Page
      eyebrow="Record"
      title="Contact"
      description="Open to software engineering and AI roles, research collaboration, and freelance work."
      path="/contact"
      crumbs={crumbs}
    >
      <Section id="direct" title="Direct">
        <dl className="meta-table">
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </dd>
          </div>
          <div>
            <dt>LinkedIn</dt>
            <dd>
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer">
                in/sinclair-nzenwata
              </a>
            </dd>
          </div>
          <div>
            <dt>GitHub</dt>
            <dd>
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer">
                github.com/starksinclair
              </a>
            </dd>
          </div>
          <div>
            <dt>Google Scholar</dt>
            <dd>
              <a
                href={
                  profile.socials.googleScholarProfile ??
                  profile.socials.googleScholarLookup
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.socials.googleScholarProfile
                  ? "My Scholar profile"
                  : "Citations for the Forecasting paper"}
              </a>
            </dd>
          </div>
          {profile.socials.orcid && (
            <div>
              <dt>ORCID</dt>
              <dd>
                <a href={profile.socials.orcid} target="_blank" rel="noopener noreferrer">
                  {profile.socials.orcid.replace("https://", "")}
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt>Based in</dt>
            <dd>
              {profile.location.city}, {profile.location.region}. Open to remote
            </dd>
          </div>
        </dl>
      </Section>

      <Section id="form" title="Send a message">
        <form onSubmit={send} style={{ maxWidth: "42rem" }}>
          <div className="field">
            <label className="field__label" htmlFor="c-name">
              Name
            </label>
            <input
              className="field__input"
              id="c-name"
              name="name"
              type="text"
              required
              autoComplete="name"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="c-email">
              Email
            </label>
            <input
              className="field__input"
              id="c-email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="c-subject">
              Subject
            </label>
            <input
              className="field__input"
              id="c-subject"
              name="subject"
              type="text"
              required
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="c-message">
              Message
            </label>
            <textarea className="field__textarea" id="c-message" name="message" required />
          </div>

          <button
            type="submit"
            className="button button--primary"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>

          <div role="status" aria-live="polite">
            {status === "sent" && (
              <p className="form-status form-status--ok">
                Sent. I'll reply to the address you gave.
              </p>
            )}
            {status === "error" && (
              <p className="form-status form-status--error">
                That didn't send. Email me directly at{" "}
                <a href={`mailto:${profile.email}`}>{profile.email}</a>.
              </p>
            )}
          </div>
        </form>
      </Section>

      <Pager prev={prev && { label: prev.label, path: prev.path }} />
    </Page>
  );
}
