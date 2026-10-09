import StaticArticlePage from "../components/StaticArticlePage";
import { FEES_LEAD, FEES_PATH, FEES_SECTIONS } from "../content/fees";

function FeesPage() {
  return (
    <StaticArticlePage
      path={FEES_PATH}
      crumb="Học phí"
      heading="Học phí trung cấp nghề Nhân Lực Quốc Tế"
      lead={FEES_LEAD}
      sections={FEES_SECTIONS}
    />
  );
}

export default FeesPage;
