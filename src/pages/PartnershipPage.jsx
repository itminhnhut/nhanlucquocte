import StaticArticlePage from "../components/StaticArticlePage";
import { PARTNERSHIP_LEAD, PARTNERSHIP_PATH, PARTNERSHIP_SECTIONS } from "../content/partnership";

function PartnershipPage() {
  return (
    <StaticArticlePage
      path={PARTNERSHIP_PATH}
      crumb="Hợp tác doanh nghiệp"
      heading="Hợp tác doanh nghiệp, thực tập và tuyển dụng"
      lead={PARTNERSHIP_LEAD}
      sections={PARTNERSHIP_SECTIONS}
    />
  );
}

export default PartnershipPage;
