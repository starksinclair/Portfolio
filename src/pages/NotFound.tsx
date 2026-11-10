import { Link } from "react-router-dom";
import { Page } from "../components/Page";
import { graph, webPageNode } from "../lib/schema";

export function NotFound({
  what = "page",
  backLabel = "Overview",
  backPath = "/",
}: {
  what?: string;
  backLabel?: string;
  backPath?: string;
}) {
  const jsonLd = graph([
    webPageNode({
      path: "/404",
      title: "Not found",
      description: "This page does not exist.",
    }),
  ]);

  return (
    <Page
      eyebrow="404"
      title="Not found"
      description={`There is no ${what} at this address. It may have been renamed, or the link may be wrong.`}
      path="/404"
      jsonLd={jsonLd}
      noIndex
    >
      <div className="not-found">
        <Link to={backPath} className="button button--primary">
          {backLabel}
        </Link>
      </div>
    </Page>
  );
}
