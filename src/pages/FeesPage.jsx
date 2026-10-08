import StaticArticlePage from "../components/StaticArticlePage";
import { FEES_LEAD, FEES_PATH, FEES_SECTIONS } from "../content/fees";

function FeesPage() {
  return (
    <StaticArticlePage
      path={FEES_PATH}
      crumb="Học phí"
      heading="Học phí trung cấp nghề và chính sách miễn giảm"
      lead={FEES_LEAD}
      sections={FEES_SECTIONS}
    />
  );
}

export default FeesPage;
